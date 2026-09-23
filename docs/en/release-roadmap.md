# Release roadmap and forecast reviews

[한국어](../ko/release-roadmap.md) · [Calendar maintenance](calendar-automation.md)

The roadmap shows every upcoming official announcement first, followed by a separate Estimated windows section labeled Editorial · Not official. Each section is ordered chronologically; an estimate whose window starts earlier never precedes an official date. The calendar retains historical CN/Global dates. Choose All, Official, or Estimated; language, server, view, month and type are preserved in the URL. Existing links with a month still open the calendar. Blue labels identify official announcements, gold labels identify estimates, with distinct wording and icons.


The calendar’s Estimated windows section uses the same complete current-forecast selector and ordering as the roadmap, including windows after the selected month. Month navigation filters dated official events only. Both views suppress withdrawn, elapsed and officially superseded forecasts together, while retaining revision history.

## Verified announcement

**Chilled Current / 枕寒流**: September 16, 2026 after the update. The [official Global X post](https://x.com/WhereWindsMeet_/status/2098411248107028581), published September 11, was read directly, including the male/female image panels. The poster specifies September 16 UTC; the post gives the closing time as October 15, 04:59 UTC+8. No opening hour is inferred. The status stays **announced**, even after its scheduled day passes, until a subsequent source verifies release.

The male crown, ink landscape robe and blue iris shoulder/waist decoration match the [CN battle pass announcement](https://www.yysls.cn/news/official/20260807/37780_1310523.html), which lists August 7. Both sources identify a battle pass outfit. The interval is 40 calendar days; it is not a universal offset. Only the verified English official name was added; Korean naming remains provisional. Prices and reward levels remain unknown.

## Comparison and initial forecasts

Three recent, matched shop outfits provide an exploratory comparison:

| Appearance | CN day | Global day | Calendar-day interval |
|---|---|---|---|
| 芳菲春华 | 2026-03-20 | 2026-06-25 | 97 |
| 点春瓯 | 2026-05-01 | 2026-08-09 | 100 |
| 轻鸢入画 | 2026-04-17 | 2026-08-20 | 125 |

CN dates were re-read in [March 19](https://www.yysls.cn/news/official/20260320/37780_1292235.html), [April 29](https://www.yysls.cn/news/official/20260429/37780_1298503.html), and [April 15](https://www.yysls.cn/news/official/20260417/37780_1296687.html) announcements. Global dates use the previously inspected official update panels in the source register: `global-9b0320799ff3`, `global-1bf16bd98a9a`, and `global-7108a47efe11`. These are selected examples, not an unbiased training set or a calibrated prediction model. Product prices differ. Snowborne Stars / 明河载雪 is a counterexample: January 23 → September 6, **226 days**. Seasonal releases can also be simultaneous. No fixed CN-to-Global delay is applied to the catalog.

| Candidate | Editorial Global window | Basis and limitation |
|---|---|---|
| 玄瑛·静影摇月 | Sep 16–Oct 31, 2026 | CN July 3 fan from the same notice/series as the bow listed globally September 13. Shared series is a weak signal; separate regional schedules are possible. September 16 is a watch-window boundary, not a fan announcement. |
| 莲台鹤 | Oct 1–Nov 30, 2026 | CN July 3 shop outfit, compared with the recent shop examples; wider window for order variation. |
| 紫萸香慢 | Oct 1–Dec 31, 2026 | CN July 24 shop outfit; broader window because it is a low-cost product and comparators differ. |

Candidate sources: [CN June 30](https://www.yysls.cn/news/official/20260703/37780_1306509.html), [CN July 23](https://www.yysls.cn/news/official/20260724/37780_1309060.html), and the registered [September 3 Global update](https://www.wherewindsmeetgame.com/news/official/903update.html). 莲台鹤's day is contextual: “this Friday” in the displayed June 30 article means July 3. The bow's CN exact day remains unknown; it was not filled from its sibling's date.

All three estimates have **limited evidence**, revision 1, and a September 16 review date. Global launch, order, pricing and even eventual availability are unconfirmed. Windows are editorial judgments, not statistical confidence intervals. Items without a defensible window remain unscheduled. Jiangnan commemorative and collaboration items were not assigned generic shop offsets. The three candidate IDs have no verified Global identity match in the current register; that does not establish exhaustive absence from every Global announcement.

A mirrored “Bane of Life” September 16 lead was found, but its original post and CN identity were not verified during this review. It was not promoted to confirmed data. CN/EN/KO official news indexes were checked; no named future CN cosmetic release was verified. These collection limits must not be described as “no upcoming announcements exist.”

## Maintenance and validation

The review was performed in the current Codex task; the exact model identifier is not exposed in this session. Method version: `release-review-v1` — inspect official originals, compare identified products within acquisition families, record counterexamples, prefer broad windows or unknowns, and keep EN/KO reasons. There was no separate GPT API run. Forecast creation time: September 13, 22:21:10 UTC. `forecasts.reviewedAt` supplies the visible source-review date.

The existing daily task is retained without creating another schedule. Update official records and this review date only after source inspection. Add revisions instead of overwriting published forecasts. Roadmap and calendar retain active estimates with remaining windows after their review deadline, visibly labeled “Review due.” Ended, withdrawn and officially superseded estimates remain suppressed. Archive countdowns still suppress overdue estimates. All forecast revisions remain accessible in history. Passing a forecast review date does not delete the underlying record.

Roadmap cards use existing lazy-loaded thumbnails; no video players, external embeds, or runtime AI calls are added. Missing images have an explicit fallback. Only six undated examples render, with access to the full archive. Tests cover official precedence, unknown release status after a due day, cancellation, reruns, review expiry and version precision. Type checking, content validation and production build are required before publishing.

Completed validation: 30 domain/media tests, type checking, content validation and the production build passed. Browser checks covered Korean at 390 px and English at 320 px, roadmap/calendar switching, forecast filtering, month overlap, CN reset, and a legacy month URL. Neither small viewport overflowed horizontally, and the roadmap created no video elements. Native devices and field performance were not measured.

## Upcoming-view rule

At the owner’s request, the roadmap hides announcements after their scheduled UTC calendar day has passed, including entries that previously displayed “Awaiting release check.” Announcements due today and later remain visible. Historical calendar/source records retain their original status; hiding an old announcement does not confirm release or revive a superseded forecast. This shared rule applies to China and Global timeline views and schedule-type filters.

Validation for this display change: type checking, all 32 existing domain/media tests, content validation and the Worker build passed. On September 14 UTC, local browser checks showed five Global entries (two upcoming announcements and three forecasts), two under Official, and an empty China timeline. The two elapsed Global announcements no longer appeared. Language switching retained the Official filter.

## September 20 source review

Added five September 20 Global announcements from the paired [English](https://www.wherewindsmeetgame.com/news/official/920appearance.html) and [Korean](https://www.wherewindsmeetgame.com/kr/news/official/920appearance.html) notices, plus fifteen CN appearances from the September 15–17 notices. The Global schedule is 05:00 UTC+8; Korean text says 06:00 without an explicit timezone. Dates passing do not confirm release.

The three original forecast windows and revisions are unchanged. They disappeared because all review deadlines were September 16, not because their windows ended. Roadmap/calendar now show them with a review reminder. New Duskgem sword and Heng blade announcements do not establish the fan’s release order. Official X’s latest posts were inspected, but older posts hit a login wall; this is not an exhaustive social review. See the [review record](../research/2026-09-20-official-announcements.json).


## September 21 forecast re-review

[Current decisions](forecast-review-2026-09-21.md): retained the three original windows with revision 2 and a September 28 review date; added two limited-evidence Duskgem spear/gauntlet candidates; kept thirteen other candidates undated; added five official September 25/27 announcements. Earlier sections describe their historical review, not the latest forecast revision.
