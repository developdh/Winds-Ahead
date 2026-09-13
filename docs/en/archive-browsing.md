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
