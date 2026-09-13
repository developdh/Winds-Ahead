import { CalendarDays, Sparkles } from 'lucide-react';
import { globalOutlook } from '@/lib/archive-domain.mjs';
import { regionalRecord } from '@/lib/regional-status';
import { forecasts, globalEvents } from '@/lib/roadmap';
import type { Cosmetic, Locale } from '@/lib/catalog';

export function outlookFor(c: Cosmetic, today: string) {
  return globalOutlook(c.id, regionalRecord(c, 'Global'), globalEvents, forecasts, today);
}
export default function ReleaseOutlook({ c, l, today }: { c: Cosmetic; l: Locale; today: string }) {
  if (!today) return null;
  const outlook = outlookFor(c, today);
  if (!outlook) return null;
  const t = (en: string, ko: string) => l === 'ko' ? ko : en;
  const official = outlook.kind === 'official';
  const d = (days: number) => days === 0 ? t('Today', '오늘') : `D-${days}`;
  let timing = t('Date TBD', '날짜 미정');
  if (outlook.pending) timing = t('Awaiting update', '출시 확인 중');
  else if (outlook.days !== null && outlook.days >= 0) timing = d(outlook.days) + (!official && outlook.endDays !== null && outlook.endDays !== outlook.days ? `–${d(outlook.endDays)}` : '');
  else if (outlook.endDays !== null && outlook.endDays >= 0) timing = t('Within estimated window', '예상 기간 중');
  else if (outlook.month) timing = `${outlook.month.replace('-', '.')}`;
  else if (outlook.version) timing = outlook.version;
  const detail = [outlook.start, outlook.end !== outlook.start ? outlook.end : null].filter(Boolean).join(' – ');
  return <p className={`release-outlook ${outlook.kind}`} title={`${detail || timing} · ${t('Calendar days compared in UTC; release time is unconfirmed.', 'UTC 날짜 기준 비교이며 정확한 출시 시각은 미확인입니다.')}`}>
    {official ? <CalendarDays size={13} /> : <Sparkles size={13} />}
    <span>{official ? t('Global scheduled', '글로벌 출시 예정') : t('Global estimated', '글로벌 출시 예상')} <strong>{timing}</strong></span>
  </p>;
}
