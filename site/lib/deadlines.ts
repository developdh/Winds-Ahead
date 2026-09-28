import data from '@/content/deadlines.json';
import { formatDay, type Bilingual, type Locale, type Server } from '@/lib/catalog';
export interface Deadline {
  id: string;
  cosmeticId: string;
  server: Server;
  kind: 'sale' | 'exchange' | 'discount' | 'event' | 'draw' | 'pass';
  startDate: string;
  end: string;
  precision: 'day' | 'minute' | 'second';
  timezone: 'UTC' | 'UTC+8' | null;
  sourceIds: string[];
  verifiedAt: string;
  note: Bilingual;
}
export const deadlines = data.records as Deadline[];
export const deadlineKinds = {
  sale: { en: 'Sale ends', ko: '판매 종료' },
  exchange: { en: 'Exchange ends', ko: '교환 종료' },
  discount: { en: 'Discount ends', ko: '할인 종료' },
  event: { en: 'Event ends', ko: '이벤트 종료' },
  draw: { en: 'Draw ends', ko: '추첨 종료' },
  pass: { en: 'Pass ends', ko: '강호령 종료' },
};
export function deadlineDate(d: Deadline, l: Locale) {
  const time = d.precision === 'day' ? '' : ` ${d.end.slice(11)}`;
  return `${formatDay(d.end.slice(0, 10), l)}${time} · ${d.timezone ?? (l === 'ko' ? '시간대 미표기' : 'time zone unstated')}`;
}
