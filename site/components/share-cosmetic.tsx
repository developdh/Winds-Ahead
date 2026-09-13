"use client";
import { useEffect, useRef, useState } from 'react';
import { Check, Copy, Share2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { nameOf, type Cosmetic, type Locale } from '@/lib/catalog';

export default function ShareCosmetic({ c, l, compact = false }: { c: Cosmetic; l: Locale; compact?: boolean }) {
  const [url, setUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [manual, setManual] = useState(false);
  const [nativeShare, setNativeShare] = useState(false);
  const [sharing, setSharing] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const t = (en: string, ko: string) => l === 'ko' ? ko : en;
  useEffect(() => {
    const link = new URL(`/${l}`, location.origin);
    link.searchParams.set('item', c.id);
    setUrl(link.href);
    setNativeShare(typeof navigator.share === 'function');
  }, [c.id, l]);
  async function copy() {
    try { await navigator.clipboard.writeText(url); setCopied(true); setManual(false); }
    catch { setManual(true); input.current?.focus(); input.current?.select(); }
  }
  async function share() {
    setSharing(true);
    try { await navigator.share({ title: `${nameOf(c, l)} · Winds Ahead`, url }); }
    catch (error) { if (!(error instanceof Error && error.name === 'AbortError')) setManual(true); }
    finally { setSharing(false); }
  }
  return <Popover onOpenChange={() => { setCopied(false); setManual(false); }}>
    <PopoverTrigger asChild><button className={compact ? 'quick-view-share' : 'text-link cosmetic-share'} aria-label={t('Share cosmetic', '외관 공유')} title={t('Share cosmetic', '외관 공유')}>
      <Share2 size={compact ? 19 : 16} />{!compact && t('Share', '공유')}
    </button></PopoverTrigger>
    <PopoverContent className="share-link-panel" align="end" collisionPadding={12}>
      <label>{t('Share this cosmetic', '이 외관 공유하기')}<input ref={input} readOnly value={url} onFocus={event => event.currentTarget.select()} aria-label={t('Cosmetic link', '외관 링크')} /></label>
      <div className="share-actions">
        <button onClick={copy} disabled={!url}>{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? t('Link copied', '링크 복사됨') : t('Copy link', '링크 복사')}</button>
        {nativeShare && <button onClick={share} disabled={sharing || !url}><Share2 size={16} />{t('Share via…', '다른 앱으로 공유')}</button>}
      </div>
      <p role="status" className="share-result">{manual ? t('Select and copy the link above.', '위 링크를 선택해 복사해주세요.') : copied ? t('Ready to share.', '공유할 링크를 복사했습니다.') : ''}</p>
    </PopoverContent>
  </Popover>;
}
