"use client";
import { useEffect } from "react";
export function useScrollReveals(path: string) {
  useEffect(() => {
    if (
      matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    )
      return;
    const root = document.querySelector("main");
    if (!root) return;
    const watched = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-revealed", "true");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -20px 0px" },
    );
    const register = () => {
      root
        .querySelectorAll(
          ".source-panel,.facts,.roadmap-banner,.forecast-section,.unscheduled-section,.update-entry,.video-panel",
        )
        .forEach((el) => {
          if (watched.has(el)) return;
          watched.add(el);
          el.setAttribute("data-reveal-ready", "true");
          observer.observe(el);
        });
    };
    register();
    const changes = new MutationObserver(register);
    changes.observe(root, { childList: true, subtree: true });
    const focus = (event: Event) => {
      const target = event.target as Element;
      const panel = target.closest("[data-reveal-ready]");
      if (panel) panel.setAttribute("data-revealed", "true");
    };
    root.addEventListener("focusin", focus);
    return () => {
      observer.disconnect();
      changes.disconnect();
      root.removeEventListener("focusin", focus);
      for (const el of watched) {
        el.removeAttribute("data-reveal-ready");
        el.removeAttribute("data-revealed");
      }
    };
  }, [path]);
}
