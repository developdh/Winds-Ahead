export const acquisitionNames = {
  all: { en: 'All sources', ko: '모든 획득처' },
  shop: { en: 'Shop', ko: '상점' },
  resonance: { en: 'Resonance / draws', ko: '공명·추첨' },
  'sound-jade': { en: 'Sound Jade Shop', ko: '음옥 상점' },
  'battle-pass': { en: 'Battle Pass', ko: '강호령' },
  event: { en: 'Events', ko: '이벤트' },
  gameplay: { en: 'Gameplay / milestones', ko: '플레이·누적 보상' },
  exchange: { en: 'Other exchanges', ko: '기타 교환' },
  unknown: { en: 'Source unverified', ko: '획득처 확인 중' },
};

export function validAcquisition(value) {
  return Object.hasOwn(acquisitionNames, value) ? value : 'all';
}

// Use recorded methods/currencies, not price amounts or inferred availability.
export function acquisitionMethod(acquisition) {
  if (!acquisition || acquisition.kind === 'unknown') return 'unknown';
  if (acquisition.kind === 'shop') return 'shop';
  if (acquisition.kind === 'battle_pass') return 'battle-pass';
  if (['limited_draw', 'seasonal_draw'].includes(acquisition.kind)) return 'resonance';
  if (['exchange', 'exchange_shop'].includes(acquisition.kind)) {
    const currency = acquisition.currencyOriginal;
    const location = acquisition.location?.original ?? '';
    if (['音玉', 'Sound Jade'].includes(currency) || /音玉/.test(location)) return 'sound-jade';
    if (['八音窍', 'Harmonic Core'].includes(currency) || /和鸣|共鸣|Resonance|Draw Shop/.test(location)) return 'resonance';
    return 'exchange';
  }
  if (acquisition.kind === 'event') return 'event';
  if (['exploration', 'quest', 'achievement', 'sect', 'milestone'].includes(acquisition.kind)) return 'gameplay';
  return 'unknown';
}

/** Keep the selected acquisition and its server together for both filtering and cards. */
export function selectAcquisition(cosmetic, cnRecord, globalRecord, serverFilter = 'all', methodFilter = 'all') {
  const method = validAcquisition(methodFilter);
  const originalServer = cosmetic.acquisitionServer ?? 'CN';
  const forServer = server => ({ server, acquisition: (server === 'CN' ? cnRecord : globalRecord)?.acquisition
    ?? (originalServer === server ? cosmetic.acquisition : null) });
  const selectedServer = ['cn', 'cn-upcoming'].includes(serverFilter) ? 'CN'
    : ['global', 'global-upcoming'].includes(serverFilter) ? 'Global' : null;
  const entries = selectedServer ? [forServer(selectedServer)]
    : [forServer('Global'), forServer('CN')].filter(entry => entry.acquisition);
  // With all servers selected, prefer known terms; missing Global terms do not erase CN facts.
  const known = entries.filter(entry => acquisitionMethod(entry.acquisition) !== 'unknown');
  const candidates = known.length ? known : entries;
  if (method === 'all') return candidates[0] ?? { server: originalServer, acquisition: null };
  return candidates.find(entry => acquisitionMethod(entry.acquisition) === method) ?? null;
}
