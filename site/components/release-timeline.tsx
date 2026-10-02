import Link from 'next/link';
import { ArrowUpRight, CalendarDays } from 'lucide-react';
import { categoryNames, findCosmetic, formatDay, imagesOf, nameOf, type Locale } from '@/lib/catalog';
import { sources, type ReleaseEvent } from '@/lib/roadmap';
import { upcomingEntries } from '@/lib/roadmap-domain.mjs';
import { daysUntil } from '@/lib/archive-domain.mjs';
import type { CosmeticClickHandler } from '@/components/use-quick-view';

export function ScheduleEvidence({ ids, l }: { ids: string[]; l: Locale }) {
  return <ul className="schedule-sources">{ids.map(id => {
    const s = sources.find(source => source.id === id);
    return s ? <li key={id}><a href={s.url} target="_blank" rel="noreferrer">{s.titleOriginal}<ArrowUpRight size={13} /></a></li> : null;
  })}</ul>;
}
export default function ReleaseTimeline({ l, events, today, onCosmeticClick }: {
  l: Locale; events: ReleaseEvent[]; today: string;
  onCosmeticClick: CosmeticClickHandler;
}) {
  const t = (en: string, ko: string) => l === 'ko' ? ko : en;
  const entries = upcomingEntries(events, [], today) as { kind: 'official'; date: string; event: ReleaseEvent }[];
  return <section className="release-timeline" aria-label={t('Upcoming release roadmap', '앞으로의 출시 로드맵')}>
    <div className="timeline-summary" aria-live="polite">
      <span>{t('From today onward', '오늘부터, 앞으로')}</span><span>{entries.length} {t('appearances', '개 외관')}</span>
    </div>
    {entries.length ? (['official'] as const).map(group => {
      const rows = entries.filter(entry => entry.kind === group);
      if (!rows.length) return null;
      return <section className={`timeline-group ${group}`} key={group} aria-labelledby={`timeline-${group}`}>
      <div className="timeline-group-heading">
        <h2 id={`timeline-${group}`}>{t('Official dates', '공식 일정')}</h2>
        <span>{t('Confirmed announcements', '공식 발표 기준')}</span>
      </div>
      <ol className="timeline-list">{rows.map(entry => {
      const e = entry.event;
      const c = findCosmetic(e.cosmeticId)!;
      const picture = imagesOf(c)[0];
      const delta = e ? daysUntil(e.date, today) : null;
      const status = e?.status === 'released' ? t('Released', '출시 확인') : t('Officially scheduled', '공식 출시 예정');
      return <li className={`timeline-entry ${entry.kind}`} key={e.id}>
        <div className="timeline-date">
          <span className="schedule-kind"><CalendarDays size={15} />{status}</span>
          <time dateTime={e.date}>{formatDay(e.date, l)}</time>
          {e && delta !== null && delta >= 0 && <span className="timeline-countdown">{delta === 0 ? t('Today', '오늘') : `D−${delta}`}</span>}
        </div>
        <article className="timeline-card">
          <Link className="timeline-art" href={`/${l}/cosmetics/${c.id}`} aria-label={nameOf(c, l)} onClick={event => onCosmeticClick(event, c.id)} prefetch={false} aria-haspopup="dialog">
            {picture ? <img src={picture.thumbnail} alt="" width={240} height={300} loading="lazy" decoding="async" /> : <span className="timeline-no-image">鏡</span>}
            <span className="timeline-image-origin">{(picture ? c.images[picture.index]?.server ?? c.mediaServer : c.mediaServer) === 'Global' ? t('Global preview', '글로벌 이미지') : t('CN preview', '중국 이미지')}</span>
          </Link>
          <div className="timeline-copy">
            <span className="timeline-category">{categoryNames[c.category][l]}</span>
            <h3><Link href={`/${l}/cosmetics/${c.id}`} onClick={event => onCosmeticClick(event, c.id)} prefetch={false} aria-haspopup="dialog">{nameOf(c, l)}<ArrowUpRight size={18}/></Link></h3>
            <p className="timeline-original">{c.nameOriginal}{c.cnRelease.date && <> · CN {formatDay(c.cnRelease.date, l)}</>}</p>
            <p className="timeline-reason">{e.scope[l]}</p>
            <details className="timeline-evidence">
              <summary>{t('Why this date', '일정의 근거')}</summary>
              <ScheduleEvidence ids={e.sourceIds} l={l}/>
            </details>
          </div>
        </article>
      </li>;
    })}</ol></section>;
    }) : <div className="timeline-empty"><CalendarDays size={28}/><h2>{t('The next date is still open.', '다음 일정은 아직 미정입니다.')}</h2><p>{t('Only official announcements appear here. Switch to the calendar for recorded releases.', '공식 예고만 표시합니다. 지난 출시 기록은 캘린더에서 볼 수 있습니다.')}</p></div>}
  </section>;
}
