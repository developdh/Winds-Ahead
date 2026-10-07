import { isDay } from './roadmap-domain.mjs';
import { releaseState } from './regional-domain.mjs';

export const sortKeys = ['latest', 'cn-newest', 'cn-oldest', 'global-newest', 'global-oldest', 'upcoming', 'name-asc', 'name-desc'];
export function validSort(value) { return sortKeys.includes(value) ? value : 'latest'; }
export function validServer(value) { return ['cn', 'global', 'cn-upcoming', 'global-upcoming', 'pending'].includes(value) ? value : 'all'; }

// Date-only records are compared as UTC calendar days, never as release instants.
export function daysUntil(day, today) {
  if (!isDay(day) || !isDay(today)) return null;
  return Math.round((Date.parse(`${day}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) / 86400000);
}

export function globalOutlook(id, record, events, today) {
  if (releaseState(record, today) === 'released') return null;
  const official = events.filter(e => e.cosmeticId === id && e.server === 'Global' && e.kind === 'release' && e.status === 'announced')
    .sort((a, b) => a.date.localeCompare(b.date));
  const event = official.find(e => e.date >= today) ?? official.at(-1);
  if (event || ['announced', 'pending'].includes(releaseState(record, today))) {
    const date = event?.date ?? record?.releaseDate;
    const days = daysUntil(date, today);
    return { kind: 'official', precision: 'day', start: date ?? null, end: date ?? null,
      days: days !== null && days >= 0 ? days : null, endDays: null, month: null, version: null,
      pending: Boolean(record?.confirmationPending) || (days !== null && days < 0), sortDate: !record?.confirmationPending && days !== null && days >= 0 ? date : null };
  }
  return null;
}

/** @param {{id:string,name:string,cnDate:string|null,globalDate:string|null,upcomingDate:string|null}[]} rows */
export function sortArchive(rows, requested, locale) {
  const sort = validSort(requested);
  const names = new Intl.Collator(locale, { numeric: true, sensitivity: 'base' });
  const nameOrder = (a, b) => names.compare(a.name, b.name) || a.id.localeCompare(b.id);
  return [...rows].sort((a, b) => {
    if (sort.startsWith('name-')) return nameOrder(a, b) * (sort === 'name-desc' ? -1 : 1);
    const key = row => sort.startsWith('cn-') ? row.cnDate : sort.startsWith('global-') ? row.globalDate : sort === 'upcoming' ? row.upcomingDate : [row.cnDate, row.globalDate].filter(Boolean).sort().at(-1);
    const x = key(a), y = key(b);
    // Missing dates remain last in both directions, with a stable, readable tie-break.
    if (!x || !y) return x ? -1 : y ? 1 : nameOrder(a, b);
    return x.localeCompare(y) * (sort.endsWith('oldest') || sort === 'upcoming' ? 1 : -1) || nameOrder(a, b);
  });
}
