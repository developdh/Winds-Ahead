import { CalendarDays, Clock3 } from 'lucide-react';
import { daysUntil, globalOutlook } from '@/lib/archive-domain.mjs';
import { regionalRecord, regionalState } from '@/lib/regional-status';
import { globalEvents } from '@/lib/roadmap';
import type { Cosmetic, Locale } from '@/lib/catalog';

export function outlookFor(c: Cosmetic, today: string) {
  return globalOutlook(c.id, regionalRecord(c, 'Global'), globalEvents, today);
}
export default function ReleaseOutlook({ c, l, today }: { c: Cosmetic; l: Locale; today: string }) {
  if (!today) return null;
  const cn = regionalRecord(c, 'CN');
  const state = regionalState(c, 'CN', today);
  const days = daysUntil(cn?.releaseDate, today);
  const t = (en: string, ko: string) => l === 'ko' ? ko : en;
  return <>
    {(state === 'announced' || state === 'pending') && <p className={`release-outlook ${state === 'pending' ? 'pending' : 'official'}`} title={cn?.scope[l]}>
      {state === 'pending' ? <Clock3 size={13} /> : <CalendarDays size={13} />}
      <span>{state === 'pending' ? t('China release unverified', '중국 출시 확인 중') : t('China scheduled', '중국 출시 예정')}
        {state === 'announced' && <> <strong>{days === null ? t('Date TBD', '날짜 미정') : days === 0 ? t('Today', '오늘') : `D-${days}`}</strong></>}
      </span>
    </p>}
    <GlobalOutlook c={c} l={l} today={today} />
  </>;
}

function GlobalOutlook({ c, l, today }: { c: Cosmetic; l: Locale; today: string }) {
  const outlook = outlookFor(c, today);
  if (!outlook) return null;
  const t = (en: string, ko: string) => l === 'ko' ? ko : en;
  const d = (days: number) => days === 0 ? t('Today', '오늘') : `D-${days}`;
  let timing = t('Date TBD', '날짜 미정');
  if (outlook.pending) timing = t('Awaiting update', '출시 확인 중');
  else if (outlook.days !== null && outlook.days >= 0) timing = d(outlook.days);
  const detail = [outlook.start, outlook.end !== outlook.start ? outlook.end : null].filter(Boolean).join(' – ');
  return <p className={`release-outlook ${outlook.pending ? 'pending' : outlook.kind}`} title={`${detail || timing} · ${t('Calendar days compared in UTC; release time is unconfirmed.', 'UTC 날짜 기준 비교이며 정확한 출시 시각은 미확인입니다.')}`}>
    {outlook.pending ? <Clock3 size={13} /> : <CalendarDays size={13} />}
    <span>{outlook.pending ? t('Global release unverified', '글로벌 출시 확인 중') : <>{t('Global scheduled', '글로벌 출시 예정')} <strong>{timing}</strong></>}</span>
  </p>;
}
