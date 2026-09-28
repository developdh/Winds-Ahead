# Deadline notices and Huiji photos · September 28, 2026

[한국어](../ko/deadlines-wiki-2026-09-28.md) · [PR #33](https://github.com/developdh/Winds-Ahead/pull/33)

The owner approved the proposed sale/exchange ending-soon display and requested more photographs from the previously supplied [Huiji appearance wiki](https://yy16s.huijiwiki.com/wiki/外观). These additions are grouped with the forecast/gallery refresh in v0.2.8.

## Deadline behavior

- 23 structured official deadlines retain the server, purpose, start day, local end value, date precision, explicit or unknown time zone, source and review date. Existing reviewed Global sale terms were migrated without claiming a new source review; September 23 Global/CN prose and the September 3 CN exchange notice were reread.
- Archive cards show a compact notice for the acquisition server being displayed. Roadmap and calendar show a server-scoped seven-day list; the estimate-only filter excludes it. Detail pages include the source date/time and link, even after the announced period has passed.
- Sale, exchange, discount, draw and event ends stay separate. Cicada Requiem's October 10 discount does not become a sale-removal date. Conflicting Forged in Fire dates and duration-only offers are excluded.
- Exact UTC/UTC+8 instants expire at the specified time. Minute/day precision and unknown zones retain a possible interval; while an end is ambiguous the UI says to check the exact time. Unknown zones span UTC+14 to UTC−12 conservatively. No precise countdown is shown. Client time refreshes each minute and on tab visibility changes.
- An elapsed date never marks an appearance released or verifies live shop availability. Historical prices and existing regional status remain unchanged.

## New photos

Added **55 wiki images** to **55 previously image-missing appearances**: 7 outfits, 47 weapons and 1 mounts. Six official female gallery additions from the earlier part of this update remain, bringing the total to **663 image references** across **455 of 716 cosmetics**. The remaining entries retain an honest missing-photo state.

Named article and file pages were inspected in the browser, then the public original assets were downloaded. Full-body female outfit views, complete weapons and mounts were visually checked. Head-only outfit textures and irrelevant icons were rejected. Source names and identity remain in the per-image [provenance record](../research/2026-09-28-wiki-gallery-provenance.json).

Full originals remain available in the gallery. Transparent outer margins are trimmed only for display derivatives; portrait thumbnail canvases contain the complete item, including wide weapons. Optimized WebP files use existing lazy loading. Wiki photographs are labeled as community references and link to the article and original, without changing official release status.

The goose reference is only 260×260 at its original resolution; its detail caption states this limit. The other new images have 512–1024 px main dimensions. The file pages describe game-client textures. **Reuse permission remains unknown**: the wiki footer's CC BY-NC-SA 3.0 does not establish a license for NetEase game art. The files remain outside the code license; attribution is not a redistribution grant.

## Validation

Type checking, 44 domain/media tests, content/reference validation, forecast-history preservation and production Worker build passed. Deadline tests cover the seven-day boundary, server separation, UTC+8 expiry, date-only and unknown-zone ambiguity, invalid local times and conflicted-source exclusion. All new photo derivatives are checked for dimensions, byte limits, static format and full-image preservation.

In-app Chromium checks covered the new server switch, opening a deadline detail by keyboard, explicit discount wording, wiki gallery/source links, and archive badges. Responsive checks cover 320, 360, 390, 768, 1024 and 1440 CSS px with no horizontal overflow in inspected views. Physical devices, Firefox/WebKit, 200% text enlargement and field performance were not tested. Existing large-chunk and future Vite-loader warnings remain. No new recurring job or automatic merge was added.

Photo derivatives add 1,395,400 thumbnail bytes, 206,252 selector bytes, 2,293,572 display bytes and 2,392,316 full-image bytes. These are stored artifact sizes, not first-viewport network transfer or field performance results.

[Korean mobile capture](../research/2026-09-28-ui/ko-wiki-photo-390.png) · [English desktop capture](../research/2026-09-28-ui/en-deadlines-1440.png)
