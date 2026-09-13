"use client";
import { useEffect, useRef, useState } from "react";
import { Play, ArrowUpRight } from "lucide-react";
import type { Cosmetic, Locale } from "@/lib/catalog";
export interface CosmeticVideo {
  provider: "youtube" | "bilibili" | "netease";
  id: string;
  watchUrl: string;
  title: { en: string; ko: string };
  sourceId: string;
  playback?: { src: string; poster: string; bytes: number; width: number; height: number; durationSeconds: number };
}
function NativePlayer({ video, onError }: { video: CosmeticVideo; onError: () => void }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const player = ref.current;
    return () => {
      // Release the decoder and abort any pending media transfer when dismissed.
      if (!player) return;
      player.pause();
      player.removeAttribute("src");
      player.load();
    };
  }, []);
  const p = video.playback!;
  return <video ref={ref} className="effect-player" src={p.src} poster={p.poster}
    width={p.width} height={p.height} controls playsInline autoPlay preload="none"
    aria-label={video.title.en} onError={onError} />;
}
export default function CosmeticVideos({ c, l, hero = false }: { c: Cosmetic; l: Locale; hero?: boolean }) {
  const [active, setActive] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const panel = useRef<HTMLElement>(null);
  const videos = c.officialVideos as CosmeticVideo[];
  const t = (en: string, ko: string) => l === "ko" ? ko : en;
  useEffect(() => { setActive(null); setFailed(false); }, [c.id]);
  useEffect(() => {
    if (!active) return;
    const stop = () => setActive(null);
    const visibility = () => { if (document.hidden) stop(); };
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) stop();
    });
    if (panel.current) observer.observe(panel.current);
    document.addEventListener("visibilitychange", visibility);
    // At most one cosmetic player, including embedded providers.
    const another = (e: Event) => {
      if ((e as CustomEvent<string>).detail !== active) stop();
    };
    window.addEventListener("winds-video-play", another);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", visibility);
      window.removeEventListener("winds-video-play", another);
    };
  }, [active]);
  function start(id: string) {
    window.dispatchEvent(new CustomEvent("winds-video-play", { detail: id }));
    setFailed(false); setActive(id);
  }
  return <section ref={panel} className={hero ? "effect-hero" : "source-panel cosmetic-videos"}>
    {!hero && <h2><Play size={18} />{t("Cosmetic video", "외관 영상")}</h2>}
    {videos.map(v => <div className="video-panel" key={v.id}>
      {!hero && <h3>{v.title[l]}</h3>}
      {v.provider !== "bilibili" && (active === v.id ? (
        v.provider === "netease" ? <NativePlayer video={{...v, title: {en: v.title[l], ko: v.title[l]}}} onError={() => {setFailed(true); setActive(null);}} /> :
        <iframe title={v.title[l]} src={`https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1`}
          allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
      ) : <button className={`video-trigger ${v.playback ? "effect-trigger" : ""}`} onClick={() => start(v.id)}>
        {v.playback && <img src={v.playback.poster} width={v.playback.width} height={v.playback.height}
          alt="" loading={hero ? "eager" : "lazy"} decoding="async" />}
        <span className="effect-play-icon"><Play size={26} fill="currentColor" /></span>
        <span className="effect-play-label">{t("Play effect", "이펙트 재생")}</span>
      </button>)}
      <div className="video-meta">
        {v.playback && <span>{Math.round(v.playback.durationSeconds)}{t(" sec", "초")} · {(v.playback.bytes / 1_000_000).toFixed(1)} MB</span>}
        <a className="text-link" href={v.watchUrl} target="_blank" rel="noreferrer">
          {t("Original", "원본 영상")}<ArrowUpRight size={14} />
        </a>
      </div>
    </div>)}
    {failed && <p role="alert" className="small-muted">{t("Video could not load. Try again or open the original.", "영상을 불러오지 못했습니다. 다시 재생하거나 원본 영상을 열어주세요.")}</p>}
  </section>;
}
