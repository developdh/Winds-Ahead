export function isDay(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value))
    return false;
  const d = new Date(`${value}T12:00:00Z`);
  return Number.isFinite(d.valueOf()) && d.toISOString().slice(0, 10) === value;
}
export function isMonth(value) {
  return typeof value === "string" && /^\d{4}-(0[1-9]|1[0-2])$/.test(value);
}
export function shiftMonth(month, amount) {
  if (!isMonth(month)) throw new Error("Invalid month");
  const [y, m] = month.split("-").map(Number);
  const d = new Date(Date.UTC(y, m - 1 + amount, 15));
  return d.toISOString().slice(0, 7);
}
export function monthGrid(month) {
  if (!isMonth(month)) throw new Error("Invalid month");
  const [y, m] = month.split("-").map(Number);
  const first = new Date(Date.UTC(y, m - 1, 1));
  const offset = first.getUTCDay();
  const days = new Date(Date.UTC(y, m, 0)).getUTCDate();
  return Array.from({ length: Math.ceil((offset + days) / 7) * 7 }, (_, i) => {
    const n = i - offset + 1;
    return n > 0 && n <= days ? `${month}-${String(n).padStart(2, "0")}` : null;
  });
}
export function latestRevisions(revisions) {
  const map = new Map();
  for (const r of revisions) {
    const previous = map.get(r.id);
    if (!previous || previous.revision < r.revision) map.set(r.id, r);
  }
  return [...map.values()];
}
export function forecastDue(forecast, today) {
  return forecast.state === "active" && forecast.reviewDue < today;
}
export function forecastEnded(forecast, today) {
  if (forecast.precision === "month") return forecast.month < today.slice(0, 7);
  if (forecast.precision === "window") return forecast.end < today;
  return false;
}
export function forecastInMonth(forecast, month) {
  if (forecast.precision === "month") return forecast.month === month;
  if (forecast.precision === "window")
    return (
      forecast.start.slice(0, 7) <= month && forecast.end.slice(0, 7) >= month
    );
  return false;
}
export function cleanWatchlist(value, ids) {
  if (!Array.isArray(value)) return [];
  const valid = new Set(ids);
  return [
    ...new Set(value.filter((x) => typeof x === "string" && valid.has(x))),
  ];
}

// Review deadlines flag estimates for attention; only elapsed windows expire them.
// Official releases override editorial forecasts, including announcements that have
// left the upcoming view. Past records and forecast history remain unchanged.
export function upcomingEntries(events, revisions, today, kind = 'all', releasedIds = []) {
  const official = events.filter(e => e.status !== 'cancelled');
  const known = new Set([...releasedIds, ...official.filter(e => e.kind === 'release').map(e => e.cosmeticId)]);
  const entries = kind === 'forecast' ? [] : official
    .filter(e => e.date > today || (e.date === today && e.status === 'announced'))
    .map(event => ({ kind: 'official', date: event.date, event }));
  if (kind !== 'official') for (const forecast of latestRevisions(revisions)) {
    if (forecast.state !== 'active' || known.has(forecast.cosmeticId) || forecastEnded(forecast, today)) continue;
    entries.push({ kind: 'forecast', date: forecast.precision === 'window' ? forecast.start : forecast.precision === 'month' ? `${forecast.month}-01` : '9999-12-31', forecast });
  }
  return entries.sort((a, b) => a.date.localeCompare(b.date) || (a.kind === b.kind ? 0 : a.kind === 'official' ? -1 : 1) || (a.event?.id ?? a.forecast.id).localeCompare(b.event?.id ?? b.forecast.id));
}
