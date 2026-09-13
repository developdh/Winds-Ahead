# Winds Ahead · 연운경 (燕雲鏡)

[English](README.md) · [한국어](README.ko.md)

**A bilingual cosmetic archive and release roadmap for Where Winds Meet.**

Find an appearance, see its photos and acquisition requirements, and compare China and Global release records without losing your place. An independent, non-monetized fan project: no advertising, paid features, affiliate links or revenue collection.

[Website](https://windsahead.com) · [Report a bug or correction](https://github.com/developdh/Winds-Ahead/issues/new/choose) · [Contribute](CONTRIBUTING.md)

> The source is public and open to contributions. The hosted site's access setting is separate; the current preview still requires authorized access until its public launch. See [release status](docs/en/public-launch.md).

## Explore

- **Cosmetic archive:** outfits, hair, weapons, effects, accessories and mounts. Search by reviewed English/Korean names, Chinese originals or aliases; filter by server status and sort by regional release date.
- **Stay in place:** image-first detail dialogs, large galleries with previous/next controls, prices, currencies, acquisition locations, sources and wiki composition notes.
- **Release roadmap:** official announcements and editorial estimates use different labels and colors. Switch between a timeline and a responsive monthly calendar. Unknown dates stay unknown.
- **Save and share:** browser-local watchlists, links to individual cosmetics and a remembered language choice. Effect videos load only after pressing play.

The archive currently holds **684 appearance records** and **395 wiki references**, with **546 photos across 368 appearances**. These are documented records, not a guarantee that every in-game appearance or regional identity is resolved. Some images, official translations and release dates are still missing. Forecasts are explicitly unofficial and may change.

## Run locally

Requires **Node.js 22.13+** and npm. No API key or cloud account is required for local browsing.

```sh
git clone https://github.com/developdh/Winds-Ahead.git
cd Winds-Ahead/site
npm ci
npm run dev
```

Open the URL printed by the server. `/ko` and `/en` are the two language routes; `/?welcome=1` replays the language entrance. To try the production output locally:

```sh
npm run build
npm start
```

The implementation uses React, TypeScript, Next.js APIs through vinext/Vite, Tailwind CSS and Cloudflare Workers. The committed Sites project ID identifies this deployment and grants no access; use your own hosting configuration for a separate deployment. See the [application guide](site/README.md).

## Contribute

Everyone is welcome: correct names or release information, add source-backed records, help translate, improve accessibility or submit code. Start with an [issue](https://github.com/developdh/Winds-Ahead/issues/new/choose) or a fork and pull request. PR titles and descriptions use English; the app and documentation support English and Korean. Keep previous forecast revisions and link original evidence.

```sh
# From site/
npm run check
npm test
npm run validate:content
npm run build
```

See [Contributing](CONTRIBUTING.md), [Security](SECURITY.md) and the [Code of conduct](CODE_OF_CONDUCT.md). Never include credentials, account details, private screenshots or copyrighted material without a documented reuse basis.

## Project map

| Path | Purpose |
| --- | --- |
| `site/app/`, `site/components/` | Routes and interface |
| `site/content/` | Regional records, original sources, media index, bilingual copy and forecast revisions |
| `site/public/data/wiki/` | Per-cosmetic attributed composition references, loaded on demand |
| `site/scripts/`, `site/tests/` | Import, content checks and regression tests |
| `docs/en/`, `docs/ko/` | Paired product, maintenance and release documentation |
| `docs/research/` | Source snapshots and reviewed corrections |

[Content guide](docs/en/content-model.md) · [Design principles](docs/en/design-quality.md) · [Calendar maintenance](docs/en/calendar-automation.md) · [Release review](docs/en/public-launch.md)

## License and attribution

Original application code and project-authored documentation are available under the [MIT License](LICENSE). **Game artwork, videos, trademarks, source excerpts, wiki adaptations, fonts and vendored code are not relicensed by that license.** Wiki-derived material retains CC BY-NC-SA 3.0; fonts and dependencies retain their own notices. Media provenance records include unresolved reuse permissions rather than invented clearance.

Read [third-party notices](THIRD_PARTY_NOTICES.md) before reusing content. The project itself does not monetize; that operating policy does not add restrictions to the MIT code license. Winds Ahead is not affiliated with or endorsed by NetEase or Everstone Studio.
