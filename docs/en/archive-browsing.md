# Browsing the archive

[한국어](../ko/archive-browsing.md)

## In-page details

A normal click on an archive or watchlist card opens a detail dialog over the existing list. Photographs and click-to-play videos appear above the name, release records, acquisition facts, and wiki composition. The dialog has one scrolling surface and a persistent close control. Related cards replace the current cosmetic within the same dialog.

The archive stays mounted: search, category, server, sort, loaded rows and scroll position survive closing. Opening adds an `item` query parameter. Back closes the dialog; Forward reopens it. A direct query link can be closed without leaving the archive. Normal detail URLs and modified clicks remain available, as does the small standalone-page link in the dialog header.

The selected full photograph loads only after opening. Its collection uses a stable frame when switching photos; an enlarged gallery remains available. No effect video or iframe is mounted before playback is requested. Closing the dialog, switching cosmetics, changing media mode, or leaving a playing panel releases the player. The existing reduced-motion preference applies to the new transitions.

## Filters and ordering

Server and ordering controls use compact dark radio menus with keyboard navigation, visible selected options and 44px rows. They preserve one another and the search/category query.

- Latest releases across both servers (default).
- China release date, newest or oldest first.
- Global release date, newest or oldest first.
- Upcoming Global schedule, nearest first.
- Displayed name, ascending or descending in the current language.

Date ordering uses verified release records for the selected server. Missing dates always go last, in either direction. Equal dates fall back to localized name and stable ID. Upcoming ordering uses official announced releases or current editorial forecasts; a month is ordered by its earliest possible day without presenting that day as a factual release date. Prices are not compared across currencies or servers.

## Compact facts and countdowns

Cards show the acquisition location without a repeated server prefix, followed by one release-server statement. The price and location retain their source server in their tooltips; detailed pages retain the separate server-specific conditions. Wiki-only cards have no invented price.

Blue calendar text means **Global scheduled**; amber sparkle text means **Global estimated**. These labels and icons distinguish the states without relying on color alone.

- Official day: `D-38`, then `Today` on that calendar day. A past announced date becomes `Awaiting update`, never an automatic release claim.
- Forecast window: retain the range, for example `D-118–D-132`; during the window show `Within estimated window`.
- Month/version forecast: show the month/version, never manufacture an exact-day countdown.
- Prefer official evidence; suppress forecasts for already-released items, withdrawn/superseded revisions, elapsed periods and overdue reviews.
- Counts compare UTC calendar dates and refresh every minute and on visibility changes. They are not exact release-time timers; source timezones remain unknown when not stated.

The initial browsing milestone contained no future announcements or forecasts. The subsequent [September 13 release review](release-roadmap.md) adds one verified future Global announcement and three limited-evidence forecast windows to the shared data; countdowns now show those actual records.

## Validation

28 domain/media tests cover ordering, unknown dates, D-day boundaries, cancelled announcements, reruns, forecast precision, expiry and official priority, along with the existing content/media rules. Type checking and content validation are required before publication.

Browser validation and production-build measurements are recorded below after the final checks. Physical-device and Firefox/WebKit coverage must not be inferred from the in-app browser viewport checks.

Server choices are All servers, Released in China, and Released globally. The former both-server option is merged into All servers; older `server=both` links are normalized to All servers. Individual cards still identify releases in both regions.

## Sharing

Share controls appear in the dialog header and standalone detail actions. A compact panel provides Copy link and, on supported devices, the system share sheet. Sharing keeps the language and cosmetic ID but removes the sender's filters and search terms. The recipient opens the selected cosmetic in the archive dialog. The selectable URL remains available if clipboard permission is unavailable. Cancelling the native share sheet is not treated as an error.

## Browser checks · September 13, 2026

In-app Chromium: checked Korean/English detail dialogs, photo arrows, nested enlarged gallery and Escape, normal close/focus restoration, Back/Forward, direct item links, filter/sort preservation, 24→48 rows retained after closing, and click-to-play video creation/removal. Copy link displayed success and the clean item URL; no message was sent through another app. Native share sheet completion was not tested.

Viewport geometry at 320, 360, 390, 768, 1024 and 1440px kept the dialog inside the screen with no horizontal overflow. Dialog widths were 320, 360, 390, 704, 960 and 1000px; close targets remained 44px. EN 320px and KO 390px menus and photo-first layouts were visually inspected. The frame explicitly disables CSS size transitions, and changes photographs without scaling the outgoing frame.

No physical mobile devices, Firefox/WebKit, 200% zoom, network throttling, native share destinations or live reduced-motion changes were tested. Reduced-motion and clipboard-failure paths were reviewed in code.

