# MVP status and content operations

[한국어](../ko/mvp-status.md) · [README](../../README.md)

Updated September 13, 2026 UTC. This report describes the implemented owner-private MVP, not a cleared public launch.

## What is implemented

- First visit: an image-led entrance with a serif title, two vertical language choices, and a short loading transition. Subsequent visits skip the prompt. First-time deep links resume the selected cosmetic or calendar query. If persistent storage is unavailable, a one-time entry marker and in-memory preference allow browsing without a redirect loop.
- Two primary destinations: Cosmetics and Calendar. Search and category selection share one toolbar. A small bookmark entry opens the local collection. Extra sorting, calendar filters, and layout controls were removed following the user's request for fewer controls and more useful information.
- Detail pages contain images, Global status, CN dates/acquisition, and collapsible source history. Full images load on request. Per-item videos support verified YouTube embeds, Bilibili links, and optimized official NetEase clips. Effects use click-to-load native playback, removed when offscreen or hidden. The About trailer is general game context only.
- Calendar: official CN history and separately verified Global events, responsive desktop month/mobile list views, month navigation, and undated items. Evidence-based forecasts support month, date-window, or version precision, plus preserved revision history.
- Accessible names, keyboard-operable controls/dialogs, visible focus, reduced-motion behavior, and lightweight image/font subsets. Optional page-bound WebMCP tools use the same search and watchlist logic as the UI.

## Canonical files

All paths below are under `site/`.

| File | Purpose |
| --- | --- |
| `content/research.json` | Verified CN source snapshot, original names, dates, acquisition, image references, item videos |
| `content/localizations.json` | Korean provisional readings and EN/KO descriptions, keyed by cosmetic ID |
| `content/media.json` | Optimized private preview paths, original URLs, sizes, ownership and unknown reuse permission |
| `content/global-events.json` | Global evidence and explicit events; never copied from CN dates |
| `content/forecasts.json` | Append-only forecast revisions with bilingual rationale, assumptions, evidence, and review dates |
| `content/updates.json` | Bilingual publication/change log with evidence IDs |
| `scripts/validate-content.mjs` | Schema, references, date precision, translation coverage, video provider, and asset validation |
| `scripts/validate-history.mjs` | Rejects rewriting/deleting prior forecast revisions against a Git base |

Private image and video derivatives are recorded in `media.json` and `research.json`. The current rights snapshot reflects those copies; permission for public redistribution remains unknown.

## Update workflow

1. Inspect official material and record server, scope, publication/release dates, evidence, and unknown values.
2. Add a stable cosmetic ID and both languages together; do not promote provisional names to official names without evidence.
3. Match exact media to the cosmetic, record reuse basis, and optimize authorized images. Videos require a matching provider ID/URL and source ID.
4. Add global facts separately. Append a new forecast revision when its reasoning changes; never edit past revisions to improve apparent accuracy.
5. Run the four README checks and review the affected mobile/desktop page. Run history validation with the intended Git base when forecasts change.
6. Update the bilingual log and open/update an English content PR. Initial recurring research uses this task, without a separate GPT API. Do not merge or deploy a recurring proposal automatically.

## Verification and limits

- Automated date/precision, calendar boundaries, source separation, revision, corrupted watchlist, translation completeness, acquisition cost, and video URL checks pass (18 tests, including static-image and video budgets). Content validation covers 18 cosmetics, 22 images, 18 localizations, and 3 updates.
- Browser checks cover first-visit language selection, remembered return visits in both languages, locale switching, preserved deep-link/query, search, saved items, image enlargement, and CN calendar records. Responsive geometry was checked at 320–1440 CSS pixels using the in-app browser; these are viewport tests, not physical-device certification.
- Production-build checks also exercise language switching, filtered detail links, image enlargement, and calendar navigation. Client entry signatures are preserved because the previous bundled navigation module lost exports needed by lazy Link imports; the corrected build completes these journeys without new prefetch errors.
- The current 22 thumbnail derivatives total 1.57MB, loaded lazily beyond the first three; full sheets are deferred. The initial eight-item archive totaled about 542KB. The first effect clip is 4.18MB and loads only after clicking. Fonts are licensed local subsets. Build sizes are not field Core Web Vitals; p75 LCP/INP/CLS and slow-device/network targets remain unmeasured.
- Real iOS/Android, Firefox/WebKit, and 200% text enlargement need separate coverage. No public reporting channel, media redistribution clearance, or predictive-accuracy claim is included.
- GitHub changes are reviewable stacked PRs. Main has not been merged; no automatic merging is enabled.

[Open the private MVP](https://winds-ahead.donghee0815.chatgpt.site). Sites reported successful publication on September 13, 2026 UTC. Access remains owner-only. The foundation is retained in PR #5 and the latest content/effects in [PR #6](https://github.com/developdh/Winds-Ahead/pull/6); publishing did not merge the stacked branches into main.

See [September intake and playback](content-expansion.md) for the latest evidence, competitor findings, optimization decisions, and validation limits.

See [Detail image gallery](gallery-navigation.md) for the later navigation and popup-motion changes and their validation scope.
