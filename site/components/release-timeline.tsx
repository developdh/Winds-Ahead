import Link from 'next/link';
import { ArrowUpRight, CalendarDays, Sparkles } from 'lucide-react';
import { categoryNames, findCosmetic, formatDay, imagesOf, nameOf, type Locale } from '@/lib/catalog';
import { sources, type Forecast, type ReleaseEvent } from '@/lib/roadmap';
import { upcomingEntries } from '@/lib/roadmap-domain.mjs';
import { daysUntil } from '@/lib/archive-domain.mjs';
import type { CosmeticClickHandler } from '@/components/use-quick-view';

export function ScheduleEvidence({ ids, l }: { ids: string[]; l: Locale }) {
  return <ul className="schedule-sources">{ids.map(id => {
    const s = sources.find(source => source.id === id);
    return s ? <li key={id}><a href={s.url} target="_blank" rel="noreferrer">{s.titleOriginal}<ArrowUpRight size={13} /></a></li> : null;
  })}</ul>;
}
export function forecastWindow(f: Forecast, l: Locale) {
  if (f.precision === 'window') return `${formatDay(f.start!, l)} – ${formatDay(f.end!, l)}`;
  if (f.precision === 'version') return `${l === 'ko' ? '버전' : 'Version'} ${f.version}`;
  return new Intl.DateTimeFormat(l === 'ko' ? 'ko-KR' : 'en-US', { year: 'numeric', month: 'long', timeZone: 'UTC' }).format(new Date(`${f.month}-15T12:00:00Z`));
}
export default function ReleaseTimeline({ l, events, forecasts, today, kind, releasedIds, onCosmeticClick }: {
  l: Locale; events: ReleaseEvent[]; forecasts: Forecast[]; today: string; kind: string; releasedIds: string[];
  onCosmeticClick: CosmeticClickHandler;
}) {
  const t = (en: string, ko: string) => l === 'ko' ? ko : en;
  const entries = upcomingEntries(events, forecasts, today, kind, releasedIds) as ({ kind: 'official'; date: string; event: ReleaseEvent } | { kind: 'forecast'; date: string; forecast: Forecast })[];
  return <section className="release-timeline" aria-label={t('Upcoming release roadmap', '앞으로의 출시 로드맵')}>
    <div className="timeline-summary" aria-live="polite">
      <span>{t('From today onward', '오늘부터, 앞으로')}</span><span>{entries.length} {t('appearances', '개 외관')}</span>
    </div>
    {entries.length ? <ol className="timeline-list">{entries.map(entry => {
      const official = entry.kind === 'official';
      const f = entry.kind === 'forecast' ? entry.forecast : null;
      const e = entry.kind === 'official' ? entry.event : null;
      const c = findCosmetic((e ?? f)!.cosmeticId)!;
      const picture = imagesOf(c)[0];
      const delta = e ? daysUntil(e.date, today) : null;
      const status = e?.status === 'released' ? t('Released', '출시 확인') : delta !== null && delta < 0 ? t('Awaiting release check', '출시 여부 확인 중') : t('Officially scheduled', '공식 출시 예정');
      return <li className={`timeline-entry ${entry.kind}`} key={e?.id ?? f!.id}>
        <div className="timeline-date">
          <span className="schedule-kind">{official ? <CalendarDays size={15} /> : <Sparkles size={15} />}{official ? status : t('Editorial estimate', '출시 예상')}</span>
          {e ? <time dateTime={e.date}>{formatDay(e.date, l)}</time> : <span className="timeline-window">{forecastWindow(f!, l)}</span>}
          {e && delta !== null && delta >= 0 && <span className="timeline-countdown">{delta === 0 ? t('Today', '오늘') : `D−${delta}`}</span>}
          {f && <small>{t('Limited evidence · Not official', '근거 제한적 · 비공식')}</small>}
        </div>
        <article className="timeline-card">
          <Link className="timeline-art" href={`/${l}/cosmetics/${c.id}`} aria-label={nameOf(c, l)} onClick={event => onCosmeticClick(event, c.id)} prefetch={false} aria-haspopup="dialog">
            {picture ? <img src={picture.thumbnail} alt="" width={240} height={300} loading="lazy" decoding="async" /> : <span className="timeline-no-image">鏡</span>}
            <span className="timeline-image-origin">{c.mediaServer === 'Global' ? t('Global preview', '글로벌 이미지') : t('CN preview', '중국 이미지')}</span>
          </Link>
          <div className="timeline-copy">
            <span className="timeline-category">{categoryNames[c.category][l]}</span>
            <h2><Link href={`/${l}/cosmetics/${c.id}`} onClick={event => onCosmeticClick(event, c.id)} prefetch={false} aria-haspopup="dialog">{nameOf(c, l)}<ArrowUpRight size={18}/></Link></h2>
            <p className="timeline-original">{c.nameOriginal}{c.cnRelease.date && <> · CN {formatDay(c.cnRelease.date, l)}</>}</p>
            <p className="timeline-reason">{e ? e.scope[l] : f!.rationale[l]}</p>
            <details className="timeline-evidence">
              <summary>{t('Why this date', '일정의 근거')}</summary>
              {f && <><p>{f.assumptions[l]}</p><p className="small-muted">{t('Review by', '재검토일')} {formatDay(f.reviewDue, l)}</p></>}
              <ScheduleEvidence ids={(e ?? f)!.sourceIds} l={l}/>
            </details>
          </div>
        </article>
      </li>;
    })}</ol> : <div className="timeline-empty"><CalendarDays size={28}/><h2>{t('The next date is still open.', '다음 일정은 아직 미정입니다.')}</h2><p>{t('Only verified announcements and current editorial estimates appear here. Switch to the calendar for recorded releases.', '확인된 공식 예고와 유효한 예상만 표시합니다. 지난 출시 기록은 캘린더에서 볼 수 있습니다.')}</p></div>}
  </section>;
}
