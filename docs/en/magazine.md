# Winds Ahead Magazine

[한국어](../ko/magazine.md) · [Magazine](https://windsahead.com/en/magazine)

The user selected the magazine as a core companion to the archive and roadmap on October 1, 2026. It turns meaningful appearance updates and roadmap explanations into bilingual editorial issues, inviting readers to suggest the next appearance. Issues are published when material is ready; this feature adds no schedule, account system or automatic community posting.

## Reading and sharing

The main navigation now contains Cosmetics, Roadmap and Magazine. `/en/magazine` and `/ko/magazine` list published issues. Stable issue URLs such as `/ko/magazine/issue-01` support language switching, paired metadata and sitemap entries. The web article uses selectable text, an in-page contents list, reference photos and direct archive/roadmap links. It does not require a page-turning viewer.

Each language's community edition contains six numbered, single-column PNGs, 1080 pixels wide, with content-dependent height. Individual downloads and a ZIP bundle are offered below the article. Readability must be checked at mobile display width. A destination platform's compression and upload rules have not been tested. Preserve issue numbers, source and estimate labels when sharing.

Issue 01, **A first look at your next wardrobe**, includes an editor's introduction, Blazing Conquest, the four official October 4 Global announcements, an existing limited-evidence forecast example, the distinction between discount and sale endings, and a reader invitation. Its information date is October 1, 2026; the publication-date timezone is America/New_York. Actual live game availability is not claimed.

## Editorial record and media

`site/content/magazine.json` holds paired writing, issue IDs, publication and information dates, source IDs, corrections and a fixed forecast revision reference. Published issues are snapshots: keep their historical judgment and add corrections with a revision bump instead of silently replacing it with today's forecast. The archive and roadmap provide current information. An issue can group several GitHub releases; software releases and magazine numbering remain separate.

The web edition reuses existing attributed official CN reference images, prioritizing the verified female view of Blazing Conquest and retaining access to the complete artwork. These are not verified live Global screenshots. Redistribution permission remains unknown. The downloadable edition therefore includes only Winds Ahead's original prose and typography/geometry; it contains no game artwork. Attribution does not grant redistribution rights. A photographic community edition needs an established use basis, such as permitted contributor material, before artwork is incorporated.

Reader suggestions can be made in the community post where the issue is shared, or through the existing public GitHub issues link (an account is required). Suggestions inform editorial selection, not a ranking or guaranteed publication. Check consent and permitted uses before publishing contributor images or names.

## Production

1. Select verified material and its source references; keep CN facts, Global facts and estimates separate.
2. Write and review both languages, preserving unknown values, date precision and timezones.
3. Render exports with `site/scripts/render-magazine.mjs`. It requires Playwright and installed Chrome; optionally set `WINDS_BROWSER_MODULES` to an existing runtime module directory. No new application dependency is installed.
4. Build each language's ZIP from its six PNGs. Rebuild the licensed font subsets when new text requires glyphs; retain the OFL notices.
5. Run content validation (including source IDs, preserved forecast snapshots, PNG dimensions/size and ZIP existence), type checks, tests and production build. Verify mobile/desktop reading, navigation, language switching and downloads.
6. Follow [releasing](releasing.md) and the established Sites publication flow. Community posting is a separate, explicitly authorized action.

Issue 01 browser checks and limits are recorded with [v0.3.0](releases/0.3.0.md). No physical-device, platform-upload or new analytics results are claimed.
