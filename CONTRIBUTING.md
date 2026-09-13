# Contributing to Winds Ahead

[English](CONTRIBUTING.md) · [한국어](CONTRIBUTING.ko.md)

Everyone can contribute. No coding experience is required for a factual correction, translation or source reference. This project does not monetize its service.

## Start here

Use the [issue forms](https://github.com/developdh/Winds-Ahead/issues/new/choose) for bugs, data corrections, missing appearances, source attribution or media removal. For code, fork the repository, branch from `main`, make a focused change and open a pull request against `main`. Discuss substantial design or architecture changes in an issue first.

Write PR titles and descriptions in English; comments and issue reports can be English or Korean. Update paired documentation and user-facing translations together. Chinese source names identify content and are not a third interface language.

## Evidence comes first

Provide a public source URL, source server, cosmetic identity, the relevant excerpt and the date checked. Official CN evidence cannot establish Global availability. Announced, released, awaiting verification and editorial forecast are distinct states. Unknown dates, quantities, time zones and official names stay unknown. Preserve forecast revisions instead of overwriting them.

For images, include an exact source-page match, original URL, server, dimensions, depiction type and reuse terms. Keep source originals outside the repository. Only bounded static WebP derivatives belong in `site/public/media/`; index them in `site/content/media.json`. Do not add autoplay, bulk videos, unverified assets or a license inferred from attribution. Rights holders can request a correction or removal through the content issue form without disclosing private identity documents.

## Develop and verify

Follow the [app guide](site/README.md), then run from `site/`:

```sh
npm run check
npm test
npm run validate:content
npm run build
```

For UI changes, exercise the affected flow in both languages and a narrow mobile viewport. Check keyboard operation, focus restoration, image loading, layout overflow and reduced motion when relevant. Record the actual browser and viewport; do not present emulation as physical-device testing. Avoid unnecessary tests that merely mirror implementation.

Describe the problem, final behavior, evidence, actual checks and remaining limits in the PR. Never include secrets, user data, unredacted logs or private screenshots. Keep code changes and researched content reviewable. Maintainers review changes; merging and production publishing are separate actions and are not automatic.

## Licensing and conduct

Your original code/documentation contributions are offered under the project's MIT license. You must be entitled to submit them. Third-party content retains its own terms; wiki adaptations remain CC BY-NC-SA 3.0 and game artwork is excluded from MIT. See [third-party notices](THIRD_PARTY_NOTICES.md) and [conduct](CODE_OF_CONDUCT.md). Report security vulnerabilities privately through [SECURITY.md](SECURITY.md).
