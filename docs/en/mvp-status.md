# Site status and content operations

[한국어](../ko/mvp-status.md) · [README](../../README.md) · [Latest release](releasing.md)

Updated September 29, 2026. [Winds Ahead](https://windsahead.com/en) and its source repository are public. The initial owner-private MVP was superseded by the [September 13 public release](public-launch.md); historical milestone counts and checks remain in their dated reports.

## Implemented experience

- English/Korean entrance, remembered language and preserved deep links; dark image-led cosmetic archive, category/acquisition filters, search and local saved items.
- Detail dialogs with server-specific official names, acquisition and source history; full-image gallery, female-first references, keyboard/swipe navigation and click-to-load effect video.
- Official regional calendar and roadmap, distinct editorial forecast windows with review reminders and preserved revisions, and separate sale/exchange/discount/event deadlines.
- Community wiki composition and appearance facts load on demand. Community imagery does not establish official release status, CN identity or a redistribution license.

## Current content snapshot

716 cosmetic records; 667 static image references across 457 records; 259 records still lack an inspected photo. There are 639 regional records, 211 Global calendar events, 24 structured deadlines, 16 preserved forecast revisions and 395 wiki references (383 detailed articles). These are repository counts, not certified game-wide coverage. Unresolved regional matches may remain separate.

## Canonical files

All paths below are under `site/`.

| File | Purpose |
| --- | --- |
| `content/research.json` | Catalog identities, original names, CN evidence, images and videos |
| `content/localizations.json` | English/Korean descriptions and Korean fallback names |
| `content/media.json` | Local optimized previews, full images, byte sizes and rights status |
| `content/regional-records.json` | Separate CN/Global status, identity evidence and acquisition |
| `content/global-events.json` | Official Global sources and dated calendar entries |
| `content/deadlines.json` | Server-specific, precision-aware acquisition/discount ends |
| `content/forecasts.json` | Preserved editorial revisions, evidence and review dates |
| `content/updates.json` | Bilingual archive change log |
| `public/data/wiki/` | On-demand community details with attribution |
| `scripts/validate-content.mjs` | Content, translation, regional and asset validation |
| `scripts/validate-history.mjs` | Rejects rewriting or deleting prior forecasts |

## Maintenance and publication

Follow [calendar maintenance](calendar-automation.md): inspect official CN/EN/KO notices, check names, acquisition, deadlines and missing photos together, and retain unknown facts and inaccessible-source notes. Avoid duplicate items, forecast revisions, PRs and schedules. Public media attribution is not blanket reuse permission.

Use a reviewable branch and English PR with paired English/Korean documentation. Run types, tests, content/history validation and a production build; inspect affected English/Korean mobile and desktop flows. Publish each completed update through the [release procedure](releasing.md), keeping versions aligned and verifying CI. GitHub release and Sites deployment are separate results; automatic merging remains disabled.

## Verification limits

Current update checks belong in [v0.2.12 notes](releases/0.2.12.md); earlier test counts are historical. Physical iOS/Android, Firefox/WebKit, 200% text enlargement, throttled-network performance and field Core Web Vitals still require separate coverage. The 200 KB initial JavaScript target remains unverified. The public issue tracker accepts corrections/removal requests; third-party artwork remains outside the code license with reuse permission unknown.

## Magazine · October 1, 2026

Added the bilingual magazine archive, Issue 01, six mobile PNGs per language and ZIP downloads. Primary navigation now includes Cosmetics, Roadmap and Magazine. Direct magazine links open in their explicit language without the first-visit language landing. See [magazine production](magazine.md) and [v0.3.0](releases/0.3.0.md) for validation and media limits.
