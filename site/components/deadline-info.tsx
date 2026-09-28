import Link from 'next/link';
import { Clock3, ArrowUpRight } from 'lucide-react';
import { findCosmetic, imagesOf, nameOf, type Locale, type Server } from '@/lib/catalog';
import { deadlineDate, deadlineKinds, deadlines, type Deadline } from '@/lib/deadlines';
import { deadlineState, endingDeadlines } from '@/lib/deadline-domain.mjs';
import { serverName } from '@/lib/regional-status';
import { sources } from '@/lib/roadmap';
import type { CosmeticClickHandler } from '@/components/use-quick-view';

export function DeadlineBadge({ id, server, l, now }: { id: string; server: Server; l: Locale; now: number }) {
  const d = (endingDeadlines(deadlines, server, now) as Deadline[]).find(d => d.cosmeticId === id);
  if (!d) return null;
  return <p className="deadline-badge" title={deadlineDate(d, l)}><Clock3 size={14}/>
    {serverName(server, l)} · {deadlineKinds[d.kind][l]} · {deadlineState(d, now) === 'check-time' ? (l === 'ko' ? '시각 확인' : 'check time') : (l === 'ko' ? '임박' : 'soon')}
  </p>;
}

export function DeadlineDetails({ id, server, l, now }: { id: string; server: Server; l: Locale; now: number }) {
  const records = deadlines.filter(d => d.cosmeticId === id && d.server === server);
  return records.map(d => {
    const state = deadlineState(d, now);
    const source = sources.find(s => s.id === d.sourceIds[0])!;
    return <div key={d.id} className={`deadline-detail ${['ending-soon', 'check-time'].includes(state) ? 'is-near' : ''}`}>
      <p><Clock3 size={16}/><span>{deadlineKinds[d.kind][l]}</span>
        {state === 'ending-soon' && <span className="deadline-state">{l === 'ko' ? '7일 이내' : 'Within 7 days'}</span>}
        {state === 'check-time' && <span className="deadline-state">{l === 'ko' ? '정확한 시각 확인' : 'Check exact time'}</span>}
        {state === 'ended' && <span className="deadline-state">{l === 'ko' ? '공지 기간 경과' : 'Scheduled period passed'}</span>}
      </p>
      <time>{deadlineDate(d, l)}</time>
      <p className="small-muted">{d.note[l]}</p>
      <a className="text-link" href={source.url} target="_blank" rel="noreferrer">{l === 'ko' ? '종료 일정 출처' : 'Deadline source'}<ArrowUpRight size={14}/></a>
    </div>;
  });
}

export function EndingSoon({ server, l, now, onCosmeticClick }: { server: Server; l: Locale; now: number; onCosmeticClick: CosmeticClickHandler }) {
  const records = endingDeadlines(deadlines, server, now) as Deadline[];
  if (!records.length) return null;
  return <section className="ending-soon" aria-labelledby="ending-soon-title">
    <div className="ending-heading"><h2 id="ending-soon-title"><Clock3 size={20}/>{l === 'ko' ? '종료 임박' : 'Ending soon'}</h2><span>{serverName(server, l)} · {l === 'ko' ? '7일 이내' : 'Within 7 days'}</span></div>
    <p className="small-muted">{l === 'ko' ? '공식 공지의 판매·교환·이벤트 마감입니다. 시각이나 시간대가 없으면 게임 안에서 확인하세요.' : 'Official sale, exchange and event deadlines. Check in game when the time or zone is unstated.'}</p>
    <div className="ending-list">{records.map(d => {
      const c = findCosmetic(d.cosmeticId)!;
      const m = imagesOf(c)[0];
      return <Link key={d.id} href={`/${l}/cosmetics/${c.id}`} onClick={event => onCosmeticClick(event, c.id)} prefetch={false} aria-haspopup="dialog" className="ending-item">
        {m ? <img src={m.preview} width={48} height={60} alt="" loading="lazy"/> : <span className="ending-no-image" aria-hidden="true">鏡</span>}
        <span><strong>{nameOf(c, l)}</strong><small>{deadlineKinds[d.kind][l]} · {deadlineDate(d, l)}</small></span><ArrowUpRight size={16}/>
      </Link>;
    })}</div>
  </section>;
}
