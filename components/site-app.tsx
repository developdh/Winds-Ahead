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
  Play,
  CalendarDays,
  History,
  SlidersHorizontal,
} from "lucide-react";
import { regionalRecord, releasedOn, matchesServer, serverName, stateName } from "@/lib/regional-status";
import { rememberLocale } from "@/lib/language-preference";
import CosmeticVideos from "@/components/cosmetic-videos";
import AcquisitionInfo from "@/components/acquisition-info";
import CosmeticGallery from "@/components/cosmetic-gallery";
import { acquisitionSummary, currencyName } from "@/lib/acquisition";
import updateData from "@/content/updates.json";
import { sources as allSources } from "@/lib/roadmap";
import { useScrollReveals } from "@/components/motion";
import { useArchiveTools } from "@/components/webmcp";
import { cleanWatchlist } from "@/lib/roadmap-domain.mjs";
import {
  globalEventFor,
  globalLabel,
  globalSources,
} from "@/lib/global-status";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ArchiveControls from "@/components/archive-controls";
import { sortArchive, validSort, validServer } from "@/lib/archive-domain.mjs";
import ReleaseOutlook, { outlookFor } from "@/components/release-outlook";
import { useQuickView } from "@/components/use-quick-view";
import ShareCosmetic from "@/components/share-cosmetic";
import { Dialog, DialogContent, DialogClose, DialogTitle } from "@/components/ui/dialog";
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
  sourceOf,
  verifiedAt,
  type Category,
  type Cosmetic,
  type Locale,
  type View,
} from "@/lib/catalog";
const Roadmap = lazy(() => import("@/components/roadmap"));
const WikiDetails = lazy(() => import("@/components/wiki-details"));
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
  const quickView = useQuickView(view === "catalog" || view === "watchlist", path);
  const previewItem = quickView.id ? findCosmetic(quickView.id) : undefined;
  const [today, setToday] = useState("");
  useEffect(() => {
    const update = () => setToday(new Date().toISOString().slice(0, 10));
    update();
    const timer = setInterval(update, 60_000);
    document.addEventListener("visibilitychange", update);
    return () => { clearInterval(timer); document.removeEventListener("visibilitychange", update); };
  }, []);
  const [saved, setSaved] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const [notice, setNotice] = useState("");
  useEffect(() => {
    document.documentElement.lang = l;
    rememberLocale(l);
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
  for (const k of ["q", "category", "server", "sort"]) {
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
    const globalAcquisition = regionalRecord(c, "Global")?.acquisition;
    const acquisition = globalAcquisition ?? c.acquisition;
    const acquisitionServer = globalAcquisition ? "Global" : c.acquisitionServer ?? "CN";
    return (
      <article
        className="cosmetic-card"
        key={c.id}
        style={{ animationDelay: `${Math.min(i, 5) * 55}ms` }}
      >
        <Link
          onClick={event => quickView.show(event, c.id)}
          aria-haspopup={view === "catalog" || view === "watchlist" ? "dialog" : undefined}
          className="card-image"
          href={`/${l}/cosmetics/${c.id}${backQuery}`}
          aria-label={`${nameOf(c, l)} · ${t("View details", "상세 보기")}`}
        >
          {m ? <img
            src={m.thumbnail}
            width={600}
            height={710}
            alt={`${c.nameOriginal} · ${t("Game appearance preview", "게임 외관 미리보기")}`}
            loading={i < 3 ? "eager" : "lazy"}
            fetchPriority={i === 0 ? "high" : "auto"}
            decoding="async"
          /> : <div className="media-pending"><span aria-hidden="true">鏡</span><small>{t("Image under review", "사진 확인 중")}</small></div>}
          {c.category === "effect" && c.officialVideos.length > 0 && <span className="effect-card-label"><Play size={13} />{t("Effect preview", "이펙트 미리보기")}</span>}
        </Link>
        <div className="card-copy">
          <div className="card-topline">
            <span>{categoryNames[c.category as Category][l]}</span>
            {saveButton(c, true)}
          </div>
          <Link
            href={`/${l}/cosmetics/${c.id}${backQuery}`}
            onClick={event => quickView.show(event, c.id)}
            aria-haspopup={view === "catalog" || view === "watchlist" ? "dialog" : undefined}
            className="card-title"
          >
            {nameOf(c, l)}
          </Link>
          <div className="card-subline">
            <span className="original-name" lang="zh-Hans" title={c.nameOriginal}>
              {c.nameOriginal}
            </span>
            {!c.wikiOnly && <span className="card-price" title={`${serverName(acquisitionServer, l)} · ${acquisitionSummary({...c, acquisition}, l)}`}>
              {c.wikiOnly ? t('Wiki reference', '위키 참고') : acquisition.pricing === 'fixed' ? <>
                <span className="card-price-amount">{acquisition.amount!.toLocaleString(l === 'ko' ? 'ko-KR' : 'en-US')}</span>
                <span>{currencyName(acquisition.currencyOriginal, l)}</span>
              </> : acquisition.pricing === 'free' ? t('Free', '무료') : acquisition.pricing === 'draw' ? t('Draw', '추첨') : acquisition.pricing === 'pass' ? t('Paid pass', '유료 강호령') : acquisition.kind === 'milestone' ? t('Milestone', '단계 보상') : t('Unpriced', '수량 미정')}
            </span>}
          </div>
          <div className="card-meta">
            <span className="card-location" title={`${serverName(acquisitionServer, l)} · ${acquisition.location[l]}`}>
              {c.wikiOnly ? t("Wiki reference", "위키 참고") : acquisition.location[l]}
            </span>
            <span className="card-release" title={t("Verified release servers; current shop availability may differ.", "출시 확인 서버이며 현재 판매 여부와 다를 수 있습니다.")}>
              {releasedOn(c, "CN") && releasedOn(c, "Global") ? t("CN + Global", "중국·글로벌 출시") : releasedOn(c, "Global") ? t("Global released", "글로벌 출시") : releasedOn(c, "CN") ? t("CN released", "중국 출시") : t("Unverified", "출시 확인 중")}
            </span>
          </div>
          <ReleaseOutlook c={c} l={l} today={today} />
        </div>
      </article>
    );
  };
  return (
    <>
      <header className="site-header">
        <Link
          className="brand"
          href={`/${l}`}
          aria-label={t("Winds Ahead home", "연운경 홈")}
        >
          <span className="brand-symbol" aria-hidden="true">
            鏡
          </span>
        </Link>
        <nav aria-label={t("Main navigation", "주 메뉴")}>
          {(
            [
              ["catalog", "", Compass],
              ["calendar", "calendar", CalendarDays],
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
              {v === "catalog"
                ? t("Cosmetics", "외관")
                : t("Calendar", "캘린더")}
            </Link>
          ))}
        </nav>
        <Link
          className="language"
          title={l === "ko" ? "English" : "한국어"}
          href={langUrl}
          hrefLang={l === "ko" ? "en" : "ko"}
          aria-label={t("Switch to Korean", "Switch to English")}
        >
          {l === "ko" ? "EN" : "KO"}
        </Link>
      </header>
      <main key={path} id="main" className="page" lang={l} tabIndex={-1}>
        {storageError && (
          <div role="alert" className="notice-bar">
            {t(
              "This browser cannot save your watchlist. Changes last only while this page stays open.",
              "이 브라우저에서는 관심 목록을 저장할 수 없습니다. 현재 페이지를 닫으면 변경 내용이 사라집니다.",
            )}
          </div>
        )}
        {(view === "catalog" || view === "watchlist") && (
          <Catalog l={l} view={view} saved={saved} ready={ready} card={card} today={today} />
        )}
        {view === "detail" && item && (
          <Detail
            key={item.id}
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
            <Roadmap l={l} />
          </Suspense>
        )}
        {view === "updates" && <Updates l={l} />}
        {view === "about" && <About l={l} />}
      </main>
      <Dialog open={quickView.open} onOpenChange={open => { if (!open) quickView.close(); }}>
        <DialogContent ref={quickView.content} className="cosmetic-dialog" showCloseButton={false} aria-describedby={undefined}
          onOpenAutoFocus={event => { event.preventDefault(); quickView.closeButton.current?.focus({ preventScroll: true }); }}
          onCloseAutoFocus={event => { event.preventDefault(); const target = quickView.trigger.current; (target?.isConnected ? target : document.getElementById("main"))?.focus({ preventScroll: true }); }}>
          {previewItem && <>
            <div className="quick-view-bar">
              <DialogTitle>{nameOf(previewItem, l)}</DialogTitle>
              <ShareCosmetic key={previewItem.id} c={previewItem} l={l} compact />
              <Link className="quick-view-permalink" href={`/${l}/cosmetics/${previewItem.id}${backQuery}`} aria-label={t("Open standalone page", "개별 페이지 열기")}><ArrowUpRight size={19} /></Link>
              <DialogClose ref={quickView.closeButton} className="quick-view-close" aria-label={t("Close details", "상세 정보 닫기")}><X size={22} /></DialogClose>
            </div>
            <Detail key={previewItem.id} c={previewItem} l={l} saveButton={saveButton} card={card} backQuery={backQuery} embedded />
          </>}
        </DialogContent>
      </Dialog>
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
  today,
}: {
  l: Locale;
  view: "catalog" | "watchlist";
  saved: string[];
  ready: boolean;
  today: string;
  card: (c: Cosmetic, i: number) => React.ReactNode;
}) {
  const t = (en: string, ko: string) => (l === "ko" ? ko : en);
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [sort, setSort] = useState(validSort(params.get("sort")));
  const [visibleCount, setVisibleCount] = useState(24);
  const [server, setServer] = useState(validServer(params.get("server")));
  const initial = params.get("category") ?? "all";
  const [category, setCategory] = useState(
    initial in categoryNames ? initial : "all",
  );
  useEffect(() => {
    setQuery(params.get("q") ?? "");
    setSort(validSort(params.get("sort")));
    const s = params.get("server") ?? "all";
    setServer(validServer(s));
    if (s === "both") {
      const url = new URL(location.href);
      url.searchParams.delete("server");
      history.replaceState(history.state, "", url);
    }
    const c = params.get("category") ?? "all";
    setCategory(c in categoryNames ? c : "all");
  }, [params]);
  useEffect(() => { setVisibleCount(24); }, [query, category, server, sort, view]);
  function update(q: string, c: string, region = server, order = sort) {
    setQuery(q);
    setCategory(c);
    setServer(region);
    setSort(order);
    const p = new URLSearchParams(window.location.search);
    q ? p.set("q", q) : p.delete("q");
    c !== "all" ? p.set("category", c) : p.delete("category");
    region !== "all" ? p.set("server", region) : p.delete("server");
    order !== "latest" ? p.set("sort", order) : p.delete("sort");
    history.replaceState(
      null,
      "",
      `${location.pathname}${p.size ? "?" + p : ""}`,
    );
  }
  const items = useMemo(() => {
    const matches = searchCosmetics(query, category)
      .filter(c => (view !== "watchlist" || saved.includes(c.id)) && matchesServer(c, server));
    const rows = matches.map(c => ({ id: c.id, name: nameOf(c, l),
      cnDate: releasedOn(c, "CN") ? regionalRecord(c, "CN")?.releaseDate ?? null : null,
      globalDate: releasedOn(c, "Global") ? regionalRecord(c, "Global")?.releaseDate ?? null : null,
      upcomingDate: today ? outlookFor(c, today)?.sortDate ?? null : null,
    }));
    const byId = new Map(matches.map(c => [c.id, c]));
    return sortArchive(rows, sort, l).map(row => byId.get(row.id)!);
  }, [query, category, server, sort, view, saved, today, l]);
  return (
    <>
      <div className="page-heading catalog-intro">
        <div>
          <h1>
            {view === "catalog"
              ? t("A world of detail.", "취향이 머무는 곳.")
              : t("Your collection.", "마음에 담은 외관.")}
          </h1>
          <p className="intro">
            {view === "catalog"
              ? t(
                  "Explore the cosmetics of Where Winds Meet.",
                  "다음에 만날 연운의 외관을 살펴보세요.",
                )
              : t(
                  "A few favorites. Saved in this browser.",
                  "이 브라우저에 저장한 나만의 외관 모음.",
                )}
          </p>
        </div>
      </div>
      <div className="archive-toolbar">
        <label className="search-row">
          <Search size={21} />
          <input
            aria-label={t("Search cosmetics", "외관 검색")}
            value={query}
            onChange={(e) => update(e.target.value, category)}
            placeholder={t("Search cosmetics", "이름이나 특징으로 검색")}
          />
          {query ? (
            <button
              aria-label={t("Clear search", "검색어 지우기")}
              onClick={() => update("", category)}
            >
              <X size={18} />
            </button>
          ) : null}
        </label>
        <div className="filters-row">
          <Tabs value={category} onValueChange={(v) => update(query, v)}>
            <TabsList
              className="category-tabs"
              aria-label={t("Cosmetic type", "외관 종류")}
            >
              {Object.entries(categoryNames).map(([k, n]) => (
                <TabsTrigger key={k} value={k}>
                  {n[l]}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        <Link
          className="collection-link"
          href={`/${l}${view === "catalog" ? "/watchlist" : ""}`}
          aria-label={
            view === "catalog"
              ? t("Saved cosmetics", "저장한 외관")
              : t("All cosmetics", "전체 외관")
          }
        >
          <Bookmark
            size={19}
            fill={view === "watchlist" ? "currentColor" : "none"}
          />
          {saved.length > 0 && <span>{saved.length}</span>}
        </Link>
      </div>
      <div className="archive-caption">
        <span role="status">
          {items.length} {t("appearance records", "개의 외관 기록")}
        </span>
        <ArchiveControls l={l} server={server} sort={sort} onServer={value => update(query, category, value)} onSort={value => update(query, category, server, value)} />
      </div>
      {view === "watchlist" && !ready ? (
        <div className="empty-state" role="status">
          {t("Loading your watchlist…", "관심 목록을 불러오고 있습니다…")}
        </div>
      ) : items.length ? (
        <>
          <div className="cosmetic-grid" key={`${category}:${server}:${sort}`}>
            {items.slice(0, visibleCount).map(card)}
          </div>
          {items.length > visibleCount && <div className="archive-more"><button className="text-link" onClick={() => setVisibleCount(n => n + 24)}>{t("Show more", "더 보기")} · {visibleCount} / {items.length}</button></div>}
        </>
      ) : (
        <div className="empty-state">
          <Bookmark size={30} />
          <h2>
            {query || category !== "all" || server !== "all"
              ? t("No matching cosmetics", "일치하는 외관이 없어요")
              : t(
                  "A place for your next favorites",
                  "다음에 만나고 싶은 외관을 모아보세요",
                )}
          </h2>
          <p>
            {query || category !== "all" || server !== "all"
              ? t(
                  "Try a different name or clear your filters.",
                  "다른 이름을 검색하거나 필터를 초기화하세요.",
                )
              : t(
                  "Tap the bookmark on any cosmetic to save it here.",
                  "외관 카드의 책갈피를 누르면 여기에 저장됩니다.",
                )}
          </p>
          {query || category !== "all" || server !== "all" ? (
            <button
              className="outline-button"
              onClick={() => update("", "all", "all")}
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
    </>
  );
}
function Detail({
  c,
  l,
  saveButton,
  card,
  backQuery,
  embedded = false,
}: {
  embedded?: boolean;
  backQuery: string;
  c: Cosmetic;
  l: Locale;
  saveButton: (c: Cosmetic, compact?: boolean) => React.ReactNode;
  card: (c: Cosmetic, i: number) => React.ReactNode;
}) {
  const t = (en: string, ko: string) => (l === "ko" ? ko : en);
  const source = sourceOf(c);
  const images = imagesOf(c);
  const related = cosmetics.filter(x => x.id !== c.id && x.sourceId === c.sourceId).slice(0, 3);
  const [selected, setSelected] = useState(0);
  const [mediaMode, setMediaMode] = useState(c.category === "effect" && c.officialVideos.length ? "video" : "photo");
  return (
    <>
      {!embedded && <Link className="back-link" href={`/${l}${backQuery}`}>
        <ArrowLeft size={16} />
        {t("Back to archive", "도감으로 돌아가기")}
      </Link>}
      <div className="detail-grid">
        <section className="detail-visual">
          {c.officialVideos.length > 0 && images.length > 0 && <Tabs value={mediaMode} onValueChange={setMediaMode} className="detail-media-tabs"><TabsList aria-label={t("Preview format", "미리보기 종류")}><TabsTrigger value="photo">{t("Photos", "사진")}</TabsTrigger><TabsTrigger value="video">{t("Video", "영상")}</TabsTrigger></TabsList></Tabs>}
          {mediaMode === "video" || (!images.length && c.officialVideos.length > 0) ? <CosmeticVideos key={c.id} c={c} l={l} hero /> : <CosmeticGallery key={c.id} c={c} l={l} selected={selected} onSelect={setSelected} immersive={embedded} />}
          {mediaMode === "photo" && images.length > 1 && (
            <div
              className="image-options"
              aria-label={t("Appearance variants", "외형 선택")}
            >
              {images.map((m, i) => (
                <button
                  key={m.index}
                  aria-pressed={selected === i}
                  onClick={() => setSelected(i)}
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
          {images.length > 0 && <p className="media-credit">
            {c.mediaKind === "gameplay" ? "© NetEase · GamerSky / 瑞破受气包" : "© NetEase"} ·{" "}
            {t(
              "Game appearance reference. Check source and server details below.",
              "게임 외관 참고 이미지. 출처와 서버는 아래에서 확인하세요.",
            )}
          </p>}
        </section>
        <section className="detail-copy">
          <div className="detail-title">
            <p className="eyebrow">
              {categoryNames[c.category as Category][l]}
            </p>
            <h1>{nameOf(c, l)}</h1>
            <p className="detail-original">
              <span lang="zh-Hans">{c.nameOriginal}</span>
              <span>{(l === "ko" ? c.officialNameKo : c.officialNameEn) ? t("Official name", "공식 명칭") : t("Provisional name", "편의 표기")}</span>
            </p>
            <p className="detail-description">{descriptions[c.id][l]}</p>
            {c.namingNote && <p className="small-muted">{c.namingNote[l]}</p>}
          </div>
          <div className="button-row detail-actions">
            {saveButton(c)}
            {!embedded && <ShareCosmetic c={c} l={l} />}
            <a
              className="text-link"
              href={source.url}
              target="_blank"
              rel="noreferrer"
            >
              {source.kind === "community" ? t("Wiki reference", "위키 출처") : source.evidenceTier === "C" || source.evidenceTier === "B" ? t("Image source", "이미지 출처") : t("Official announcement", "공식 공지")}
              <ArrowUpRight size={16} />
            </a>
          </div>
          <GlobalPanel c={c} l={l} />
          {!c.wikiOnly && <AcquisitionInfo c={c} l={l} />}
          {(["CN", "Global"] as const).filter(server => server !== (c.acquisitionServer ?? "CN")).map(server => { const record = regionalRecord(c, server); return record?.acquisition ? <AcquisitionInfo key={server} c={{...c, acquisition: record.acquisition, acquisitionServer: server}} l={l} /> : null; })}
          {source.server === "CN" && source.kind !== "community" && <div className="facts">
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
                    {c.cnRelease.contextual ? t("From update context", "업데이트 문맥 기준") : c.cnRelease.date ? t("Date only", "날짜 단위") : ""}
                  </span>
                </dd>
              </div>
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
          </div>}
        </section>
      </div>
      <div className="detail-bottom">
        {c.wikiDetails && <Suspense fallback={<div className="wiki-panel wiki-loading" aria-live="polite">{t("Loading wiki details…", "위키 정보를 불러오는 중…")}</div>}><WikiDetails key={c.id} id={c.id} l={l} /></Suspense>}
        <details className="source-panel evidence-disclosure">
          <summary>
            {t("Sources & verification", "출처와 확인 기록")}
            <span>+</span>
          </summary>
          <a href={source.url} target="_blank" rel="noreferrer">
            {source.titleOriginal}
            <ArrowUpRight size={16} />
          </a>
          <p>
            {t("Publisher:", "발행:")} {source.publisher} ·{" "}
            {source.kind === "community" ? t("Community reference", "커뮤니티 참고 자료") : formatDay(source.displayedPublicationDate, l)}
          </p>
          <p>
            {t("Source reviewed", "원문 확인")}{" "}
            {formatDay(verifiedAt, l)}
          </p>
          <small>
            {source.kind === "community" ? t("This source is a community wiki. It does not independently establish an official release date, global name, or current price.", "커뮤니티 위키 출처입니다. 이 자료만으로 공식 출시일, 글로벌 명칭, 현재 가격을 확정하지 않습니다.") : t(
              "We retain the publication date displayed on the page, which may differ from the URL directory date. Release dates use the announcement text; no time zone is assumed.",
              "주소의 날짜와 다를 수 있는 실제 공지 화면의 게시일을 기록했습니다. 출시일은 공지 본문을 기준으로 하며 시간대를 추정하지 않습니다.",
            )}
          </small>
          {c.sourceEvidence && <details><summary>{t("Source excerpt", "원문 발췌")}</summary><p lang="zh-Hans">{c.sourceEvidence}</p></details>}
          {c.imageSourceUrl && <a href={c.imageSourceUrl} target="_blank" rel="noreferrer">{t("Image provenance", "이미지 원출처")}<ArrowUpRight size={16} /></a>}
          {c.cnRelease.contextual && <p>{t("The release day is derived from the update context, not the URL date. An exact time is not assumed.", "출시일은 주소의 날짜가 아닌 업데이트 문맥으로 확인했습니다. 정확한 시각은 추정하지 않습니다.")}</p>}
        </details>

      </div>
      {related.length > 0 && <><div className="catalog-heading">
        <h2>{t("From the same collection", "같은 공지에서 만나는 외관")}</h2>
      </div>
      <div className="cosmetic-grid related-grid">
        {related.map(card)}
      </div></>}
    </>
  );
}
function GlobalPanel({ c, l }: { c: Cosmetic; l: Locale }) {
  const t = (en: string, ko: string) => l === "ko" ? ko : en;
  return <section className="regional-panel" aria-labelledby={`servers-${c.id}`}>
    <h2 id={`servers-${c.id}`}>{t("Release servers", "출시 서버")}</h2>
    <div className="regional-rows">{(["CN", "Global"] as const).map(server => {
      const r = regionalRecord(c, server);
      return <div className="regional-row" key={server}>
        <div className="regional-row-title"><span>{serverName(server, l)}</span><span className={`regional-state ${r?.status ?? "unknown"}`}>{stateName(r?.status ?? "unknown", l)}</span></div>
        {r ? <>
          {r.releaseDate && <time dateTime={r.releaseDate}>{formatDay(r.releaseDate, l)}</time>}
          <details className="regional-evidence"><summary>{t("Source & scope", "출처와 범위")}</summary><p>{r.scope[l]}</p><p>{r.identityBasis[l]}</p>{r.sourceIds.map(id => { const source = allSources.find(s => s.id === id); return source && <a key={id} href={source.url} target="_blank" rel="noreferrer">{source.titleOriginal}<ArrowUpRight size={13} /></a>; })}<small>{t("Checked", "확인")} {formatDay(r.verifiedAt, l)}</small></details>
        </> : <p>{t("No verified release record yet.", "출시 근거를 아직 확인하지 못했습니다.")}</p>}
      </div>;
    })}</div>
    <p className="small-muted">{t("A release record does not mean it is currently on sale.", "출시 기록이며 현재 판매 중이라는 뜻은 아닙니다.")}</p>
  </section>;
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
      {updateData.entries.map((entry) => (
        <div className="update-entry" key={entry.id}>
          <time dateTime={entry.date}>{formatDay(entry.date, l)}</time>
          <div>
            <span className="badge">{entry.kind[l]}</span>
            <h2>{entry.title[l]}</h2>
            <p>{entry.body[l]}</p>
            {entry.sourceIds.map((id) => {
              const source = allSources.find((s) => s.id === id)!;
              return (
                <a
                  key={id}
                  className="text-link"
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {t("View source", "출처 보기")}
                  <ArrowUpRight size={16} />
                </a>
              );
            })}
          </div>
        </div>
      ))}
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
              "Winds Ahead brings China and Global cosmetic records together with acquisition details, regional sources, and a release roadmap. It is not affiliated with or endorsed by NetEase or Everstone Studio.",
              "연운경은 중국·글로벌 서버의 외관 기록과 획득 정보, 서버별 출처, 출시 로드맵을 함께 정리합니다. NetEase 및 Everstone Studio와 제휴하거나 공식 인증을 받은 사이트가 아닙니다.",
            )}
          </p>
          <h2>
            {t("Reading the evidence", "정보를 구분하는 기준")}
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
          <h2>{t("Community composition notes", "커뮤니티 구성 정보")}</h2>
          <p>{t("Huiji Wiki supplies set composition, dyeing and tailoring flags, style points and collection rewards. Its contributors are credited under CC BY-NC-SA 3.0. These adapted notes remain separate from official server releases and prices. Style points are not a currency cost.", "灰机wiki에서 세트 구성, 염색·재단 여부, 풍화치와 수집 보상을 정리합니다. 기여자를 표시하고 CC BY-NC-SA 3.0으로 제공하며 공식 서버 출시·가격과 구분합니다. 풍화치는 지불 재화가 아닙니다.")}</p>
          <h2>{t("Names, dates, and media", "이름·날짜·미디어")}</h2>
          <p>
            {t(
              "Reviewed official English and Korean names take precedence. Chinese originals and provisional readings remain searchable. Unresolved regional identities stay separate; the record count is not a certified game total. Date-only records stay date-only. Unknown time zones are not converted.",
              "확인한 영어·한국어 공식명을 우선하며 중국 원명과 편의 표기도 검색할 수 있습니다. 동일 외관인지 미확인인 서버별 기록은 따로 유지하므로 기록 수가 게임 전체의 고유 외관 수를 뜻하지는 않습니다. 날짜만 알려진 기록에 시각을 붙이거나 미확인 시간대를 변환하지 않습니다.",
            )}
          </p>
          <p>
            {t(
              "This private MVP uses reduced official and credited community reference images for review. Rights remain with their owners; attribution does not establish redistribution permission. Public media clearance is still pending.",
              "비공개 MVP는 검토용으로 크기를 줄인 공식 이미지와 출처를 명시한 커뮤니티 참고 이미지를 사용합니다. 권리는 원저작자에게 있으며 출처 표기는 재배포 허가를 뜻하지 않습니다. 공개 서비스용 미디어 권한은 확인이 필요합니다.",
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
              {cosmetics.length} {t("cosmetics documented", "외관 기록")}
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
