"use client";

import { lazy, Suspense, useMemo } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import {
  Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { imagesOf, nameOf, type Cosmetic, type Locale } from "@/lib/catalog";

const GalleryViewer = lazy(() => import("@/components/gallery-viewer"));

export default function CosmeticGallery({ c, l, selected, onSelect, immersive = false }: {
  c: Cosmetic;
  l: Locale;
  selected: number;
  onSelect: (index: number) => void;
  immersive?: boolean;
}) {
  const t = (en: string, ko: string) => l === "ko" ? ko : en;
  const images = useMemo(() => imagesOf(c), [c]);
  const picture = images[selected];
  if (!images.length) return <div className="detail-image media-pending"><span aria-hidden="true">鏡</span><p>{t("Image under review", "사진 확인 중")}</p><small>{c.wikiOnly ? t("A wiki reference is available; an individual image has not been verified.", "위키 참고 정보가 있으며 개별 사진은 아직 확인 중입니다.") : t("The official source names this appearance; an individual image has not been verified.", "공식 원문에 외관이 기록되어 있으나 개별 사진은 아직 확인 중입니다.")}</small></div>;
  return (
    <Dialog>
      <div className={immersive ? "quick-view-media" : undefined}>
      <DialogTrigger asChild>
        <button className="detail-image" aria-label={t("Open full official image", "공식 이미지 크게 보기")}>
          <img key={picture.display ?? picture.full} src={picture.display ?? picture.full} width={picture.displayWidth ?? c.images[picture.index].width} height={picture.displayHeight ?? c.images[picture.index].height} alt={c.images[picture.index].alt?.[l] ?? `${c.nameOriginal} · ${t("Game appearance preview", "게임 외관 미리보기")}`} decoding="async" fetchPriority="high" />
          <span><ZoomIn size={17} />{t("View full image", "전체 이미지 보기")}</span>
        </button>
      </DialogTrigger>
      {immersive && images.length > 1 && <>
        <button className="quick-view-arrow previous" aria-label={t("Previous photo", "이전 사진")} aria-disabled={selected === 0} onClick={() => { if (selected > 0) onSelect(selected - 1); }}><ChevronLeft size={42} strokeWidth={1.25} /></button>
        <button className="quick-view-arrow next" aria-label={t("Next photo", "다음 사진")} aria-disabled={selected === images.length - 1} onClick={() => { if (selected < images.length - 1) onSelect(selected + 1); }}><ChevronRight size={42} strokeWidth={1.25} /></button>
        <span className="quick-view-image-count" role="status">{selected + 1} / {images.length}</span>
      </>}
      </div>
      {c.images[images[selected].index].caption && <p className="small-muted">{c.images[images[selected].index].caption?.[l]}</p>}
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