## Build measurement

The final production build emits 409,068 bytes of locally gzipped client JavaScript across all modules, including lazy modules (previous milestone: 388,229 bytes, +20,839). The largest catalog data module is 169,078 bytes gzip; the SiteApp module is 54,700 bytes gzip. Font subsets total 335,888 bytes. These are artifact measurements, not per-navigation transfer or field performance; the existing overall client budget remains unresolved. No new images or videos were added. Type checking, 28 tests, content validation and the production build passed.


## Desktop dialog and release-state correction · September 13, 2026

The production CSS omitted the dialog's custom `translate` declaration while retaining the shared dialog's `-50%` vertical translation. At 1440×900 the 828px-tall dialog settled at −378px instead of 36px. The earlier development-only viewport checks did not catch this production difference. The archive dialog now uses horizontal auto margins between fixed viewport insets, and the call-site `translate-none` utility removes both shared centering utilities. Entry/exit movement remains independent of its layout; the shared dialog primitive is unchanged.

The production build was exercised locally in in-app Chromium at 1920×1080, 1440×900, 1440×700, 390×844 and 320×640. Dialog tops were 43.2, 36, 28, 12 and 12px respectively. All bounds stayed inside the viewport; close targets remained 44×44px. A long dialog scrolled internally while the close button stayed at 37px in a 700px-tall viewport. Photo switching, the nested gallery, Escape, direct query opening, reopen and focus restoration were checked. No Windows machine, physical mobile device, Firefox/WebKit or browser zoom result is claimed.

Cards and detail panels now share date-aware regional states. The menus add **China scheduled**, **Global scheduled** and **Release unverified**. Released filters exclude future and pending announcements. A future official day remains scheduled on that day; an elapsed announcement becomes pending, never automatically released. Undated confirmed releases remain valid when there is release evidence. Unknown records do not enter scheduled filters. Forecasts retain their separate amber treatment; official schedules are blue and pending verification is gray, with distinct text and icons.

Review of retained official excerpts corrected **56 explicit CN release flags and six implicit release assumptions**. The original source references and unknown dates are retained in the [correction log](../research/2026-09-13-release-status-corrections.json). These 62 historical announcements now carry `confirmationPending` and display **China release unverified**. They are not new future launches or proof that the cosmetic remains unreleased. Live in-game availability was not checked; this is a correction to the evidence held by the archive. The initial announcement source for Chongming and Tianzhi Minggui was also re-read on the [official CN site](https://www.yysls.cn/news/official/20250926/37780_1261910.html).

On the review date there are no verified future CN dates in the current records; the China scheduled filter can therefore be empty. The Global scheduled filter shows the existing September 16 announcement with `D-3`. Korean pending cards and detail state, English pending labels, the mobile menus and Global countdown were checked in the production build. Type checking, all 32 domain/media tests, content validation and production compilation passed. Font files and media are unchanged; no newly introduced Hangul characters required a new subset.


## Roadmap quick view and card alignment · September 13, 2026

Roadmap images and titles, calendar day entries, mobile agenda entries, estimated periods and undated cosmetics now open the same detail dialog as the archive. The URL retains the schedule's view, server, month and type and adds `item`. Closing restores the underlying schedule and trigger focus; browser Back/Forward closes and reopens the dialog. Ordinary modified clicks still use the standalone detail link. Related cosmetics inside the dialog reuse that dialog.

Card release-server text aligns with the right edge of the price above it; acquisition stays on the left. The old separator is removed. Long acquisition names truncate on narrow cards, with their complete text retained in the tooltip and detail dialog.

Checked in in-app Chromium: Korean official/estimated timeline links, calendar grid entries, estimated-period links, undated items, keyboard Enter/Escape, focus restoration and Back/Forward. Closing calendar and undated dialogs retained scroll positions of 660.5px and 1156.5px. In the local production build, a Korean mobile agenda entry retained its 1175px scroll position; the 390×844 dialog remained within the viewport (top 12px, bottom 844px). English roadmap titles opened the same popup at 1440×900 (top 36px, bottom 864px). KO 390/1440px and EN 320/1440px archive cards had right-aligned release labels without overlap or horizontal page overflow; mobile captures were visually inspected. No physical mobile devices, Firefox/WebKit, zoom or network throttling were tested.

Type checking, 32 existing domain/media tests, content validation and the production build passed. All 37 client JavaScript modules total 418,797 gzip bytes (+69 from the preceding build), including lazy modules; this is an artifact measurement, not initial transfer or field performance. No dependencies, fonts, media or release facts changed.
