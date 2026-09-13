"use client";
import { ArrowDownUp, ChevronDown, SlidersHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import type { Locale } from '@/lib/catalog';

export const sortNames: Record<string, { en: string; ko: string }> = {
  latest: { en: 'Latest releases', ko: '전체 최신 출시순' },
  'cn-newest': { en: 'China · newest first', ko: '중국 최신 출시순' },
  'cn-oldest': { en: 'China · oldest first', ko: '중국 오래된 출시순' },
  'global-newest': { en: 'Global · newest first', ko: '글로벌 최신 출시순' },
  'global-oldest': { en: 'Global · oldest first', ko: '글로벌 오래된 출시순' },
  upcoming: { en: 'Upcoming Global', ko: '글로벌 일정 가까운순' },
  'name-asc': { en: 'Name · A–Z', ko: '이름 오름차순' },
  'name-desc': { en: 'Name · Z–A', ko: '이름 내림차순' },
};
const serverNames: Record<string, { en: string; ko: string }> = {
  all: { en: 'All servers', ko: '모든 서버' }, cn: { en: 'Released in China', ko: '중국 출시' },
  global: { en: 'Released globally', ko: '글로벌 출시' },
};
export default function ArchiveControls({ l, server, sort, onServer, onSort }: {
  l: Locale; server: string; sort: string; onServer: (value: string) => void; onSort: (value: string) => void;
}) {
  return <div className="archive-controls">{[
    { label: l === 'ko' ? '출시 서버' : 'Release server', value: server, names: serverNames, change: onServer, Icon: SlidersHorizontal },
    { label: l === 'ko' ? '정렬' : 'Sort by', value: sort, names: sortNames, change: onSort, Icon: ArrowDownUp },
  ].map(({ label, value, names, change, Icon }) => <DropdownMenu key={label} modal={false}>
    <DropdownMenuTrigger asChild><button className="archive-control" aria-label={`${label}: ${names[value][l]}`}><Icon size={15} /><span>{names[value][l]}</span><ChevronDown size={13} /></button></DropdownMenuTrigger>
    <DropdownMenuContent className="archive-menu" align="end" sideOffset={8} collisionPadding={12}>
      <DropdownMenuLabel className="archive-menu-label">{label}</DropdownMenuLabel>
      <DropdownMenuRadioGroup value={value} onValueChange={change}>
        {Object.entries(names).map(([key, name]) => <DropdownMenuRadioItem key={key} value={key} className="archive-menu-option">{name[l]}</DropdownMenuRadioItem>)}
      </DropdownMenuRadioGroup>
    </DropdownMenuContent>
  </DropdownMenu>)}</div>;
}
