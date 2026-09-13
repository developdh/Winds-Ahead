"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  DialogClose, DialogDescription, DialogTitle,
} from "@/components/ui/dialog";
import {
  Carousel, CarouselContent, CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { imagesOf, nameOf, type Cosmetic, type Locale } from "@/lib/catalog";

type GalleryImage = ReturnType<typeof imagesOf>[number];

function GalleryFrame({ image, dimensions, active, preload, onReady, label, l }: {
  image: GalleryImage;
  dimensions: Cosmetic["images"][number];
  active: boolean;
  preload: boolean;
  onReady: (source: string) => void;
  label: string;
  l: Locale;
}) {
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [requested, setRequested] = useState(active || preload);
  const t = (en: string, ko: string) => l === "ko" ? ko : en;
  useEffect(() => {
    if (active || preload) setRequested(true);
  }, [active, preload]);

  return (
    <div className="gallery-scroll" tabIndex={active ? 0 : -1} aria-label={label}>
      {status === "error" ? (
        <p className="gallery-message" role="alert">
          {t("The image could not load. Open the official original below.", "이미지를 불러오지 못했습니다. 아래의 공식 원본을 열어주세요.")}
        </p>
      ) : (
        <div className="gallery-image-frame" aria-busy={status === "loading"}>
          {active && status === "loading" && <p className="gallery-message" role="status">{t("Loading image…", "이미지 불러오는 중…")}</p>}
          {requested || active || preload ? <img
            className="gallery-full-image"
            data-ready={status === "ready"}
            src={image.full}
            width={dimensions.width}
            height={dimensions.height}
            alt={label}
            draggable={false}
            decoding="async"
            fetchPriority={active ? "high" : "low"}
            onLoad={() => { setStatus("ready"); onReady(image.full); }}
            onError={() => setStatus("error")}
          /> : <div aria-hidden="true" style={{ width: "100%", aspectRatio: `${dimensions.width} / ${dimensions.height}` }} />}
        </div>
      )}
    </div>
  );
}

export default function GalleryViewer({ c, l, images, selected, onSelect }: {
  c: Cosmetic;
  l: Locale;
  images: GalleryImage[];
  selected: number;
  onSelect: (index: number) => void;
}) {
  const t = (en: string, ko: string) => l === "ko" ? ko : en;
  const [api, setApi] = useState<CarouselApi>();
  // Capture the opening thumbnail once, rather than resetting the carousel on every selection.
  const [startIndex] = useState(selected);
  const activeIndex = useRef(selected);
  const [readyImages, setReadyImages] = useState<Set<string>>(() => new Set());
  const recordReady = useCallback((source: string) => {
    setReadyImages((previous) => previous.has(source) ? previous : new Set([...previous, source]));
  }, []);
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(preference.matches);
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);
  const options = useMemo(() => ({ startIndex, duration: reducedMotion ? 0 : 36, loop: false }), [startIndex, reducedMotion]);
  useEffect(() => {
    if (!api) return;
    const update = () => {
      activeIndex.current = api.selectedScrollSnap();
      onSelect(activeIndex.current);
    };
    const restore = () => {
      api.scrollTo(activeIndex.current, true);
      update();
    };
    api.on("select", update);
    api.on("reInit", restore);
    restore();
    return () => { api.off("select", update); api.off("reInit", restore); };
  }, [api, onSelect]);
  useEffect(() => {
    if (!api || images.length < 2) return;
    // Keep arrows working when a disabled boundary button returns focus to the dialog.
    const dialog = api.rootNode().closest('[role="dialog"]');
    const navigate = (event: Event) => {
      const key = event as KeyboardEvent;
      if (key.altKey || key.ctrlKey || key.metaKey) return;
      if (key.key === "ArrowLeft" || key.key === "ArrowRight") {
        key.preventDefault();
        if (key.key === "ArrowLeft") api.scrollPrev(reducedMotion);
        else api.scrollNext(reducedMotion);
      }
    };
    dialog?.addEventListener("keydown", navigate);
    return () => dialog?.removeEventListener("keydown", navigate);
  }, [api, images.length, reducedMotion]);

  return (
    <Carousel
      className="gallery-carousel"
      opts={options}
      setApi={setApi}
      aria-label={t("Official images", "공식 이미지")}
      aria-roledescription={t("carousel", "갤러리")}
      onKeyDownCapture={undefined}
    >
      <div className="gallery-header">
        <div>
          <DialogTitle>{nameOf(c, l)}</DialogTitle>
          <DialogDescription>{t("Official CN promotional image · NetEase", "중국 공식 홍보 이미지 · NetEase")}</DialogDescription>
        </div>
        <DialogClose className="icon-button gallery-close" aria-label={t("Close gallery", "갤러리 닫기")}>
          <X size={21} />
        </DialogClose>
      </div>
      <div className="gallery-stage">
        <CarouselContent className="gallery-track">
        {images.map((image, index) => (
          <CarouselItem
            key={image.full}
            className="gallery-slide"
            aria-hidden={index !== selected}
            aria-label={`${index + 1} / ${images.length}`}
            aria-roledescription={t("image", "이미지")}
          >
            <GalleryFrame
              key={image.full}
              image={image}
              dimensions={c.images[image.index]}
              active={index === selected}
              preload={readyImages.has(images[selected].full) && Math.abs(index - selected) === 1}
              onReady={recordReady}
              label={`${c.nameOriginal} · ${t("Full promotional image", "전체 홍보 이미지")} ${index + 1}`}
              l={l}
            />
          </CarouselItem>
        ))}
        </CarouselContent>
        {images.length > 1 && <>
          <Button
            variant="ghost"
            size="icon"
            className="gallery-arrow gallery-arrow-previous"
            aria-label={t("Previous image", "이전 이미지")}
            disabled={!api || selected === 0}
            onClick={() => api?.scrollPrev(reducedMotion)}
          ><ChevronLeft size={28} /></Button>
          <Button
            variant="ghost"
            size="icon"
            className="gallery-arrow gallery-arrow-next"
            aria-label={t("Next image", "다음 이미지")}
            disabled={!api || selected === images.length - 1}
            onClick={() => api?.scrollNext(reducedMotion)}
          ><ChevronRight size={28} /></Button>
        </>}
      </div>
      <div className="gallery-footer">
        <a className="text-link" href={images[selected].originalUrl} target="_blank" rel="noreferrer">
          {t("Official original", "공식 원본")}
          <ArrowUpRight size={16} />
        </a>
        {images.length > 1 && (
            <span className="gallery-counter" role="status" aria-live="polite" aria-atomic="true">
              <span className="sr-only">{t("Image", "이미지")} </span>{selected + 1}<span aria-hidden="true"> / </span><span className="sr-only">{t(" of ", " / ")}</span>{images.length}
            </span>
        )}
      </div>
    </Carousel>
  );
}
