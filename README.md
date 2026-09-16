# Winds Ahead · 연운경 (燕雲鏡)

**[English](README.md) · [한국어](README.ko.md)**

A bilingual **Where Winds Meet cosmetic archive and release roadmap**. Browse photos, compare China and Global releases, and find acquisition details without losing your place.

## [Open Winds Ahead → windsahead.com](https://windsahead.com)

**[Cosmetic archive](https://windsahead.com/en) · [Release roadmap](https://windsahead.com/en/calendar) · [한국어 사이트](https://windsahead.com/ko)**

Free to browse. No sign-in required. Available on desktop and mobile.

### [Latest release](https://github.com/developdh/Winds-Ahead/releases/latest) · [Release history](https://github.com/developdh/Winds-Ahead/releases)

### [Contribute](CONTRIBUTING.md) · [Report a bug or correction](https://github.com/developdh/Winds-Ahead/issues/new/choose)

---

## Explore the archive

- **Find an appearance.** Search English/Korean names, Chinese originals and aliases. Filter outfits, hair, weapons, effects, accessories and mounts; combine acquisition-source filters (Shop, Battle Pass, draws and more) with regional release sorting.
- **Compare without leaving the list.** Open details in a popup, browse large photos, and check currencies, amounts, acquisition locations and outfit components.
- **See what is coming.** Official announcements and editorial forecasts have distinct labels. Explore a roadmap or monthly calendar; unknown dates stay unknown.
- **Save and share.** Keep a browser-local watchlist and share individual cosmetics by link. Your language choice is remembered. Effect videos load when you press play.

**686 appearance records · 557 photos across 371 appearances · 395 wiki references**

The archive is still growing. Some images, official translations and release dates are missing; these counts do not establish complete in-game coverage. Forecasts are unofficial and may change.

## What matters to us

**Trustworthy information.** China and Global facts remain separate from each other and from editorial forecasts. Original sources and unresolved details stay visible.

**Rich information, simple use.** Clear photos, readable details and fewer page changes help people compare appearances. Mobile usability and loading speed remain priorities.

**Open participation.** Anyone can inspect the source, suggest a correction or contribute. This independent fan project has no advertising, paid features, affiliate links or revenue collection.

## Help improve Winds Ahead

Source links, missing appearances, translations, name or price corrections, accessibility improvements and code contributions are all welcome.

Start with the **[contribution guide](CONTRIBUTING.md)** or **[open an issue](https://github.com/developdh/Winds-Ahead/issues/new/choose)**. PR titles and descriptions use English; the app and documentation support English and Korean. Preserve forecast history and link original evidence.

[Security reporting](SECURITY.md) · [Code of conduct](CODE_OF_CONDUCT.md) · [Latest release review](docs/en/public-launch.md)

## For developers

<details>
<summary><strong>Local setup and validation</strong></summary>

Requires **Node.js 22.13+** and npm. No API key or cloud account is needed for local browsing.

```sh
git clone https://github.com/developdh/Winds-Ahead.git
cd Winds-Ahead/site
npm ci
npm run dev
```

Open the server's printed URL. `/en` and `/ko` are the language routes; `/?welcome=1` replays the language entrance.

```sh
# From site/
npm run check
npm test
npm run validate:content
npm run build
npm start
```

The app uses React, TypeScript, Next.js APIs through vinext/Vite, Tailwind CSS and Cloudflare Workers. The committed Sites project ID identifies this deployment and grants no access. Use your own hosting configuration for a separate deployment. See the [application guide](site/README.md).

Never commit credentials, account details, private screenshots or copyrighted material without a documented reuse basis.

</details>

<details>
<summary><strong>Project structure and maintenance guides</strong></summary>

| Path | Purpose |
| --- | --- |
| `site/app/`, `site/components/` | Routes and interface |
| `site/content/` | Regional records, sources, media index, bilingual copy and forecast history |
| `site/public/data/wiki/` | Attributed composition references, loaded on demand |
| `site/scripts/`, `site/tests/` | Import, content checks and regression tests |
| `docs/en/`, `docs/ko/` | Paired product, maintenance and release documentation |
| `docs/research/` | Source snapshots and reviewed corrections |

[Acquisition filters](docs/en/acquisition-filter.md) · [Content guide](docs/en/content-model.md) · [Design principles](docs/en/design-quality.md) · [Calendar maintenance](docs/en/calendar-automation.md) · [Publishing releases](docs/en/releasing.md)

</details>

## License and attribution

Original application code and project-authored documentation use the **[MIT License](LICENSE)**. Game artwork, videos, trademarks, source excerpts, wiki adaptations, fonts and vendored code retain separate rights. Wiki-derived material retains CC BY-NC-SA 3.0; fonts and dependencies retain their notices. Unresolved media reuse permissions are recorded honestly.

Read **[third-party notices](THIRD_PARTY_NOTICES.md)** before reusing content. The project's non-monetization policy adds no restrictions to the MIT code license. Winds Ahead is not affiliated with or endorsed by NetEase or Everstone Studio.
