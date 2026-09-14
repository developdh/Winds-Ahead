# Public source release · September 13, 2026

[한국어](../ko/public-launch.md) · [README](../../README.md)

Winds Ahead is an independent, non-monetized fan project. Anyone may contribute code, translations, accessible design, source-backed information and corrections. The project has no advertising, paid features, affiliate revenue or revenue collection.

## Release scope

- 685 appearance records, 395 linked wiki references and 554 static reference images across 370 records. 315 records still lack a reviewed image. These counts do not establish complete coverage of the game.
- 36 official CN reference photos added for 19 outfits, including the first photos for 12 records. New thumbnails total 1,745,780 bytes; full-size derivatives total 9,886,806 bytes. Original files are not shipped. [Source audit](../research/2026-09-13-photo-expansion.json)
- Another 55 distinct official photos expand 11 existing galleries: Bu Qiu Ting has 6 photos; Fei Rong Qing Xiang, Ru Shi Yuan and Zhen Han Liu have 8; Jin Lv Sheng Lan, Yao Si Han Que and Yin Pu Liu Yun have 10. New thumbnails total 4,701,752 bytes and full derivatives total 22,134,236 bytes, down from 131,401,258 source bytes. [Gallery audit](../research/2026-09-13-gallery-expansion.json)
- Per-image alternative text; concept and dye previews are labeled where applicable. CN imagery does not establish Global availability.
- In-place detail and gallery dialogs, acquisition information, regional release states, official and estimated roadmaps, calendar, saved items and sharing.
- Public contribution guides, correction/removal issue forms, security reporting instructions, a code of conduct, and MIT licensing for original code. Game media, wiki adaptations and other third-party material retain separate rights. [Notices](../../THIRD_PARTY_NOTICES.md)

## Pre-release fixes

Updated React, React Server Components, vinext, Vite and Cloudflare tooling to compatible patched versions. Disabled background route prefetching on links that open an in-place dialog. Added localized canonical/alternate metadata, a sitemap, robots rules and a bilingual error-recovery page. Saved lists are excluded from search indexing.

The relevant upstream advisories include [React Server Components](https://github.com/advisories/GHSA-wx67-qw84-cm4g), [Vite](https://github.com/advisories/GHSA-fx2h-pf6j-xcff), and [image-size](https://github.com/advisories/GHSA-w3rx-r6r6-pgpr). Updating a dependency and passing an audit do not guarantee the absence of vulnerabilities.

## Validation and remaining limits

Type checking, the 32 existing domain/media regression tests and content validation passed after the runtime update. The final release checks are recorded in the release PR. The production dependency audit reports zero known vulnerabilities at this review. Four moderate findings remain in development-only Drizzle Kit tooling; no vulnerable development server is exposed by this application. Avoid forcing the suggested incompatible downgrade.

Gitleaks scanned all 45 commits and found no credential matches. Public DNS verification records and the non-secret Sites project identifier are intentionally retained. Never publish API keys or local environment files.

Controlled browser checks do not establish performance on physical iOS/Android devices or real-user Core Web Vitals. The existing first-load JavaScript target remains a known budget concern; effect videos and full galleries load on demand. Undated releases remain unknown and predictions remain editorial.


Runtime-release checks (before the later photo/social additions): type checking, all 32 tests, content/media validation and the Worker build passed. On the production build, both popup-link canonicals resolved to their localized standalone URLs, robots.txt returned 200, the sitemap returned 1,376 URLs, and an unknown route returned 404. Dialog geometry stayed inside the viewport at 320, 360, 390, 768, 1024 and 1440 CSS px. New gallery photos decoded successfully; language switching preserved the search query. Chromium only; no physical-device or throttled-network certification is claimed.

At that checkpoint, the complete emitted client chunk set was 422,217 gzip bytes (16 chunks), versus 418,797 in the previous build, an increase of 3,420 bytes. This includes deferred chunks and is not an initial-page transfer measurement. The project’s 200KB initial-JavaScript target has not been established by this check.


## Publication state

Repository visibility and website access are independent. Both are now public. The source release was merged through [PR #19](https://github.com/developdh/Winds-Ahead/pull/19), followed by the gallery/social corrections in [PR #20](https://github.com/developdh/Winds-Ahead/pull/20). At the owner’s explicit request, Site access changed from owner-only to public on September 13, 2026 at 23:58:59 UTC (access revision 2). Anyone with the URL can visit without signing in. The community announcement remains an unposted draft for the owner to review and publish manually.

Both custom domains were confirmed active with TLS during domain setup. Canonical links target `https://windsahead.com`; the public-access change does not establish a `www` redirect. [Domain history](custom-domain.md)

Anonymous HTTPS requests without cookies or authorization headers returned 200 for `https://windsahead.com/` and `/ko`, with application HTML instead of a sign-in redirect. The native access update reported `public`; no application rebuild or redeployment was needed for this access-only change.

## Community announcement

[English draft](announcement.md) · [Korean Arca Live draft](../ko/announcement.md). These drafts are not posted automatically.


## Global social corrections

Connected Bane of Life, Entwined Oath and Mist-Veiled Pass to existing CN records; added Little Xiaoba and eight reference images. Combined hair/accessory sets appear in both filters. [Evidence, scope and uncertainties](global-social-audit.md).

Final photo/social build: type checking, all 32 tests, content validation and the Worker build passed. Local production responses returned 200 for both localized Bane of Life popup URLs, robots.txt and the sitemap (1,378 URLs), and 404 for an unknown route. The current 16 emitted client chunks total 439,409 gzip bytes, including deferred chunks; this is not an initial-transfer measurement.

Bane of Life’s added photos decoded and advanced in both desktop English and 390×844 Korean production views. The mobile detail dialog remained within the viewport (top 12px, bottom 844px); a separate desktop full-gallery check reached image 5/5.
