"use client";
import { useEffect, useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { rememberLocale, storedLocale } from "@/lib/language-preference";
import type { Locale } from "@/lib/catalog";
import LoadingScene from "@/components/loading-scene";
export default function Landing({
  returnPath = "",
  autoContinue = true,
}: {
  returnPath?: string;
  autoContinue?: boolean;
}) {
  const [entering, setEntering] = useState<Locale | null>(null);
  const [checking, setChecking] = useState(autoContinue);
  const [focused, setFocused] = useState<Locale | null>(null);
  useEffect(() => {
    if (!autoContinue) return;
    const saved = storedLocale();
    if (saved) {
      rememberLocale(saved);
      const url = new URL(location.href);
      url.searchParams.delete("welcome");
      location.replace(
        `/${saved}${returnPath}${url.searchParams.size ? "?" + url.searchParams : ""}`,
      );
    } else setChecking(false);
  }, [autoContinue, returnPath]);
  function enter(l: Locale) {
    if (entering) return;
    const persisted = rememberLocale(l);
    setEntering(l);
    const url = new URL(location.href);
    url.searchParams.delete("welcome");
    if (!persisted) url.searchParams.set("entry", l);
    const destination = `/${l}${returnPath}${url.searchParams.size ? "?" + url.searchParams : ""}`;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    setTimeout(() => location.assign(destination), reduced ? 0 : 850);
  }
  if (checking) return <LoadingScene />;
  return (
    <main
      data-language={focused ?? undefined}
      className={`landing ${entering ? "is-entering" : ""}`}
      lang="en"
    >
      <div className="landing-portrait" aria-hidden="true">
        <img
          src="/media/zui-penglai-0-thumb.webp"
          alt=""
          width={600}
          height={710}
          fetchPriority="high"
        />
      </div>
      <div className="landing-horizon" aria-hidden="true" />
      <div className="landing-content">
        <p className="landing-wordmark" lang="ko">
          연운경 · 燕雲鏡
        </p>
        <h1>
          <span>Winds</span>
          <span>
            Ahead<span className="landing-period">.</span>
          </span>
        </h1>
        <div className="language-choice">
          <p>
            <span lang="ko">다음 바람이 머무는 곳.</span>
            <br />
            Where the next wind lingers.
          </p>
          <div className="language-options">
            <button
              onPointerEnter={() => setFocused("ko")}
              onPointerLeave={() => setFocused(null)}
              onFocus={() => setFocused("ko")}
              onBlur={() => setFocused(null)}
              onClick={() => enter("ko")}
              disabled={!!entering}
              aria-label="한국어로 시작"
              className={entering === "ko" ? "chosen" : ""}
            >
              <span lang="ko">한국어</span>
              {entering === "ko" ? (
                <Check size={17} />
              ) : (
                <ArrowRight size={17} />
              )}
            </button>
            <button
              onPointerEnter={() => setFocused("en")}
              onPointerLeave={() => setFocused(null)}
              onFocus={() => setFocused("en")}
              onBlur={() => setFocused(null)}
              onClick={() => enter("en")}
              disabled={!!entering}
              aria-label="Continue in English"
              className={entering === "en" ? "chosen" : ""}
            >
              <span>English</span>
              {entering === "en" ? (
                <Check size={17} />
              ) : (
                <ArrowRight size={17} />
              )}
            </button>
          </div>
          <small className="language-memory">
            Saved for next time <span lang="ko">· 다음에도 기억할게요</span>
          </small>
        </div>
      </div>
      <footer className="landing-footer">
        <span>Where Winds Meet · Fan archive</span>
        <span>Imagery © NetEase</span>
      </footer>
      {entering && (
        <div className="entry-transition">
          <LoadingScene />
        </div>
      )}
    </main>
  );
}
