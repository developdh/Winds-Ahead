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
import ReleaseTimeline, { ScheduleEvidence, forecastWindow } from "@/components/release-timeline";
import type { CosmeticClickHandler } from "@/components/use-quick-view";
import { regionalRecords } from "@/lib/regional-status";
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
  scheduleReviewedAt,
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
export default function Roadmap({ l, onCosmeticClick }: { l: Locale; onCosmeticClick: CosmeticClickHandler }) {
  const t = (en: string, ko: string) => (l === "ko" ? ko : en);
  const params = useSearchParams();
  const today = new Date().toISOString().slice(0, 10);
  const currentMonth = today.slice(0, 7);
  const latestCnMonth = cnEvents.map(e => e.date.slice(0, 7)).sort().at(-1) ?? currentMonth;
  const [month, setMonth] = useState(
    isMonth(params.get("month")) ? params.get("month")! : currentMonth,
  );
  const viewFromUrl = () => params.get("view") === "calendar" || (!params.get("view") && params.has("month")) ? "calendar" : "timeline";
  const [view, setView] = useState(viewFromUrl);
  const [kind, setKind] = useState(params.get("kind") === "official" ? "official" : params.get("server") !== "cn" && params.get("kind") === "forecast" ? "forecast" : "all");
  const [server, setServer] = useState(
    params.get("server") === "cn" ? "cn" : "global",
  );
  useEffect(() => {
    setMonth(
      isMonth(params.get("month")) ? params.get("month")! : currentMonth,
    );
    setView(params.get("view") === "calendar" || (!params.get("view") && params.has("month")) ? "calendar" : "timeline");
    setKind(params.get("kind") === "official" ? "official" : params.get("server") !== "cn" && params.get("kind") === "forecast" ? "forecast" : "all");
    setServer(params.get("server") === "cn" ? "cn" : "global");
  }, [params, currentMonth]);
  function update(values: Record<string, string>) {
    const p = new URLSearchParams(location.search);
    Object.entries(values).forEach(([k, v]) => (v ? p.set(k, v) : p.delete(k)));
    history.replaceState(null, "", `${location.pathname}?${p}`);
    if ("view" in values) setView(values.view);
    if ("kind" in values) setKind(values.kind || "all");
    if ("month" in values) setMonth(values.month);
    if ("server" in values) setServer(values.server);
  }
  const events = (server === "cn" ? cnEvents : globalEvents).filter((e) =>
    e.date.startsWith(month) && kind !== "forecast",
  ).sort((a, b) => a.date.localeCompare(b.date));
  const latest = latestRevisions(forecasts) as Forecast[];
  const releasedIds = regionalRecords.filter(r => r.server === (server === "cn" ? "CN" : "Global") && r.status === "released").map(r => r.cosmeticId);
  const active = latest.filter(f => f.state === "active" && !forecastDue(f, today) && !forecastEnded(f, today) && !globalEvents.some(e => e.cosmeticId === f.cosmeticId && e.kind === "release" && e.status !== "cancelled") && !regionalRecords.some(r => r.cosmeticId === f.cosmeticId && r.server === "Global" && r.status === "released"));
  const estimates = active.filter(
    (f) => server === "global" && kind !== "official" && forecastInMonth(f, month),
  );
  const unscheduled = cosmetics.filter((c) =>
    server === "global"
      ? !releasedIds.includes(c.id) && !globalEvents.some(
          (e) => e.cosmeticId === c.id && e.status !== "cancelled",
        ) &&
        !active.some((f) => f.cosmeticId === c.id && !forecastEnded(f, today))
      : !c.cnRelease.date,
  );
  const versionForecasts = active.filter(
    (f) => server === "global" && kind !== "official" && f.precision === "version",
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
          <Link href={`/${l}/cosmetics/${c.id}`} onClick={event => onCosmeticClick(event, c.id)} prefetch={false} aria-haspopup="dialog">{nameOf(c, l)}</Link>
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
          <h1>{t("What’s next.", "다음에 만날 외관.")}</h1>
          <p className="intro">
            {t(
              "Release dates. Estimates. All in one place.",
              "중국 출시 기록부터 글로벌 예상 일정까지.",
            )}
          </p>
        </div>
        <Link className="text-link" href={`/${l}/about`}>
          {t("How forecasts work", "예상 기준 보기")}
          <ArrowUpRight size={17} />
        </Link>
      </div>
      <div className="roadmap-controls roadmap-view-controls">
        <Tabs value={view} onValueChange={v => update({ view: v })}>
          <TabsList className="server-tabs view-tabs" aria-label={t("Schedule view", "일정 보기")}>
            <TabsTrigger value="timeline">{t("Roadmap", "로드맵")}</TabsTrigger>
            <TabsTrigger value="calendar">{t("Calendar", "캘린더")}</TabsTrigger>
          </TabsList>
        </Tabs>
        <Tabs value={server} onValueChange={(v) => update({ server: v, kind: "all" })}>
          <TabsList className="server-tabs" aria-label={t("Server", "서버")}>
            <TabsTrigger value="global">{t("Global", "글로벌")}</TabsTrigger>
            <TabsTrigger value="cn">{t("China", "중국")}</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className="schedule-filter-line">
        <Tabs value={kind} onValueChange={v => update({ kind: v })}>
          <TabsList className="schedule-kind-tabs" aria-label={t("Schedule type", "일정 종류")}>
            <TabsTrigger value="all">{t("All", "전체")}</TabsTrigger>
            <TabsTrigger value="official">{t("Official", "확정 일정")}</TabsTrigger>
            {server === "global" && <TabsTrigger value="forecast">{t("Estimated", "예상 일정")}</TabsTrigger>}
          </TabsList>
        </Tabs>
        <span className="schedule-reviewed">{t("Source review", "출처 확인")} · {scheduleReviewedAt}</span>
      </div>
      <div className="calendar-note">
        <Info size={17} />
        <p>
          {server === "global"
            ? t(
                "Verified global dates and evidence-based estimates. Unknown dates stay open.",
                "확인된 공식 날짜와 근거가 있는 예상만 표시합니다. 모르는 일정은 미정으로 남깁니다.",
              )
            : t(
                "Historical CN release dates. A date here does not mean an item is currently on sale.",
                "중국의 과거 출시 기록입니다. 여기에 날짜가 있어도 현재 판매 중이라는 뜻은 아닙니다.",
              )}
        </p>
      </div>
      {view === "timeline" ? <ReleaseTimeline l={l} events={server === "cn" ? cnEvents : globalEvents} forecasts={server === "global" ? forecasts : []} today={today} kind={kind} releasedIds={releasedIds} onCosmeticClick={onCosmeticClick}/> : <>
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
          </div>
        </div>
        {kind !== "forecast" && <div
          className={`calendar-grid ${!events.length ? "empty-calendar" : ""}`}
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
                            onClick={event => onCosmeticClick(event, c.id)} prefetch={false}
                            aria-haspopup="dialog"
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
        }<div className="calendar-agenda">
          {events.map((e) => {
            const c = findCosmetic(e.cosmeticId)!;
            return (
              <Link
                key={e.id}
                className="agenda-event"
                href={`/${l}/cosmetics/${c.id}`}
                onClick={event => onCosmeticClick(event, c.id)} prefetch={false}
                aria-haspopup="dialog"
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
        {!events.length && kind !== "forecast" && (
          <div className="calendar-empty">
            <CalendarDays size={24} />
            <p>
              {t(
                "No official dates in this view.",
                "이 조건에 해당하는 공식 일정이 없습니다.",
              )}
            </p>
            {server === "cn" && month !== latestCnMonth && (
              <button
                className="text-link"
                onClick={() =>
                  update({ month: latestCnMonth, kind: "all", saved: "" })
                }
              >
                {t(
                  "See latest recorded CN releases",
                  "최근 중국 출시 기록 보기",
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
                    month: latestCnMonth,
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
        {events.length > 0 && (
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
        )}
      </section>
      {server === "global" &&
        (estimates.length > 0 || versionForecasts.length > 0) && (
          <section className="forecast-section">
            <div className="catalog-heading">
              <h2>
                <Sparkles size={20} />
                {t("Estimated windows", "예상 기간")}
              </h2>
              <span>
                {t("Editorial · Not official", "운영자 예상 · 비공식")}
              </span>
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
      {kind === "forecast" && !estimates.length && !versionForecasts.length && <p className="timeline-empty">{t("No current estimates for this month.", "이 달에는 유효한 예상 일정이 없습니다.")}</p>}
      </>}
      <section className="unscheduled-section">
        <div className="catalog-heading">
          <h2>
            {t("Dates to come", "일정을 기다리는 외관")}{" "}
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
            {unscheduled.slice(0, 6).map((c) => (
              <Link key={c.id} href={`/${l}/cosmetics/${c.id}`} onClick={event => onCosmeticClick(event, c.id)} prefetch={false} aria-haspopup="dialog">
                {imagesOf(c)[0] ? <img
                  src={imagesOf(c)[0].thumbnail}
                  alt=""
                  width={58}
                  height={66}
                  loading="lazy"
                /> : <span className="unscheduled-no-image" aria-hidden="true">鏡</span>}
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
              "Every recorded cosmetic has a date or an estimate.",
              "등록된 모든 외관에 날짜 또는 예상 기간이 있습니다.",
            )}
          </p>
        )}
        {unscheduled.length > 6 && <Link className="text-link schedule-archive-link" href={`/${l}`}>
          {t("Browse all appearances in the archive", "도감에서 모든 외관 보기")}<ArrowUpRight size={16}/>
        </Link>}
      </section>
      {server === "global" && forecasts.length > 0 && (
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
              <p>{forecastWindow(f, l)} · {t("Review by", "재검토일")} {formatDay(f.reviewDue, l)}</p>
              <p>{f.reason[l]}</p>
              <p>{f.rationale[l]}</p>
              <p>{f.assumptions[l]}</p>
              <ScheduleEvidence ids={f.sourceIds} l={l}/>
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
