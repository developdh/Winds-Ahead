"use client";
import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  Check,
  ChevronLeft,
  ChevronRight,
  Compass,
  Globe2,
  Info,
  Search,
  ShieldCheck,
  Sparkles,
  X,
  ZoomIn,
  Play,
  CalendarDays,
  History,
  SlidersHorizontal,
} from "lucide-react";
import { useScrollReveals } from "@/components/motion";
import { useArchiveTools } from "@/components/webmcp";
import { cleanWatchlist } from "@/lib/roadmap-domain.mjs";
import {
  globalEventFor,
  globalLabel,
  globalSources,
} from "@/lib/global-status";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NativeSelect } from "@/components/ui/native-select";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  cosmetics,
  categoryNames,
  descriptions,
  findCosmetic,
  formatDay,
  imagesOf,
  nameOf,
  pageNames,
  searchCosmetics,
  source,
  verifiedAt,
  type Category,
  type Cosmetic,
  type Locale,
  type View,
} from "@/lib/catalog";
const Roadmap = lazy(() => import("@/components/roadmap"));
const STORE = "winds-ahead:watchlist:v1";
const knownIds = new Set(cosmetics.map((c) => c.id));
function validSaved(raw: string | null): string[] {
  try {
    const a = JSON.parse(raw ?? "[]");
    return cleanWatchlist(a, [...knownIds]);
  } catch {
    return [];
  }
}
export default function SiteApp({
  locale: l,
  view,
  itemId,
}: {
  locale: Locale;
  view: View;
  itemId?: string;
}) {
  const t = (en: string, ko: string) => (l === "ko" ? ko : en);
  const path = usePathname();
  const params = useSearchParams();
  useScrollReveals(path);
  const [saved, setSaved] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const [notice, setNotice] = useState("");
  useEffect(() => {
    document.documentElement.lang = l;
    try {
      setSaved(validSaved(localStorage.getItem(STORE)));
    } catch {
      setStorageError(true);
    }
    setReady(true);
    const sync = (e: StorageEvent) => {
      if (e.key === STORE) setSaved(validSaved(e.newValue));
    };
    addEventListener("storage", sync);
    return () => removeEventListener("storage", sync);
  }, [l]);
  const save = useCallback(
    (id: string, wanted: boolean) => {
      if (!knownIds.has(id)) return false;
      let current = saved;
      try {
        current = validSaved(localStorage.getItem(STORE));
      } catch {
        setStorageError(true);
      }
      const next = wanted
        ? [...new Set([...current, id])]
        : current.filter((x) => x !== id);
      setSaved(next);
      try {
        localStorage.setItem(STORE, JSON.stringify(next));
        setStorageError(false);
      } catch {
        setStorageError(true);
      }
      setNotice(
        l === "ko"
          ? wanted
            ? "관심 외관에 저장했습니다."
            : "관심 외관에서 해제했습니다."
          : wanted
            ? "Added to your watchlist."
            : "Removed from your watchlist.",
      );
      return true;
    },
    [saved, l],
  );
  useArchiveTools(l, saved, save);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 3000);
    return () => clearTimeout(timer);
  }, [notice]);
  const langUrl = `${path.replace(/^\/(en|ko)(?=\/|$)/, l === "ko" ? "/en" : "/ko")}${params.toString() ? "?" + params.toString() : ""}`;
  const item = itemId ? findCosmetic(itemId) : undefined;
  const backParams = new URLSearchParams();
  for (const k of ["q", "category", "sort"]) {
    const v = params.get(k);
    if (v) backParams.set(k, v);
  }
  const backQuery = backParams.size ? "?" + backParams.toString() : "";
  const saveButton = (c: Cosmetic, compact = false) => (
    <button
      className={
        compact
          ? "save-icon"
          : saved.includes(c.id)
            ? "primary-button"
            : "outline-button"
      }
      aria-label={`${nameOf(c, l)} · ${saved.includes(c.id) ? t("Remove from watchlist", "관심 해제") : t("Save to watchlist", "관심 저장")}`}
      aria-pressed={saved.includes(c.id)}
      disabled={!ready}
      onClick={() => save(c.id, !saved.includes(c.id))}
    >
      <Bookmark
        size={compact ? 18 : 17}
        fill={saved.includes(c.id) ? "currentColor" : "none"}
      />
      {!compact &&
        (saved.includes(c.id)
          ? t("Saved", "저장됨")
          : t("Save cosmetic", "관심 저장"))}
    </button>
  );
  const card = (c: Cosmetic, i: number) => {
    const m = imagesOf(c)[0];
    return (
      <article
        className="cosmetic-card"
        key={c.id}
        style={{ animationDelay: `${Math.min(i, 5) * 55}ms` }}
      >
        <Link
          className="card-image"
          href={`/${l}/cosmetics/${c.id}${backQuery}`}
          aria-label={`${nameOf(c, l)} · ${t("View details", "상세 보기")}`}
        >
          <img
            src={m.thumbnail}
            width={600}
            height={710}
            alt={`${c.nameOriginal} · ${t("Official CN promotional preview", "중국 공식 미리보기")}`}
            loading={i < 3 ? "eager" : "lazy"}
            fetchPriority={i === 0 ? "high" : "auto"}
            decoding="async"
          />
          <span className="image-chip">
            CN · {t("Official source", "공식 자료")}
          </span>
          <span className="image-arrow">
            <ArrowUpRight size={21} />
          </span>
        </Link>
        <div className="card-copy">
          <div className="card-topline">
            <span>{categoryNames[c.category as Category][l]}</span>
            {saveButton(c, true)}
          </div>
          <Link
            href={`/${l}/cosmetics/${c.id}${backQuery}`}
            className="card-title"
          >
            {nameOf(c, l)}
          </Link>
          <div className="original-name" lang="zh-Hans">
            {c.nameOriginal}
          </div>
          <div className="card-status">
            <span className="status-dot" />
            {globalLabel(c.id, l)}
          </div>
        </div>
      </article>
    );
  };
  return (
    <>
      <a href="#main" className="skip-link">
        {t("Skip to content", "본문 바로가기")}
      </a>
      <header className="site-header">
        <Link
          className="brand"
          href={`/${l}`}
          aria-label={t("Winds Ahead home", "연운경 홈")}
        >
          <span className="brand-mark" aria-hidden="true">
            燕
          </span>
          <span>
            WINDS AHEAD<small>연운경 · 燕雲鏡</small>
          </span>
        </Link>
        <nav aria-label={t("Main navigation", "주 메뉴")}>
          {(
            [
              ["catalog", "", Compass],
              ["calendar", "calendar", CalendarDays],
              ["watchlist", "watchlist", Bookmark],
            ] as const
          ).map(([v, slug, Icon]) => (
            <Link
              key={v}
              className={
                view === v || (v === "catalog" && view === "detail")
                  ? "active"
                  : ""
              }
              aria-current={view === v ? "page" : undefined}
              href={`/${l}${slug ? "/" + slug : ""}`}
            >
              <Icon size={17} />
              {v === "catalog"
                ? t("Archive", "외관 도감")
                : v === "calendar"
                  ? t("Roadmap", "로드맵")
                  : t("Watchlist", "관심 외관")}
              {v === "watchlist" && saved.length > 0 && (
                <span className="nav-count">{saved.length}</span>
              )}
            </Link>
          ))}
        </nav>
        <Link
          className="language"
          href={langUrl}
          hrefLang={l === "ko" ? "en" : "ko"}
          aria-label={t("Switch to Korean", "Switch to English")}
        >
          <Globe2 size={16} />
          {l === "ko" ? "EN" : "한국어"}
        </Link>
      </header>
      <main key={path} id="main" className="page" lang={l}>
        {storageError && (
          <div role="alert" className="notice-bar">
            {t(
              "This browser cannot save your watchlist. Changes last only while this page stays open.",
              "이 브라우저에서는 관심 목록을 저장할 수 없습니다. 현재 페이지를 닫으면 변경 내용이 사라집니다.",
            )}
          </div>
        )}
        {(view === "catalog" || view === "watchlist") && (
          <Catalog l={l} view={view} saved={saved} ready={ready} card={card} />
        )}
        {view === "detail" && item && (
          <Detail
            c={item}
            l={l}
            saveButton={saveButton}
            card={card}
            backQuery={backQuery}
          />
        )}
        {view === "calendar" && (
          <Suspense
            fallback={
              <div className="empty-state" role="status">
                {t("Loading roadmap…", "로드맵을 불러오고 있습니다…")}
              </div>
            }
          >
            <Roadmap l={l} saved={saved} />
          </Suspense>
        )}
        {view === "updates" && <Updates l={l} />}
        {view === "about" && <About l={l} />}
      </main>
      <footer>
        <div>
          <Link className="footer-brand" href={`/${l}`}>
            Winds Ahead <span>· 연운경</span>
          </Link>
          <p>
            {t(
              "An independent Where Winds Meet fan archive.",
              "연운 외관 정보를 모으는 비공식 팬 아카이브.",
            )}
          </p>
        </div>
        <div className="footer-links">
          <Link href={`/${l}/updates`}>{t("Updates", "업데이트")}</Link>
          <Link href={`/${l}/about`}>
            {t("About & sources", "소개와 출처")}
          </Link>
          <a
            href="https://www.wherewindsmeetgame.com/"
            target="_blank"
            rel="noreferrer"
          >
            {t("Official website", "게임 공식 사이트")}
            <ArrowUpRight size={14} />
          </a>
        </div>
      </footer>
      <div
        className={`toast ${notice ? "visible" : ""}`}
        role="status"
        aria-live="polite"
      >
        {notice && <Check size={16} />} {notice}
      </div>
    </>
  );
}
function Catalog({
  l,
  view,
  saved,
  ready,
  card,
}: {
  l: Locale;
  view: "catalog" | "watchlist";
  saved: string[];
  ready: boolean;
  card: (c: Cosmetic, i: number) => React.ReactNode;
}) {
  const t = (en: string, ko: string) => (l === "ko" ? ko : en);
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const initial = params.get("category") ?? "all";
  const [category, setCategory] = useState(
    initial in categoryNames ? initial : "all",
  );
  const [sort, setSort] = useState(
    params.get("sort") === "name" ? "name" : "release",
  );
  useEffect(() => {
    setQuery(params.get("q") ?? "");
    const c = params.get("category") ?? "all";
    setCategory(c in categoryNames ? c : "all");
    setSort(params.get("sort") === "name" ? "name" : "release");
  }, [params]);
  function update(q: string, c: string, s: string) {
    setQuery(q);
    setCategory(c);
    setSort(s);
    const p = new URLSearchParams(window.location.search);
    q ? p.set("q", q) : p.delete("q");
    c !== "all" ? p.set("category", c) : p.delete("category");
    s !== "release" ? p.set("sort", s) : p.delete("sort");
    history.replaceState(
      null,
      "",
      `${location.pathname}${p.size ? "?" + p : ""}`,
    );
  }
  const items = useMemo(
    () =>
      searchCosmetics(query, category)
        .filter((c) => view !== "watchlist" || saved.includes(c.id))
        .sort((a, b) =>
          sort === "name"
            ? nameOf(a, l).localeCompare(nameOf(b, l), l)
            : (b.cnRelease.date ?? "").localeCompare(a.cnRelease.date ?? ""),
        ),
    [query, category, view, saved, sort, l],
  );
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">
            WHERE WINDS MEET ·{" "}
            {view === "catalog" ? "COSMETIC ARCHIVE" : "YOUR COLLECTION"}
          </p>
          <h1>
            {pageNames[view][l]}
            <span className="heading-seal" aria-hidden="true">
              鏡
            </span>
          </h1>
          <p className="intro">
            {view === "catalog"
              ? t(
                  "Discover the details. See what may lie ahead.",
                  "외관의 디테일을 살펴보고, 다음 여정을 준비하세요.",
                )
              : t(
                  "The cosmetics you want to keep an eye on. Saved in this browser.",
                  "마음에 드는 외관을 모아보세요. 이 브라우저에 저장됩니다.",
                )}
          </p>
        </div>
        <Link
          href={`/${l}/${view === "catalog" ? "calendar" : ""}`}
          className="text-link"
        >
          {view === "catalog"
            ? t("Explore the roadmap", "출시 로드맵")
            : t("Explore the archive", "도감 둘러보기")}
          <ArrowUpRight size={18} />
        </Link>
      </div>
      {view === "catalog" && (
        <details className="catalog-disclosure">
          <summary>
            <ShieldCheck size={17} />
            <span>
              {t(
                "CN sources. Global dates checked separately.",
                "중국 공식 자료 · 글로벌 일정은 별도 확인",
              )}
            </span>
            <Info size={16} />
          </summary>
          <p>
            {t(
              "An appearance in CN does not confirm a global release. We preserve the original source and show unknown global dates as unscheduled.",
              "중국 공개가 글로벌 출시 확정을 뜻하지 않습니다. 원문 출처를 보존하고 확인하지 못한 글로벌 날짜는 미정으로 표시합니다.",
            )}{" "}
            <Link href={`/${l}/about`}>
              {t("Our verification approach", "정보 확인 기준")} ↗
            </Link>
          </p>
        </details>
      )}

      <label className="search-row">
        <Search size={21} />
        <input
          aria-label={t("Search cosmetics", "외관 검색")}
          value={query}
          onChange={(e) => update(e.target.value, category, sort)}
          placeholder={t(
            "Search a name, original Chinese name, or detail…",
            "이름, 중국어 원명, 외관 특징으로 검색…",
          )}
        />
        {query ? (
          <button
            aria-label={t("Clear search", "검색어 지우기")}
            onClick={() => update("", category, sort)}
          >
            <X size={18} />
          </button>
        ) : (
          <span>{t("EN · KO · CN NAMES", "한글 · 영문 · 중국 원명")}</span>
        )}
      </label>
      <div className="filters-row">
        <Tabs value={category} onValueChange={(v) => update(query, v, sort)}>
          <TabsList
            className="category-tabs"
            aria-label={t("Cosmetic type", "외관 종류")}
          >
            {Object.entries(categoryNames).map(([k, n]) => (
              <TabsTrigger key={k} value={k}>
                {n[l]}
                <span>
                  {k === "all"
                    ? cosmetics.length
                    : cosmetics.filter((c) => c.category === k).length}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      <div className="catalog-heading">
        <h2>
          {view === "watchlist"
            ? t("Saved cosmetics", "저장한 외관")
            : t("Explore the collection", "외관 둘러보기")}{" "}
          <span className="result-count" role="status">
            {items.length}
          </span>
        </h2>
        <label className="sort-field">
          <span className="sr-only">{t("Sort order", "정렬")}</span>
          <NativeSelect
            value={sort}
            onChange={(e) => update(query, category, e.target.value)}
          >
            <option value="release">
              {t("CN release · Newest", "중국 출시일순")}
            </option>
            <option value="name">{t("Name · A–Z", "이름순")}</option>
          </NativeSelect>
        </label>
      </div>
      {view === "watchlist" && !ready ? (
        <div className="empty-state" role="status">
          {t("Loading your watchlist…", "관심 목록을 불러오고 있습니다…")}
        </div>
      ) : items.length ? (
        <div className="cosmetic-grid">{items.map(card)}</div>
      ) : (
        <div className="empty-state">
          <Bookmark size={30} />
          <h2>
            {query || category !== "all"
              ? t("No matching cosmetics", "일치하는 외관이 없어요")
              : t(
                  "A place for your next favorites",
                  "다음에 만나고 싶은 외관을 모아보세요",
                )}
          </h2>
          <p>
            {query || category !== "all"
              ? t(
                  "Try a different name or clear your filters.",
                  "다른 이름을 검색하거나 필터를 초기화하세요.",
                )
              : t(
                  "Tap the bookmark on any cosmetic to save it here.",
                  "외관 카드의 책갈피를 누르면 여기에 저장됩니다.",
                )}
          </p>
          {query || category !== "all" ? (
            <button
              className="outline-button"
              onClick={() => update("", "all", "release")}
            >
              {t("Reset filters", "필터 초기화")}
            </button>
          ) : (
            <Link className="primary-button" href={`/${l}`}>
              {t("Explore cosmetics", "외관 둘러보기")}
              <ArrowRight size={16} />
            </Link>
          )}
        </div>
      )}
      {view === "catalog" && (
        <div className="roadmap-banner">
          <div className="banner-icon">
            <CalendarDays size={27} />
          </div>
          <div>
            <h2>
              {t("What comes after the wind?", "다음 바람은 어디로 향할까요?")}
            </h2>
            <p>
              {t(
                "Follow CN release history and evidence-based global forecasts.",
                "중국 출시 기록과 근거를 바탕으로 한 글로벌 예상을 함께 살펴보세요.",
              )}
            </p>
          </div>
          <Link className="outline-button" href={`/${l}/calendar`}>
            {t("Open roadmap", "로드맵 보기")}
            <ArrowUpRight size={16} />
          </Link>
        </div>
      )}
    </>
  );
}
function Detail({
  c,
  l,
  saveButton,
  card,
  backQuery,
}: {
  backQuery: string;
  c: Cosmetic;
  l: Locale;
  saveButton: (c: Cosmetic, compact?: boolean) => React.ReactNode;
  card: (c: Cosmetic, i: number) => React.ReactNode;
}) {
  const t = (en: string, ko: string) => (l === "ko" ? ko : en);
  const images = imagesOf(c);
  const [selected, setSelected] = useState(0);
  const [gallery, setGallery] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    setSelected(0);
    setFailed(false);
  }, [c.id]);
  const acq = c.acquisition as Cosmetic["acquisition"] & {
    amount?: number;
    currencyOriginal?: string;
    eventOriginal?: string;
  };
  return (
    <>
      <Link className="back-link" href={`/${l}${backQuery}`}>
        <ArrowLeft size={16} />
        {t("Back to archive", "도감으로 돌아가기")}
      </Link>
      <div className="detail-grid">
        <section className="detail-visual">
          <Dialog open={gallery} onOpenChange={setGallery}>
            <DialogTrigger asChild>
              <button
                className="detail-image"
                aria-label={t(
                  "Open full official image",
                  "공식 이미지 크게 보기",
                )}
              >
                <img
                  src={images[selected].thumbnail}
                  width={600}
                  height={710}
                  alt={`${c.nameOriginal} · ${t("Official CN preview", "중국 공식 미리보기")}`}
                  fetchPriority="high"
                />
                <span>
                  <ZoomIn size={17} />
                  {t("View full image", "전체 이미지 보기")}
                </span>
              </button>
            </DialogTrigger>
            <DialogContent className="gallery-dialog" showCloseButton={false}>
              <div className="gallery-header">
                <div>
                  <DialogTitle>{nameOf(c, l)}</DialogTitle>
                  <DialogDescription>
                    {t(
                      "Official CN promotional image · NetEase",
                      "중국 공식 홍보 이미지 · NetEase",
                    )}
                  </DialogDescription>
                </div>
                <DialogClose
                  className="icon-button"
                  aria-label={t("Close gallery", "갤러리 닫기")}
                >
                  <X size={21} />
                </DialogClose>
              </div>
              <div className="gallery-scroll">
                {failed ? (
                  <p role="alert">
                    {t(
                      "The image could not load. Open the official original below.",
                      "이미지를 불러오지 못했습니다. 아래의 공식 원본을 열어주세요.",
                    )}
                  </p>
                ) : (
                  <img
                    src={images[selected].full}
                    width={c.images[selected].width}
                    height={c.images[selected].height}
                    alt={`${c.nameOriginal} · ${t("Full promotional sheet", "전체 홍보 이미지")}`}
                    onError={() => setFailed(true)}
                  />
                )}
              </div>
              <a
                className="text-link"
                href={images[selected].originalUrl}
                target="_blank"
                rel="noreferrer"
              >
                {t("Open official original", "공식 원본 열기")}
                <ArrowUpRight size={16} />
              </a>
            </DialogContent>
          </Dialog>
          {images.length > 1 && (
            <div
              className="image-options"
              aria-label={t("Appearance variants", "외형 선택")}
            >
              {images.map((m, i) => (
                <button
                  key={m.index}
                  aria-pressed={selected === i}
                  onClick={() => {
                    setSelected(i);
                    setFailed(false);
                  }}
                >
                  <img
                    src={m.thumbnail}
                    width={60}
                    height={70}
                    alt={t(`Variant ${i + 1}`, `외형 ${i + 1}`)}
                  />
                </button>
              ))}
            </div>
          )}
          <p className="media-credit">
            © NetEase ·{" "}
            {t(
              "Official CN preview. Final in-game appearance may differ.",
              "중국 공식 미리보기. 실제 게임 내 모습과 다를 수 있습니다.",
            )}
          </p>
        </section>
        <section className="detail-copy">
          <div className="detail-title">
            <p className="eyebrow">
              CN ARCHIVE / {categoryNames[c.category as Category][l]}
            </p>
            <h1>{nameOf(c, l)}</h1>
            <p className="detail-original">
              <span lang="zh-Hans">{c.nameOriginal}</span>
              <span>{t("Provisional name", "편의 표기")}</span>
            </p>
            <p className="detail-description">{descriptions[c.id][l]}</p>
          </div>
          <div className="button-row detail-actions">
            {saveButton(c)}
            <a
              className="text-link"
              href={source.url}
              target="_blank"
              rel="noreferrer"
            >
              {t("Official announcement", "공식 공지")}
              <ArrowUpRight size={16} />
            </a>
          </div>
          <GlobalPanel c={c} l={l} />
          <div className="facts">
            <h2>
              <ShieldCheck size={18} />
              {t("China server facts", "중국 서버 정보")}
            </h2>
            <dl>
              <div>
                <dt>{t("Release date", "출시일")}</dt>
                <dd>
                  {formatDay(c.cnRelease.date, l)}{" "}
                  <span className="small-muted">
                    {c.cnRelease.date ? t("Date only", "날짜 단위") : ""}
                  </span>
                </dd>
              </div>
              <div>
                <dt>{t("How to obtain", "획득 방법")}</dt>
                <dd>{acq[l]}</dd>
              </div>
              {acq.amount !== undefined && (
                <div>
                  <dt>{t("CN currency cost", "중국 재화 가격")}</dt>
                  <dd>
                    {acq.amount.toLocaleString()} {acq.currencyOriginal}
                    <small>
                      {t(
                        "Historical CN price; not a global price.",
                        "당시 중국 기준이며 글로벌 가격이 아닙니다.",
                      )}
                    </small>
                  </dd>
                </div>
              )}
              {acq.eventOriginal && (
                <div>
                  <dt>{t("CN event name", "중국 이벤트명")}</dt>
                  <dd lang="zh-Hans">{acq.eventOriginal}</dd>
                </div>
              )}
              <div>
                <dt>{t("Source published", "공지 게시일")}</dt>
                <dd>{formatDay(source.displayedPublicationDate, l)}</dd>
              </div>
            </dl>
            <p className="small-muted">
              {t(
                "Historical announcement. Current shop availability is not implied. Time zone was not stated in the source.",
                "과거 공지 기록이며 현재 판매 중이라는 뜻은 아닙니다. 원문에 시간대가 명시되지 않았습니다.",
              )}
            </p>
          </div>
        </section>
      </div>
      <div className="detail-bottom">
        <section className="source-panel">
          <h2>
            <History size={18} />
            {t("Sources & verification", "출처와 확인 기록")}
          </h2>
          <a href={source.url} target="_blank" rel="noreferrer">
            {source.titleOriginal}
            <ArrowUpRight size={16} />
          </a>
          <p>
            {t("Publisher:", "발행:")} {source.publisher} ·{" "}
            {formatDay(source.displayedPublicationDate, l)}
          </p>
          <p>
            {t("CN source reviewed", "중국 원문 확인")}{" "}
            {formatDay(verifiedAt, l)} ·{" "}
            {t("Global status unverified", "글로벌 정보 미확인")}
          </p>
          <small>
            {t(
              "The page displays September 25; its URL contains September 26. We retain the displayed publication date.",
              "공지 화면은 9월 25일, 주소는 9월 26일로 다릅니다. 화면에 표시된 게시일을 기록했습니다.",
            )}
          </small>
        </section>
        <section className="source-panel">
          <h2>
            <Play size={18} />
            {t("Cosmetic video", "외관 영상")}
          </h2>
          <p>
            {t(
              "No verified video for this cosmetic is available in the archive yet.",
              "이 외관의 검증된 영상이 아직 등록되지 않았습니다.",
            )}
          </p>
          <p className="small-muted">
            {t(
              "Images and videos are matched to the exact cosmetic before being added.",
              "이미지와 영상이 해당 외관을 보여주는지 확인한 뒤 추가합니다.",
            )}
          </p>
        </section>
      </div>
      <div className="catalog-heading">
        <h2>{t("From the same collection", "같은 공지에서 만나는 외관")}</h2>
      </div>
      <div className="cosmetic-grid related-grid">
        {cosmetics
          .filter((x) => x.id !== c.id && x.category === c.category)
          .slice(0, 3)
          .map(card)}
      </div>
    </>
  );
}
function GlobalPanel({ c, l }: { c: Cosmetic; l: Locale }) {
  const t = (en: string, ko: string) => (l === "ko" ? ko : en);
  const e = globalEventFor(c.id);
  return (
    <div className="status-panel">
      <div className="status-heading">
        <Globe2 size={18} />
        <h2>{t("Global release", "글로벌 출시")}</h2>
        <span className="badge unknown">
          {e
            ? e.status === "released"
              ? t("Released", "출시 기록")
              : t("Announced", "발표됨")
            : t("Not verified", "확인 중")}
        </span>
      </div>
      {e ? (
        <>
          <p>
            {formatDay(e.date, l)} · {e.scope[l]}
          </p>
          {e.sourceIds.map((id) => {
            const s = globalSources.find((x) => x.id === id);
            return s ? (
              <a
                className="text-link"
                key={id}
                href={s.url}
                target="_blank"
                rel="noreferrer"
              >
                {s.titleOriginal}
                <ArrowUpRight size={15} />
              </a>
            ) : null;
          })}
        </>
      ) : (
        <p>
          {t(
            "No verified global release or official localized name has been recorded in this archive yet.",
            "이 도감에는 검증한 글로벌 출시 정보와 공식 한국어명이 아직 등록되지 않았습니다.",
          )}
        </p>
      )}
      <Link className="text-link" href={`/${l}/calendar`}>
        {t("Check the roadmap", "로드맵 확인")}
        <ArrowRight size={15} />
      </Link>
    </div>
  );
}
function Updates({ l }: { l: Locale }) {
  const t = (en: string, ko: string) => (l === "ko" ? ko : en);
  return (
    <>
      <PageHeading
        l={l}
        view="updates"
        intro={t(
          "A clear record of what changed, and why.",
          "무엇이 바뀌었는지, 어떤 근거가 있는지 기록합니다.",
        )}
      />
      <div className="update-entry">
        <time dateTime={verifiedAt}>{formatDay(verifiedAt, l)}</time>
        <div>
          <span className="badge">{t("Archive added", "도감 등록")}</span>
          <h2>
            {t(
              "Eight cosmetics. One official source.",
              "공식 자료로 시작하는 여덟 가지 외관",
            )}
          </h2>
          <p>
            {t(
              "Added the September 2025 CN collection, acquisition methods, and official image references. Global names and releases remain unverified.",
              "2025년 9월 중국 외관 8종의 획득 정보와 공식 이미지를 등록했습니다. 글로벌 공식명과 출시 정보는 미확인 상태입니다.",
            )}
          </p>
          <a
            className="text-link"
            href={source.url}
            target="_blank"
            rel="noreferrer"
          >
            {t("View source", "출처 보기")}
            <ArrowUpRight size={16} />
          </a>
        </div>
      </div>
      <div className="editor-note">
        <History size={20} />
        <p>
          {t(
            "Forecast history starts with evidence.",
            "예상 이력은 근거가 있을 때 시작합니다.",
          )}
          <span>
            {t(
              "No global forecast has been published yet. Changes will retain their previous estimates and rationale.",
              "아직 게시한 글로벌 예상이 없습니다. 변경 시 이전 예상과 변경 이유를 함께 보존합니다.",
            )}
          </span>
        </p>
      </div>
    </>
  );
}
function PageHeading({
  l,
  view,
  intro,
}: {
  l: Locale;
  view: Exclude<View, "detail">;
  intro: string;
}) {
  return (
    <div className="page-heading">
      <div>
        <p className="eyebrow">WINDS AHEAD · {view.toUpperCase()}</p>
        <h1>{pageNames[view][l]}</h1>
        <p className="intro">{intro}</p>
      </div>
    </div>
  );
}
function About({ l }: { l: Locale }) {
  const [play, setPlay] = useState(false);
  const t = (en: string, ko: string) => (l === "ko" ? ko : en);
  return (
    <>
      <PageHeading
        l={l}
        view="about"
        intro={t(
          "An independent guide to the details beyond the horizon.",
          "다음 여정의 외관을 기록하는 독립 팬 아카이브.",
        )}
      />
      <div className="about-grid">
        <section className="prose">
          <h2>
            {t(
              "Look closely. Follow the sources.",
              "외관은 자세하게, 근거는 분명하게.",
            )}
          </h2>
          <p>
            {t(
              "Winds Ahead brings official China-server cosmetic previews together with acquisition details, global verification status, and a release roadmap. It is not affiliated with or endorsed by NetEase or Everstone Studio.",
              "연운경은 중국 서버의 공식 외관 미리보기와 획득 정보, 글로벌 확인 상태, 출시 로드맵을 함께 정리합니다. NetEase 및 Everstone Studio와 제휴하거나 공식 인증을 받은 사이트가 아닙니다.",
            )}
          </p>
          <h2>
            {t("Three kinds of information", "정보를 구분하는 세 가지 기준")}
          </h2>
          <ul>
            <li>
              <strong>{t("CN facts", "중국 사실")}</strong> —{" "}
              {t(
                "Supported by an identified China-server source.",
                "출처가 명확한 중국 서버 공개 정보입니다.",
              )}
            </li>
            <li>
              <strong>{t("Global facts", "글로벌 사실")}</strong> —{" "}
              {t(
                "Require separate official global evidence.",
                "별도의 글로벌 공식 근거를 확인해야 합니다.",
              )}
            </li>
            <li>
              <strong>{t("Editorial forecast", "운영자 예상")}</strong> —{" "}
              {t(
                "An estimate with a rationale, confidence level and review date. Never a promise.",
                "근거·신뢰 수준·재검토일을 기록한 추정이며 출시 약속이 아닙니다.",
              )}
            </li>
          </ul>
          <h2>{t("Names, dates, and media", "이름·날짜·미디어")}</h2>
          <p>
            {t(
              "Chinese names identify the original cosmetics. Korean readings and English romanizations are provisional. Date-only records stay date-only. Unknown time zones are not converted.",
              "중국 원명으로 외관을 식별합니다. 한국어 독음과 영어 로마자 표기는 편의 표기입니다. 날짜만 알려진 기록에 시각을 붙이거나 미확인 시간대를 변환하지 않습니다.",
            )}
          </p>
          <p>
            {t(
              "This private MVP uses reduced official reference images for review. Rights remain with their owners; attribution does not establish redistribution permission. Public media clearance is still pending.",
              "비공개 MVP는 검토용으로 크기를 줄인 공식 참고 이미지를 사용합니다. 권리는 원저작자에게 있으며 출처 표기는 재배포 허가를 뜻하지 않습니다. 공개 서비스용 미디어 권한은 확인이 필요합니다.",
            )}
          </p>
          <h2>{t("Your watchlist", "관심 목록")}</h2>
          <p>
            {t(
              "Bookmarks stay in this browser. There is no account or cross-device sync. Clearing browser data also clears this list. Videos contact YouTube only after you choose to play.",
              "관심 목록은 이 브라우저에 저장되며 계정이나 기기 간 동기화는 없습니다. 브라우저 데이터를 지우면 목록도 삭제됩니다. 동영상은 재생을 선택한 뒤 YouTube에 연결합니다.",
            )}
          </p>
          <a
            className="text-link"
            href="https://github.com/developdh/Winds-Ahead/issues/new"
            target="_blank"
            rel="noreferrer"
          >
            {t(
              "Report a correction · Repository access required",
              "오류 제보 · 저장소 접근 필요",
            )}
            <ArrowUpRight size={16} />
          </a>
        </section>
        <aside>
          <div className="source-panel">
            <ShieldCheck size={26} />
            <h2>{t("Start with the original", "원문에서 출발합니다")}</h2>
            <a href={source.url} target="_blank" rel="noreferrer">
              {source.titleOriginal}
              <ArrowUpRight size={16} />
            </a>
            <p>
              {source.publisher}
              <br />
              {formatDay(source.displayedPublicationDate, l)}
            </p>
            <span className="badge">
              8 {t("cosmetics documented", "외관 기록")}
            </span>
          </div>
          <section className="video-panel">
            <h2>{t("A glimpse of the world", "연운의 세계를 만나다")}</h2>
            {play ? (
              <iframe
                src="https://www.youtube-nocookie.com/embed/PB0i3293jRQ?autoplay=1"
                title="Where Winds Meet — Release Date Trailer"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <button className="video-trigger" onClick={() => setPlay(true)}>
                <Play size={35} />
                <span>{t("Play official trailer", "공식 트레일러 재생")}</span>
              </button>
            )}
            <p>
              {t(
                "Release Date Trailer · Official Where Winds Meet channel, Aug 20, 2025. General game footage, not evidence for the cosmetics in this archive.",
                "공식 연운 채널의 Release Date Trailer · 2025. 8. 20. 게임 소개 영상이며 이 도감 외관의 글로벌 출시 근거가 아닙니다.",
              )}
            </p>
            <a
              className="text-link"
              href="https://www.youtube.com/watch?v=PB0i3293jRQ"
              target="_blank"
              rel="noreferrer"
            >
              {t("Watch on YouTube", "YouTube에서 보기")}
              <ArrowUpRight size={16} />
            </a>
          </section>
        </aside>
      </div>
    </>
  );
}
