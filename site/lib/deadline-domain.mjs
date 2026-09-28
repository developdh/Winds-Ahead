const HOUR = 3_600_000;
const DAY = 24 * HOUR;

/** An unstated zone spans UTC+14 through UTC-12. A day is never an exact instant. */
export function deadlineBounds(deadline) {
  const local = Date.parse(`${deadline.end}${deadline.precision === 'day' ? 'T00:00:00' : ''}Z`);
  const width = deadline.precision === 'day' ? DAY : deadline.precision === 'minute' ? 60_000 : 0;
  const offset = deadline.timezone === 'UTC+8' ? 8 * HOUR : 0;
  return deadline.timezone === null
    ? { earliest: local - 14 * HOUR, latest: local + 12 * HOUR + width }
    : { earliest: local - offset, latest: local - offset + width };
}

export function deadlineState(deadline, now) {
  if (!Number.isFinite(now) || now <= 0) return 'unresolved';
  const { earliest, latest } = deadlineBounds(deadline);
  if (now >= latest) return 'ended';
  if (now >= earliest) return 'check-time';
  // Do not advertise a future listing as presently ending.
  if (deadline.startDate && now < Date.parse(`${deadline.startDate}T00:00:00Z`) - 14 * HOUR) return 'upcoming';
  return earliest - now <= 7 * DAY ? 'ending-soon' : 'scheduled';
}

export function endingDeadlines(records, server, now) {
  return records.filter(d => d.server === server && ['ending-soon', 'check-time'].includes(deadlineState(d, now)))
    .sort((a, b) => deadlineBounds(a).earliest - deadlineBounds(b).earliest || a.id.localeCompare(b.id));
}
