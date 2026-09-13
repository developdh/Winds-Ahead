"use client";

import { lazy, Suspense, useMemo } from "react";
import { X, ZoomIn } from "lucide-react";
import {
  Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { imagesOf, nameOf, type Cosmetic, type Locale } from "@/lib/catalog";

const GalleryViewer = lazy(() => import("@/components/gallery-viewer"));

export default function CosmeticGallery({ c, l, selected, onSelect }: {
  c: Cosmetic;
  l: Locale;
  selected: number;
  onSelect: (index: number) => void;
}) {
  const t = (en: string, ko: string) => l === "ko" ? ko : en;
  const images = useMemo(() => imagesOf(c), [c]);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="detail-image" aria-label={t("Open full official image", "공식 이미지 크게 보기")}>
          <img src={images[selected].thumbnail} width={600} height={710} alt={`${c.nameOriginal} · ${t("Game appearance preview", "게임 외관 미리보기")}`} fetchPriority="high" />
          <span><ZoomIn size={17} />{t("View full image", "전체 이미지 보기")}</span>
        </button>
      </DialogTrigger>
      <DialogContent className="gallery-dialog" showCloseButton={false}>
        <Suspense fallback={
          <div className="gallery-carousel">
            <div className="gallery-header">
              <div>
                <DialogTitle>{nameOf(c, l)}</DialogTitle>
                <DialogDescription>{t("Game appearance reference · NetEase", "게임 외관 참고 이미지 · NetEase")}</DialogDescription>
              </div>
              <DialogClose className="icon-button gallery-close" aria-label={t("Close gallery", "갤러리 닫기")}><X size={21} /></DialogClose>
            </div>
            <p className="gallery-starting" role="status">{t("Loading image…", "이미지 불러오는 중…")}</p>
          </div>
        }>
          <GalleryViewer c={c} l={l} images={images} selected={selected} onSelect={onSelect} />
        </Suspense>
      </DialogContent>
    </Dialog>
  );
}
