# September intake and effect playback

[한국어](../ko/content-expansion.md) · Reviewed September 13, 2026 UTC

## Source batch

Added nine appearances and one martial-art effect: three outfits, one hair, five weapon appearances, and **赤焰其华·炎炀**. The archive now contains 18 cosmetics and 22 inspected image derivatives. EN romanizations and KO readings are provisional; official localized names, Global availability, and forecasts remain unverified.

- [September 9 CN announcement](https://www.yysls.cn/news/official/20260911/37780_1313690.html): 醉魂濯玉, 步秋庭, 血铃铛, 以荷为贵, 赤焰其华·炎炀. Its displayed date is September 9, while its URL says September 11. The text says “tomorrow's update” and places these items after this week's update; September 10 is recorded as a **contextual day**, with the inference retained in `cnRelease.basis`. No time zone or exact hour is assumed.
- [September 3 CN announcement](https://www.yysls.cn/news/official/20260904/37780_1313151.html): 如是愿, 萦空, 玄瑛·莲尘不染, 万籁·斩寒鳞, 万籁·摧墨羽. September 4 is explicit for these listings. Publication date, availability duration, and the November 2 05:00 end of the discounted weapon listing remain distinct. The end-time zone is unknown.
- [Official effect clip](https://yysls.fp.ps.netease.com/file/6aa3fcf954969664de867b8bhoIMAFZy07.mp4): matched to the effect section of the first article; sampled frames show the umbrella's red flame and trails. The still poster is from 22 seconds. Original attribution and unknown reuse permission are retained; hosting remains owner-private.

The [Global September update](https://www.wherewindsmeetgame.com/news/official/903update.html), specifically its [September 13 poster](https://r.res.easebar.com/pic/20260909/89e24d3b-aed8-423b-83a9-be53724b40cf.png), identifies Duskgem: Skybound Waters, Sandveil Venom, Gold Crow's Descent (Free Morph), and Inkveil Spring. These are **intake leads**, pending CN identity mapping and time-zone confirmation. They do not become matched Global events merely because a competitor lists a similar name.

## Competitor inspection

The owner supplied [wwm-app's cosmetic codex](https://wwm-app.com/ko/ledger/codex). One desktop session showed 419 results rendered together, 812 image elements including small currency icons, zero native video elements, and 12 iframe elements including advertising/blank frames. These are DOM observations, not simultaneous downloads or a controlled performance benchmark.

The Inkveil Spring card and its detail reuse the [same animated WebP](https://wwm-app.com/images/roadmap/2026/09/cosmetic.9.1.webp): 2,404,106 bytes, 1280×720, 76 frames, approximately 5.4 seconds with indefinite looping. The image uses lazy loading, which delays its fetch but does not make an animated file static. We inspected this representative asset, not every image. Animated-image decoding, the large rendered list, and advertising are plausible contributors; no CPU trace establishes the cause of the owner's reported stalls.

The competitor's extensive categories and acquisition information are useful coverage references. Winds Ahead retains a smaller interface with source-backed details, rather than importing its records or treating inferred names/dates as official facts.

## Playback and media budgets

- Catalog images are single-frame WebP. CI rejects animated thumbnails **and** gallery images. Initial catalog rendering is capped at 24 cards; additional results use a single Show more control, only when needed. The current 18-item collection does not display that control.
- An effect detail initially contains a still image and a play button. No player or video source is mounted until a click. At most one cosmetic player is active. Leaving the panel or hiding the tab removes the player; returning does not restart it. Cleanup releases the native decoder and cancels pending transfer.
- Native controls, inline mobile playback, muted initial playback, no loop, explicit duration/download size, and an original-source fallback. Embeds also require a click and are removed when hidden. `preload="none"` alone is only a browser hint; conditional mounting is the actual initial-load boundary. See [MDN video](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/video).
- The 102,489,850-byte, 2400×1080 source became **4,182,232 bytes (95.9% smaller)** at 1280×576, 30fps, 29.034 seconds, H.264/AAC. MP4 metadata precedes video frames for progressive playback. The 56,478-byte poster is static. No raw original or competitor asset is committed.
- Enforced asset limits: thumbnail 160KB, full image 2.5MB, video 8MB/60 seconds/1280×720. Current 22 thumbnail derivatives total 1,567,354 bytes, with lazy loading beyond the first three. Those bytes are not all fetched at entry. The initial eight-item archive's 542KB figure is historical.

For the current clip, the reproducible encoding settings are scale 1280 wide, H.264 `preset slow`, CRF 27, maximum 1050 kbit/s with a 2100 kbit buffer, AAC 80 kbit/s, and `+faststart`. Keep original evidence outside Git and record actual output bytes. Do not silently substitute animated images into a still-image slot.

## Validation

Type checking, 15 domain/media tests, content references, paired localization coverage, byte records, and MP4 fast-start validation pass. Production-build browser checks cover EN/KO category and language navigation, 18 static catalog cards, 320px and 390px layouts without horizontal overflow, click-to-play (time advances, no loop), and player removal after scrolling away. CN calendar history contains ten September 2026 additions. Tab-visibility cleanup is implemented but was not independently exercised by a tab-switch test. The 24-card boundary has not yet been stress-tested against a larger real catalog. Physical-device and throttled-network measurements remain separate work; the competitor inspection does not establish a measured speed advantage.

A local byte-range request returned HTTP 200 with the full 4.18MB asset rather than HTTP 206. Playback is progressive with front-loaded metadata, but byte-range seeking is not claimed as verified. Production delivery and physical Safari seeking need a separate check before introducing longer or larger clips.

Published successfully at 04:50:43 UTC on September 13, 2026 to the [existing owner-private Site](https://winds-ahead.donghee0815.chatgpt.site). [PR #6](https://github.com/developdh/Winds-Ahead/pull/6) retains the changes; its application commit passed GitHub CI. No merge or audience change was made.

## Playback-start correction

The in-app browser reproduced a pause immediately after starting the published effect. The player remained mounted and ready, so this was not the offscreen teardown. A separate local page using the same MP4 and no React/visibility cleanup reproduced audible autoplay pausing at 0.000s and direct click playback pausing at 0.006s despite buffered media. Muted playback reached the 29.034s end. FFmpeg decoded the entire unchanged H.264/AAC file without errors.

Native previews now start muted after the existing play click. Native volume controls remain available; no repeated forced resume, player remount loop, additional video download or re-encoding was introduced. This follows [MDN's muted-start guidance](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay#handling_autoplay_failure_with_media_controls). The observed distinction is audible versus muted playback in the tested browser; the precise browser/OS cause of audible suspension is not established, and unmuted playback is not certified across environments.

The corrected production build played from 0.173s through 22.446s to `ended=true` at 29.034s in the in-app browser. The video element was absent before the play click. Type/content checks, all 18 existing tests and the production build pass.

A second run at a 390px viewport also reached 29.034s with `ended=true`. Scrolling the player fully out of view removed it and restored the play trigger; no console warnings/errors were observed. [PR #9](https://github.com/developdh/Winds-Ahead/pull/9) records the fix and its application commit passed GitHub CI. These are in-app viewport checks, not physical iOS/Android coverage.

Published as version 5 at 11:50:32 UTC on September 13, 2026 with owner-only access unchanged.

## Audible playback investigation

The owner reported that enabling sound still paused the clip. Muted startup is a quiet-preview behavior, **not a root-cause fix** for this report. Follow-up tests on September 13 isolated a Bluetooth remote-control interruption on the test Mac:

- The unchanged 29.034-second MP4 paused in both the in-app browser and standalone Google Chrome, on a local page without React, offscreen cleanup, or site code. Media remained buffered and ready; the direct-click `play()` promise resolved without a playback error.
- Re-encoding the audio to 44.1 kHz AAC, converting to mono, or testing the actual audio as PCM WAV and Opus did not remove the interruption. A four-second excerpt of the actual audio completed unmuted; a separate 30-second generated tone received the same pause. These comparisons do not establish a general browser duration threshold.
- A temporary diagnostic page registered a Media Session pause handler which logged the action and then honored it. It received `MEDIA SESSION PAUSE ACTION`; the page's JavaScript pause instrumentation otherwise showed no caller initiating the interruption.
- At **12:03:35.105 UTC**, macOS `mediaremoted` recorded a `Pause` command from **`com.apple.bluetoothd`** directed to Google Chrome. At 12:03:35.219 UTC the playback state changed from Playing to Paused. Equivalent Bluetooth commands targeted the in-app browser in earlier reproductions. At 12:04:00.058 UTC, the independent long tone received another Bluetooth pause command.

The owner approved temporarily disconnecting the connected Bluetooth headset. macOS then showed the built-in MacBook Pro speakers selected, with output unmuted. Without changing the video or site code, the isolated page played the unchanged clip unmuted from the start to `ended=true` at **29.034 seconds**, with no Media Session pause action. On the published version 5 detail page, enabling sound through the native volume control at approximately 8.5 seconds also continued to `ended=true` at 29.034 seconds, with `muted=false` and no media error.

The immediate cause is established: the Bluetooth headset connection delivered a pause after audible playback started, and disconnecting it removed the interruption in this environment. Which headset behavior produced the command (for example, wearing detection) remains unverified. This is audible completion on the tested Mac and its built-in speakers, not certification across physical mobile devices or other audio accessories.

No forced-resume loop or handler that ignores system pause commands was added to the site. Such a change would also defeat intentional headset controls. No diagnostic media derivatives, raw system logs, device addresses, or identifiers were added to Git. The source media and published site remain unchanged; this evidence update does not require a deployment.
