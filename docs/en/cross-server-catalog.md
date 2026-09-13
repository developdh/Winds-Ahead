# China and Global cosmetic inventory

[한국어](../ko/cross-server-catalog.md)

The September 13, 2026 update expands 40 appearance records to **545**, with **455 static reference images** for 356 records. Official sources support 403 CN records and 215 Global records; **73 cross-server identities** have been linked through named artwork. Counts describe records, not a certified unique in-game total: unresolved regional matches can remain separate.

## What is included

Outfits, hair, weapons, effects, accessories (including clearly labeled companion cosmetics), and mounts. The Global intake includes 27 permanent launch-reward entries and 186 dated listing events. CN and Global prices, requirements, dates and current-availability limitations remain separate. Catalog cards prefer the documented Global acquisition terms when present and show the pricing server. Details show each server with its sources. Unknown is not exclusive or unreleased.

Official English/Korean names take precedence where reviewed; Chinese originals and provisional aliases remain searchable. Earlier Global records retain their reviewed English identifiers where Korean naming has not been checked. Four launch-reward Korean naming conflicts, differing launch dates (EN November 14 / KO November 15), and ambiguous currency wording are preserved. No timezone is invented; May source clock times explicitly retain UTC+8 in scope.

## Evidence and coverage

The [source inventory](../research/2026-09-13-inventory.json) retains 601 CN index entries, 470 parsed CN pages, 565 raw name/category candidates, the 64-entry Global index, and 57 community catalog leads. Extraction candidates are not a game-total claim. Each published record has a primary official source; community captures are imagery only and cannot establish release dates or prices. Missing individual images are explicitly marked rather than filled with a different costume. Original files and OCR are outside Git; only bounded derivatives and provenance are committed.

Random boxes and packages are distinguished from their individual contents. Six umbrella styles and three accessory components use their own images, and package/draw costs are not represented as fixed individual prices. A repeated English name in outfit and hair categories remains two records (for example Purple Dew).

## Performance and review

The first page renders 24 cards; more are shown on request. Thumbnails are static WebP, capped at 160 KB each; gallery files are capped at 2.5 MB each. GIF originals become a single still. No new autoplay video or remote iframe is introduced. Existing effect playback remains click-to-play. Media with unknown redistribution permission remains an owner-private reference preview; this update does not change access.

GitHub milestones preserve the regional-data foundation, the first 431-record cohort, and the final archive review. Completed checks: schema/reference integrity; 21 domain/media tests; TypeScript; forecast-history preservation; and a successful production build. In-app Chromium checks covered CN/Global/both filters, official-name search, language/back-link state, and a no-image hair detail. Catalog and detail widths of 320, 360, 390, 768, 1024, and 1440 px were checked; an overflowing English category strip was fixed. The production build rendered 24 cards, zero video/iframe players, no broken loaded images, and no browser console errors in the checked catalog.

The four visible thumbnails at 320 px total 175,936 bytes on disk; this is an asset-size check, not a network or Core Web Vitals measurement. Fonts total 315,176 bytes. All emitted client JavaScript, including lazy chunks, totals 368,241 bytes gzip; the full catalog data contributes a 153,497-byte gzip chunk. The 200 KB initial-JavaScript target is not certified: route-level data splitting and a throttled network measurement remain performance follow-ups. No physical iOS/Android device, Firefox, WebKit, field INP, or slow-network result is claimed. This expansion does not certify that every in-game cosmetic has been captured.
