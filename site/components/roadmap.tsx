"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowUpRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Compass,
  History,
  Info,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NativeSelect } from "@/components/ui/native-select";
import {
  cosmetics,
  findCosmetic,
  formatDay,
  imagesOf,
  nameOf,
  type Locale,
} from "@/lib/catalog";
import {
  cnEvents,
  forecasts,
  globalEvents,
  sources,
  type Forecast,
} from "@/lib/roadmap";
import {
  forecastDue,
  forecastEnded,
  forecastInMonth,
  isMonth,
  latestRevisions,
  monthGrid,
  shiftMonth,
} from "@/lib/roadmap-domain.mjs";
export default function Roadmap({ l, saved }: { l: Locale; saved: string[] }) {
  const t = (en: string, ko: string) => (l === "ko" ? ko : en);
  const params = useSearchParams();
  const today = new Date().toISOString().slice(0, 10);
  const currentMonth = today.slice(0, 7);
  const [month, setMonth] = useState(
    isMonth(params.get("month")) ? params.get("month")! : currentMonth,
  );
  const [server, setServer] = useState(
    params.get("server") === "cn" ? "cn" : "global",
  );
  const [kind, setKind] = useState(
    ["official", "forecast"].includes(params.get("kind") ?? "")
      ? params.get("kind")!
      : "all",
  );
  const [onlySaved, setOnlySaved] = useState(params.get("saved") === "1");
  const [layout, setLayout] = useState(
    params.get("view") === "list" ? "list" : "month",
  );
  useEffect(() => {
    setMonth(
      isMonth(params.get("month")) ? params.get("month")! : currentMonth,
    );
    setServer(params.get("server") === "cn" ? "cn" : "global");
    setKind(
      ["official", "forecast"].includes(params.get("kind") ?? "")
        ? params.get("kind")!
        : "all",
    );
    setOnlySaved(params.get("saved") === "1");
    setLayout(params.get("view") === "list" ? "list" : "month");
  }, [params, currentMonth]);
  function update(values: Record<string, string>) {
    const p = new URLSearchParams(location.search);
    Object.entries(values).forEach(([k, v]) => (v ? p.set(k, v) : p.delete(k)));
    history.replaceState(null, "", `${location.pathname}?${p}`);
    if ("month" in values) setMonth(values.month);
    if ("server" in values) setServer(values.server);
    if ("kind" in values) setKind(values.kind || "all");
    if ("saved" in values) setOnlySaved(values.saved === "1");
    if ("view" in values) setLayout(values.view);
  }
  const events = (server === "cn" ? cnEvents : globalEvents).filter(
    (e) =>
      e.date.startsWith(month) &&
      kind !== "forecast" &&
      (!onlySaved || saved.includes(e.cosmeticId)),
  );
  const latest = latestRevisions(forecasts) as Forecast[];
  const active = latest.filter((f) => f.state === "active");
  const estimates = active.filter(
    (f) =>
      server === "global" &&
      kind !== "official" &&
      forecastInMonth(f, month) &&
      (!onlySaved || saved.includes(f.cosmeticId)),
  );
  const unscheduled = cosmetics
    .filter((c) => !onlySaved || saved.includes(c.id))
    .filter((c) =>
      server === "global"
        ? !globalEvents.some(
            (e) => e.cosmeticId === c.id && e.status !== "cancelled",
          ) &&
          !active.some((f) => f.cosmeticId === c.id && !forecastEnded(f, today))
        : !c.cnRelease.date,
    );
  const versionForecasts = active.filter(
    (f) =>
      server === "global" &&
      kind !== "official" &&
      f.precision === "version" &&
      (!onlySaved || saved.includes(f.cosmeticId)),
  );
  const title = new Intl.DateTimeFormat(l === "ko" ? "ko-KR" : "en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${month}-15T12:00:00Z`));
  const days =
    l === "ko"
      ? ["일", "월", "화", "수", "목", "금", "토"]
      : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const grid = useMemo(() => monthGrid(month), [month]);
  function Estimate({ f }: { f: Forecast }) {
    const c = findCosmetic(f.cosmeticId)!;
    const stale = forecastDue(f, today) || forecastEnded(f, today);
    return (
      <article className="estimate">
        <div>
          <Sparkles size={17} />
          <span className="badge forecast">
            {t("Estimated", "예상")} ·{" "}
            {f.evidenceLevel === "supported"
              ? t("Supported", "근거 충분")
              : t("Limited evidence", "근거 제한적")}
          </span>
          {stale && (
            <span className="badge">{t("Review due", "재검토 필요")}</span>
          )}
        </div>
        <h3>
          <Link href={`/${l}/cosmetics/${c.id}`}>{nameOf(c, l)}</Link>
        </h3>
        <p className="estimate-window">
          {f.precision === "month"
            ? f.month
            : f.precision === "window"
              ? `${formatDay(f.start!, l)} – ${formatDay(f.end!, l)}`
              : f.version}
        </p>
        <p>{f.rationale[l]}</p>
        <details>
          <summary>{t("Assumptions & evidence", "가정과 근거")}</summary>
          <p>{f.assumptions[l]}</p>
          <ul>
            {f.sourceIds.map((id) => {
              const s = sources.find((s) => s.id === id)!;
              return (
                <li key={id}>
                  <a href={s.url} target="_blank" rel="noreferrer">
                    {s.titleOriginal}
                  </a>
                </li>
              );
            })}
          </ul>
          <small>
            {t("Review due", "재검토일")} {formatDay(f.reviewDue, l)}
          </small>
        </details>
      </article>
    );
  }
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">WINDS AHEAD · RELEASE ROADMAP</p>
          <h1>{t("Follow the next chapter", "출시 로드맵")}</h1>
          <p className="intro">
            {t(
              "Official dates and editorial estimates, with the evidence in view.",
              "공식 일정과 운영자 예상을, 근거와 함께 살펴보세요.",
            )}
          </p>
        </div>
        <Link className="text-link" href={`/${l}/about`}>
          {t("How forecasts work", "예상 기준 보기")}
          <ArrowUpRight size={17} />
        </Link>
      </div>
      <div className="roadmap-controls">
        <Tabs value={server} onValueChange={(v) => update({ server: v })}>
          <TabsList className="server-tabs" aria-label={t("Server", "서버")}>
            <TabsTrigger value="global">{t("Global", "글로벌")}</TabsTrigger>
            <TabsTrigger value="cn">
              {t("China · History", "중국 · 출시 기록")}
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="calendar-filters">
          <label>
            <span className="sr-only">{t("Event type", "일정 종류")}</span>
            <NativeSelect
              value={kind}
              onChange={(e) => update({ kind: e.target.value })}
            >
              <option value="all">{t("All information", "모든 정보")}</option>
              <option value="official">
                {t("Official dates", "공식 일정")}
              </option>
              <option value="forecast">
                {t("Editorial estimates", "예상 일정")}
              </option>
            </NativeSelect>
          </label>
          <label className="saved-filter">
            <input
              type="checkbox"
              checked={onlySaved}
              onChange={(e) => update({ saved: e.target.checked ? "1" : "" })}
            />
            {t("Watchlist only", "관심 외관만")}
          </label>
        </div>
      </div>
      <div className="calendar-note">
        <Info size={17} />
        <p>
          {server === "global"
            ? t(
                "CN releases do not establish global dates. Estimates stay unscheduled until the evidence supports a window.",
                "중국 출시 기록만으로 글로벌 날짜를 정하지 않습니다. 근거가 부족한 외관은 일정 미정으로 남깁니다.",
              )
            : t(
                "Historical CN release dates. A date here does not mean an item is currently on sale.",
                "중국의 과거 출시 기록입니다. 여기에 날짜가 있어도 현재 판매 중이라는 뜻은 아닙니다.",
              )}
          <span>
            {t(
              "Date-only records are not converted between time zones.",
              "날짜 단위 기록은 시간대에 따라 변환하지 않습니다.",
            )}
          </span>
        </p>
      </div>
      <section
        className="calendar-panel"
        aria-label={t("Release calendar", "출시 캘린더")}
      >
        <div className="month-toolbar">
          <div className="month-navigation">
            <button
              className="icon-button"
              onClick={() => update({ month: shiftMonth(month, -1) })}
              aria-label={t("Previous month", "이전 달")}
              disabled={month <= "2000-01"}
            >
              <ChevronLeft size={19} />
            </button>
            <h2 key={month} aria-live="polite">
              {title}
            </h2>
            <button
              className="icon-button"
              onClick={() => update({ month: shiftMonth(month, 1) })}
              aria-label={t("Next month", "다음 달")}
              disabled={month >= "2099-12"}
            >
              <ChevronRight size={19} />
            </button>
          </div>
          <div className="month-actions">
            <button
              className="outline-button"
              onClick={() => update({ month: currentMonth })}
            >
              {t("This month", "이번 달")}
            </button>
            <label className="month-picker">
              <span className="sr-only">{t("Choose month", "월 선택")}</span>
              <input
                type="month"
                min="2000-01"
                max="2099-12"
                value={month}
                onChange={(e) => {
                  if (isMonth(e.target.value))
                    update({ month: e.target.value });
                }}
              />
            </label>
            <div className="view-toggle">
              <button
                aria-pressed={layout === "month"}
                onClick={() => update({ view: "month" })}
              >
                {t("Month", "월간")}
              </button>
              <button
                aria-pressed={layout === "list"}
                onClick={() => update({ view: "list" })}
              >
                {t("List", "목록")}
              </button>
            </div>
          </div>
        </div>
        <div
          className={`calendar-grid ${layout === "list" ? "hide-calendar" : ""}`}
        >
          <div className="weekdays">
            {days.map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>
          <div className="month-grid">
            {grid.map((day, i) => (
              <div
                key={day ?? `blank-${i}`}
                className={`day-cell ${!day ? "outside" : ""} ${day === today ? "today" : ""}`}
                aria-label={day ? formatDay(day, l) : undefined}
              >
                {day && (
                  <>
                    <span className="day-number">{Number(day.slice(-2))}</span>
                    {events
                      .filter((e) => e.date === day)
                      .map((e) => {
                        const c = findCosmetic(e.cosmeticId)!;
                        return (
                          <Link
                            key={e.id}
                            className={`day-event ${e.status === "cancelled" ? "cancelled" : ""}`}
                            href={`/${l}/cosmetics/${c.id}`}
                          >
                            <span>
                              {e.status === "cancelled"
                                ? t("Cancelled", "취소")
                                : t("Official", "공식")}
                            </span>
                            {nameOf(c, l)}
                          </Link>
                        );
                      })}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
        <div
          className={`calendar-agenda ${layout === "list" ? "show-agenda" : ""}`}
        >
          {events.map((e) => {
            const c = findCosmetic(e.cosmeticId)!;
            return (
              <Link
                key={e.id}
                className="agenda-event"
                href={`/${l}/cosmetics/${c.id}`}
              >
                <time dateTime={e.date}>{formatDay(e.date, l)}</time>
                <span>
                  {nameOf(c, l)}
                  <small>{e.scope[l]}</small>
                </span>
                <span className="badge">
                  {e.status === "cancelled"
                    ? t("Cancelled", "취소")
                    : t("Official", "공식")}
                </span>
              </Link>
            );
          })}
        </div>
        {!events.length && (
          <div className="calendar-empty">
            <CalendarDays size={24} />
            <p>
              {t(
                "No official dates in this view.",
                "이 조건에 해당하는 공식 일정이 없습니다.",
              )}
            </p>
            {server === "cn" && month !== "2025-09" && (
              <button
                className="text-link"
                onClick={() =>
                  update({ month: "2025-09", kind: "all", saved: "" })
                }
              >
                {t(
                  "See recorded CN releases · Sep 2025",
                  "등록된 중국 출시 기록 보기 · 2025년 9월",
                )}
                <ArrowUpRight size={15} />
              </button>
            )}
            {server === "global" && (
              <button
                className="text-link"
                onClick={() =>
                  update({
                    server: "cn",
                    month: "2025-09",
                    kind: "all",
                    saved: "",
                  })
                }
              >
                {t("Explore CN release history", "중국 출시 기록 둘러보기")}
                <ArrowUpRight size={15} />
              </button>
            )}
          </div>
        )}
        <div className="calendar-legend">
          <span>
            <span className="legend-square" />
            {t("Official date", "공식 날짜")}
          </span>
          <span>
            <span className="legend-line" />
            {t(
              "Estimates are shown as windows below",
              "예상은 아래에서 기간 단위로 표시",
            )}
          </span>
          <span>
            {events.length} {t("dated entries", "날짜 기록")}
          </span>
        </div>
      </section>
      {server === "global" && kind !== "official" && (
        <section className="forecast-section">
          <div className="catalog-heading">
            <h2>
              <Sparkles size={20} />
              {t("Estimated windows", "예상 기간")}
            </h2>
            <span>{t("Editorial · Not official", "운영자 예상 · 비공식")}</span>
          </div>
          {estimates.length || versionForecasts.length ? (
            <div className="estimate-grid">
              {[...estimates, ...versionForecasts].map((f) => (
                <Estimate key={f.id} f={f} />
              ))}
            </div>
          ) : (
            <div className="forecast-empty">
              <Compass size={22} />
              <div>
                <h3>
                  {t(
                    "Still waiting for a reliable signal",
                    "근거가 모이면 예상이 시작됩니다",
                  )}
                </h3>
                <p>
                  {t(
                    "No supported estimate is recorded for this view. We keep unknown dates open rather than assign an arbitrary delay.",
                    "이 조건에 게시된 예상이 없습니다. 출시 순서와 비교 사례를 확인한 뒤 근거가 뒷받침하는 기간만 제시합니다.",
                  )}
                </p>
              </div>
            </div>
          )}
        </section>
      )}
      <section className="unscheduled-section">
        <div className="catalog-heading">
          <h2>
            {t("Without a verified date", "확인된 일정이 없는 외관")}{" "}
            <span className="result-count">{unscheduled.length}</span>
          </h2>
          <span>
            {server === "global"
              ? t("Global status not verified", "글로벌 정보 확인 중")
              : t("Exact CN date not stated", "중국의 정확한 날짜 미표기")}
          </span>
        </div>
        {unscheduled.length ? (
          <div className="unscheduled-list">
            {unscheduled.map((c) => (
              <Link key={c.id} href={`/${l}/cosmetics/${c.id}`}>
                <img
                  src={imagesOf(c)[0].thumbnail}
                  alt=""
                  width={58}
                  height={66}
                  loading="lazy"
                />
                <div>
                  <strong>{nameOf(c, l)}</strong>
                  <small>{c.nameOriginal}</small>
                </div>
                <span>{t("Unscheduled", "일정 미정")}</span>
                <ArrowUpRight size={16} />
              </Link>
            ))}
          </div>
        ) : (
          <p className="small-muted">
            {t(
              "No matching undated cosmetics. Try changing the watchlist filter.",
              "해당하는 미정 외관이 없습니다. 관심 외관 필터를 확인하세요.",
            )}
          </p>
        )}
      </section>
      {forecasts.length > 0 && (
        <section className="forecast-history">
          <h2>
            <History size={19} />
            {t("Forecast revision history", "예상 변경 이력")}
          </h2>
          {[...forecasts].reverse().map((f) => (
            <details key={`${f.id}-${f.revision}`}>
              <summary>
                {nameOf(findCosmetic(f.cosmeticId)!, l)} · v{f.revision} ·{" "}
                {f.createdAt.slice(0, 10)}
              </summary>
              <p>{f.reason[l]}</p>
              <p>{f.rationale[l]}</p>
              <small>
                {f.state === "active"
                  ? t("Active at this revision", "이 변경 시점에 유효")
                  : f.state === "withdrawn"
                    ? t("Withdrawn", "철회")
                    : t(
                        "Superseded by official information",
                        "공식 정보로 대체",
                      )}
              </small>
            </details>
          ))}
        </section>
      )}
    </>
  );
}
