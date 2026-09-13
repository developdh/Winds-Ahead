"use client";
import { useState } from "react";
import { Play, ArrowUpRight } from "lucide-react";
import type { Cosmetic, Locale } from "@/lib/catalog";
export interface CosmeticVideo {
  provider: "youtube" | "bilibili";
  id: string;
  watchUrl: string;
  title: { en: string; ko: string };
  sourceId: string;
}
export default function CosmeticVideos({ c, l }: { c: Cosmetic; l: Locale }) {
  const [active, setActive] = useState<string | null>(null);
  const videos = c.officialVideos as CosmeticVideo[];
  const t = (en: string, ko: string) => (l === "ko" ? ko : en);
  return (
    <section className="source-panel">
      <h2>
        <Play size={18} />
        {t("Cosmetic video", "외관 영상")}
      </h2>
      {!videos.length ? (
        <>
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
        </>
      ) : (
        videos.map((v) => (
          <div className="video-panel" key={v.id}>
            <h3>{v.title[l]}</h3>
            {v.provider === "youtube" &&
              (active === v.id ? (
                <iframe
                  title={v.title[l]}
                  src={`https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1`}
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <button
                  className="video-trigger"
                  onClick={() => setActive(v.id)}
                >
                  <Play size={30} />
                  {t("Play verified footage", "확인한 영상 재생")}
                </button>
              ))}
            <a
              className="text-link"
              href={v.watchUrl}
              target="_blank"
              rel="noreferrer"
            >
              {t("Watch at the source", "원본 영상 보기")}
              <ArrowUpRight size={15} />
            </a>
          </div>
        ))
      )}
    </section>
  );
}
