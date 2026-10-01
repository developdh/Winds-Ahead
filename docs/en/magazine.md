# Winds Ahead Magazine

[한국어](../ko/magazine.md) · [Magazine](https://windsahead.com/en/magazine)

The user selected the magazine as a core companion to the archive and roadmap on October 1, 2026. It collects verified appearance announcements and existing roadmap estimates in bilingual photo issues with information-focused copy. Issues are published when material is ready; this feature adds no schedule, account system or automatic community posting.

## Reading and sharing

The main navigation now contains Cosmetics, Roadmap and Magazine. `/en/magazine` and `/ko/magazine` list published issues. Stable issue URLs such as `/ko/magazine/issue-01` support language switching, paired metadata and sitemap entries. The web article uses selectable text, an in-page contents list, reference photos and direct archive/roadmap links. It does not require a page-turning viewer.

Edition 4 contains seven numbered JPGs per language, 1080px wide with content-dependent height. The cover, four official appearance pages and one forecast page retain fashion-magazine photography and typography while limiting copy to names, schedules, acquisition, costs, included pieces and evidence labels. A final page briefly introduces Winds Ahead, its archive/roadmap/magazine and website address. Individual downloads and a ZIP bundle are offered below the article. Readability must be checked at mobile display width. A destination platform's compression and upload rules have not been tested. Preserve issue numbers, source and estimate labels when sharing.

Issue 01, **October appearance update**, covers the four official October 4 Global appearances, their acquisition and costs, Bloom Night's discount end and existing Lian Tai He forecast revision 3. Information date: October 1, 2026. Publication-date timezone: America/New_York. Live availability is not claimed.

## Editorial record and media

`site/content/magazine.json` holds paired writing, issue IDs, publication and information dates, source IDs, corrections and a fixed forecast revision reference. Published issues are snapshots: keep their historical judgment and add corrections with a revision bump instead of silently replacing it with today's forecast. The archive and roadmap provide current information. An issue can group several GitHub releases; software releases and magazine numbering remain separate.

The web and community editions reuse existing attributed official CN reference images, prioritizing verified female views for Blazing Conquest and Lian Tai He. Complete originals remain accessible through the archive. These are not verified live Global screenshots. The user requested the photographic community edition; source paths, original URLs and unknown permission status are recorded in `site/content/magazine-export-metrics.json`. Photo rights stay with their owners; attribution is not redistribution permission. Artwork remains outside the code license. The first typography-only edition stays at its original file paths as a historical artifact.

Information pages omit editor letters, subjective appearance descriptions and participation prompts. The user requested a short, factual brand introduction on the last page. Keep the photo-led style, but make captions factual. Earlier editions remain preserved at their original download paths.

## Production

1. Select verified material and its source references; keep CN facts, Global facts and estimates separate.
2. Write and review both languages, preserving unknown values, date precision and timezones.
3. Render exports with `site/scripts/render-magazine.mjs`. It requires Playwright and installed Chrome; optionally set `WINDS_BROWSER_MODULES` to an existing runtime module directory. No new application dependency is installed.
4. Build each language's ZIP from its seven JPGs. Rebuild the licensed font subsets when new text requires glyphs; retain the OFL notices.
5. Run content validation (including source IDs, preserved forecast snapshots, JPG/WebP dimensions, size and photo references and ZIP existence), type checks, tests and production build. Verify mobile/desktop reading, navigation, language switching and downloads.
6. Follow [releasing](releasing.md) and the established Sites publication flow. Community posting is a separate, explicitly authorized action.

Edition 4 browser checks and limits are recorded with [v0.3.3](releases/0.3.3.md). The website loads small, lazy WebP previews rather than full export files; dimensions are reserved before loading. No physical-device, platform-upload or new analytics results are claimed.
