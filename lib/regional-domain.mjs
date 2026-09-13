import { isDay } from './roadmap-domain.mjs';

// A schedule is evidence of an announcement, never proof that a release happened.
export function releaseState(record, today) {
  if (!record) return 'unknown';
  const dated = isDay(record.releaseDate) && isDay(today);
  if (dated && record.releaseDate > today) return 'announced';
  if (record.status === 'released') return 'released';
  if (record.status === 'announced') {
    if (record.confirmationPending || (dated && record.releaseDate < today)) return 'pending';
    return 'announced';
  }
  return 'unknown';
}

export function matchesReleaseFilter(cn, global, filter, today) {
  if (filter === 'cn') return releaseState(cn, today) === 'released';
  if (filter === 'global') return releaseState(global, today) === 'released';
  if (filter === 'cn-upcoming') return releaseState(cn, today) === 'announced';
  if (filter === 'global-upcoming') return releaseState(global, today) === 'announced';
  if (filter === 'pending') return [cn, global].some(r => releaseState(r, today) === 'pending');
  return true;
}
