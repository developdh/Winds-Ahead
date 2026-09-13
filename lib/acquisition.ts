import terminology from '@/content/terminology.json';
import type { Cosmetic, Locale } from '@/lib/catalog';
export const currencyNames: Record<string, { en: string; ko: string }> = terminology.currencies;
export function currencyName(original: string | null, locale: Locale) {
  return original ? currencyNames[original]?.[locale] ?? original : null;
}
export function acquisitionSummary(c: Cosmetic, l: Locale) {
  const a = c.acquisition;
  if (a.pricing === 'draw') return l === 'ko' ? '추첨 보상 · 수량 미정' : 'Draw reward · variable';
  if (a.pricing === 'pass') return l === 'ko' ? '유료 강호령 · 가격 미정' : 'Paid pass · price unknown';
  return `${currencyName(a.currencyOriginal, l)} × ${a.amount!.toLocaleString(l === 'ko' ? 'ko-KR' : 'en-US')}`;
}
