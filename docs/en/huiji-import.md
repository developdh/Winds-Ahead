# Huiji appearance reference integration

[한국어](../ko/huiji-import.md) · [Source snapshot and license](../research/huiji/README.md)

## Scope · 2026-09-13

Added **139** community-documented appearances: the archive now contains **684 records**. Connected **395 wiki references**: 219 sets, 125 weapons, 30 martial-art effects and 21 mounts. **383 articles** have content; **12** are unwritten red links. The separate single-piece menu returned an empty table, including after selecting Hair. This is not a game-wide completeness claim.

Set details expose **898 component rows**, bilingual slot labels, available component-page links, grade, dyeing/tailoring/gifting/trading flags, style points, collection rewards and results-animation information. Weapon type, affected martial art, replaced move, mount type, wiki acquisition and timing notes appear when provided. Empty template rows are excluded. Untranslated proper names retain Chinese identifiers in Korean and provisional readings in English.

## Evidence and identity

- Wiki data is attributed to **燕云十六声中文维基 contributors**, adapted under **CC BY-NC-SA 3.0**, and linked to source articles and observed revisions. No wiki image files were copied. This license applies to wiki-derived data, not NetEase artwork or the entire project.
- Wiki-only records keep official release dates, global names and verified prices unknown. Wiki timing notes never create calendar events. Original strings and unknown time zones are retained.
- Ten series-prefixed weapons match existing official records by base name and weapon type; Fushen collaboration wording appears in their CN sources. See `docs/research/huiji/identity-map.json`. The same-named **霜寒天泉 set and hairstyle** remain separate categories.
- **风华值 is a collection score, not money.** The 100 Echo Jade completion reward is earned, not paid. Unstated flags stay null. Component totals are not forced to equal set totals.
- Six weapon acquisitions were corrected using official notices to the historical limited price of **2 Sound Jade**. Five had incorrectly inherited “free” from a separate sharing reward; one was unknown. Before/after values and source links are retained in `acquisition-corrections.json`. Official release dates were not changed.

## Operation and validation

`site/scripts/import-huiji.py` transforms the reviewed snapshots without network calls. ICU `uconv` supplies provisional readings. Explicit identity mappings and category checks prevent duplicate weapons and set/hair confusion. Its output is one small static JSON document per cosmetic in `site/public/data/wiki/`. The detail component and selected document load on demand; the catalog does not fetch the wiki corpus. Existing images and click-to-play videos are unchanged.

Type checking, content validation and **24 tests pass**. Checks cover attribution, document identity, category matching, unknown flags, missing articles, price/reward separation and official regional evidence. Viewports **320, 360, 390, 768, 1024 and 1440 px** have no horizontal overflow; component links retain 44 px targets. Korean mobile composition and English desktop detail were inspected in the in-app Chromium browser. Physical phones, Firefox, WebKit, 200% text enlargement and real-user performance were not tested in this change.

Final build measurements are recorded below. The initial 200 KB JavaScript target is still unproven; loading wiki data on demand does not establish site-wide performance compliance.

## Final build measurements

Build passed. All emitted client JavaScript, including lazy chunks, totals **388,229 bytes gzip** (previous milestone: 368,241). The catalog chunk is 168,977 bytes gzip. The 395 wiki JSON files total 691,534 bytes but load individually: median **1,564 bytes**, maximum **3,928 bytes**, uncompressed. Two subset fonts total 334,876 bytes. These are artifact sizes, not real-user transfer or responsiveness measurements.
