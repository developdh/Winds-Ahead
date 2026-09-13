"use client";
import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react';
import { findCosmetic } from '@/lib/catalog';

const HISTORY_KEY = 'windsQuickView';
export type CosmeticClickHandler = (event: MouseEvent<HTMLAnchorElement>, id: string) => void;
export function useQuickView(enabled: boolean, path: string) {
  const [id, setId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLElement | null>(null);
  const content = useRef<HTMLDivElement | null>(null);
  const closeButton = useRef<HTMLButtonElement | null>(null);
  const sync = useCallback(() => {
    const next = new URLSearchParams(location.search).get('item');
    if (enabled && next && findCosmetic(next)) { setId(next); setOpen(true); }
    else setOpen(false);
  }, [enabled]);
  useEffect(() => { sync(); addEventListener('popstate', sync); return () => removeEventListener('popstate', sync); }, [sync, path]);
  useEffect(() => {
    content.current?.scrollTo({ top: 0, behavior: 'instant' });
  }, [id]);
  useEffect(() => {
    if (!open) window.dispatchEvent(new CustomEvent('winds-video-play', { detail: null }));
  }, [open]);
  const show: CosmeticClickHandler = (event, next) => {
    if (!enabled || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (!open) trigger.current = event.currentTarget;
    const url = new URL(location.href);
    url.searchParams.set('item', next);
    if (open) history.replaceState(history.state, '', url);
    else history.pushState({ ...history.state, [HISTORY_KEY]: true }, '', url);
    setId(next); setOpen(true);
    if (open) closeButton.current?.focus({ preventScroll: true });
  };
  const close = () => {
    setOpen(false);
    if (history.state?.[HISTORY_KEY]) history.back();
    else {
      const url = new URL(location.href); url.searchParams.delete('item');
      history.replaceState(history.state, '', url);
    }
  };
  return { id, open, show, close, trigger, content, closeButton };
}
