# Acquisition details

[한국어](../ko/acquisition-details.md)

Each catalog card shows a short CN price/method summary and acquisition location. The detail page places acquisition information directly below its title/actions, before Global release status. It includes the quantity and currency, original CN currency name, shop/event location, method, conditions, and any verified regular price behind a limited discount.

The compact card layout places the price beside the original name as small, quantity-first text without a multiplication sign or dedicated price row. Acquisition location and Global status share one line; a globe marks Global status, with its full label retained for assistive technology and hover. Long secondary names/locations may ellipsize on narrow cards; currency and quantity stay visible and detail pages retain the complete facts. Draw and paid-pass cards use short method labels rather than implying a fixed price.

The 18-item snapshot contains 13 fixed-price purchases/exchanges, four draw rewards, and one paid battle-pass reward. The quantities are historical CN facts, not current availability or Global prices. No real-money conversion is calculated.

## Evidence and terminology

- [September 2025 CN announcement](https://www.yysls.cn/news/official/20250926/37780_1261910.html): the limited event uses 瑶昙心, permits exchange with 长鸣玉/长鸣珠, gives a free first draw, and limits the 长鸣玉 exchange to 18 瑶昙心. That limit is not a cosmetic price. Seasonal draws use 绕梁之音 exchanged with 长鸣玉. Per-draw rates, total cosmetic cost and the paid pass's price/reward level are not stated.
- [September 9, 2026 CN announcement](https://www.yysls.cn/news/official/20260911/37780_1313690.html): specific purchase/exchange quantities and locations for five new entries.
- [September 3, 2026 CN announcement](https://www.yysls.cn/news/official/20260904/37780_1313151.html): the limited 玄瑛·莲尘不染 exchange costs 2 音玉 instead of 3. The discount window is retained, with no assumed time zone.

`site/content/terminology.json` retains official EN/KO interface terminology sources. Echo Beads / 장명주, Harmonic Core / 공명 구슬, Sound Jade / 음옥 and Lingering Melody / 음의 선율 are reader-facing labels mapped editorially to the original CN currency names, which remain visible. This terminology mapping does not establish regional price equivalence. Yao Tan Xin / 요담심 and the Wenyin / 문음 subshop suffix are provisional readings of CN names. No currency icons or additional media requests were added.

## Maintenance and validation

`acquisition.pricing` is `fixed`, `draw`, or `pass`. Every record requires a bilingual `location` with an original CN identifier; unknown quantities remain `null`. Fixed purchases need a positive integer and known currency. Draw/pass entries cannot acquire a fabricated fixed amount, and a regular price must exceed its discounted amount. `conditions` retain optional bilingual restrictions. The earlier `en`/`ko` acquisition prose remains as evidence context; the structured fields drive the UI.

Type checking, content validation, the 18-test domain/media suite and the production build pass. In-app Chromium checks covered KO fixed purchases, effect exchanges, discounted exchanges and draw conditions, plus EN paid-pass unknowns. Catalog geometry has no horizontal overflow at 320, 360, 390, 768, 1024 and 1440 CSS px. Desktop KO and narrow mobile KO/EN detail layouts were visually inspected. No warning/error console entries were observed. The catalog and unplayed effect detail contain no video element; this change adds no media requests. Physical-device and slow-network certification are not implied.

Published as version 3 to the [existing owner-private Site](https://winds-ahead.donghee0815.chatgpt.site) at 11:28:08 UTC on September 13, 2026. [PR #7](https://github.com/developdh/Winds-Ahead/pull/7) retains the change; its application commit passed GitHub CI. Site source commit: `7e52d70d686ab1f16b5892c96f1d2e5e8a02c67d`.

The subsequent card compaction passes the same 18 tests, type/content checks and production build. In-app Chromium inspection covered KO at 390px and EN at 320px/1440px, locale switching and card-to-detail navigation. At 320, 360, 390, 768, 1024 and 1440 CSS px, every EN status row remained one line and every price fit without clipping or page overflow. No console warnings/errors were observed. No media, requests, dependencies or controls were added.

Card compaction was published as version 4 at 11:34:09 UTC on September 13, 2026, with access unchanged. [PR #8](https://github.com/developdh/Winds-Ahead/pull/8) preserves the reviewable change.
