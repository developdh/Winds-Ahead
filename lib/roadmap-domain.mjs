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
