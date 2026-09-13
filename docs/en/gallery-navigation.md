# Detail image gallery · September 13, 2026

[한국어](../ko/gallery-navigation.md)

Opening a detail image now keeps the selected variant and offers large previous/next chevrons over the photo, horizontal dragging/swiping, and left/right keyboard arrows. The footer contains the current image number and the matching official-original link. Single-image cosmetics omit navigation; the first and last images disable the unavailable direction. Closing restores focus to the opening button, and the selected detail thumbnail follows gallery navigation.

## Motion correction

The user identified a mismatch between the popup's size and its animation, rather than excessive motion. Browser inspection confirmed that the dialog primitive supplied `transition-property: all` and a `0.2s` transition while the gallery ran a separate `0.65s` entrance. Rapid viewport changes exposed intermediate widths instead of the requested dialog width.

The gallery now explicitly disables layout transitions, reserves its height before the viewer or full image loads, and applies one entrance to the complete frame. Independent image entrance transforms and animated blur were removed. Horizontal image motion stays inside the fixed viewport; short images are centered and long promotional sheets remain vertically scrollable. Reduced-motion styles disable the entrance, and the carousel uses zero-duration navigation when that preference is active. No vendored UI primitive was changed.

## Loading and state

The gallery viewer and carousel are a separate lazy-loaded module. The selected full image loads first; after it is ready, its immediate neighbours load at low priority. Requested full images remain mounted until the popup closes, so navigation never substitutes a cropped thumbnail. Prefetching does not cascade beyond the selected image's neighbours. Loading and image-error messages retain the same outer dimensions. Gallery reinitialization restores the current slide, and changing cosmetics resets the detail state by item ID to avoid carrying a second-image index into a single-image cosmetic. No new media or dependencies were added.

The apparent enlargement during navigation came from changing the outgoing frame's React key and replacing its full landscape image with a cropped portrait thumbnail as soon as selection changed. Stable keys and retained full-image sources now preserve each photo's dimensions throughout horizontal movement. The existing popup entrance and bare chevrons are unchanged.

The emitted gallery client module is 25,337 bytes, or 10,002 bytes with local gzip compression. This is a module-size measurement, not total page transfer or a field performance score.

## Verification

- In-app Chromium: English and Korean galleries, previous/next controls, keyboard movement after reaching a boundary, horizontal dragging at mobile width, selecting the second thumbnail before opening, matching original-image links, and closing/focus restoration.
- Navigation regression: both Bu Qiu Ting images retain their full-image sources during movement, with no thumbnail nodes. At 390px each remains 348 × 195.75px; at 1440px each remains 998 × 561.375px (subpixel rounding within 0.001px). Checks included buttons, keyboard, dragging, and reopening on the second image.
- Viewport geometry: 320, 360, 390, 768, 1024 and 1440 CSS px. After the transition fix, dialog widths were respectively 304, 344, 374, 736, 992 and 1040px; every frame stayed within its viewport. The user's final refinement removes circular arrow backgrounds and borders: 40px mobile / 44px desktop chevrons sit in transparent 64px / 72px targets, with a light glyph shadow for contrast. Close remains 44px.
- Screenshots were inspected in the working session at desktop and mobile sizes. These are viewport checks, not physical-device touch or frame-rate certification. A per-frame sampling attempt was unavailable in the browser tool; no measured FPS claim is made.
- Type checking, the existing 19 domain/media tests, content validation (40 cosmetics / 66 images) and the production build pass. New Korean labels are covered by the existing local font subset.
- Physical iOS/Android, Firefox/WebKit, 200% text enlargement, simulated image-network failure and live reduced-motion preference changes were not exercised in this pass. The reduced-motion and failure paths were reviewed in source.

Access remains owner-private. This gallery change does not perform the separate public-domain launch or alter cosmetic facts, prices, videos or calendar forecasts.
