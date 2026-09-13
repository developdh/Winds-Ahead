# Winds Ahead · 연운경 (燕雲鏡)

[English](README.md) · [한국어](README.ko.md)

An independent **Where Winds Meet** cosmetic archive. Browse real CN appearances, inspect acquisition details, and distinguish global facts from editorial estimates.

**MVP:** An English/Korean web app with a first-visit language choice, image galleries, search, a small browser watchlist, and a responsive release calendar. The interface centers on two destinations: **Cosmetics** and **Calendar**. Dark, image-led design uses light Gowun Dodum text; the entrance retains Noto Serif KR for its wuxia identity.

[Open the owner-private MVP](https://winds-ahead.donghee0815.chatgpt.site) · Published September 13, 2026 UTC.

The archive contains **18 cosmetics across three official CN announcements**, including one martial-art effect with click-to-load playback. Sixteen have day-level CN dates (five based on explicit relative update wording); two retain unknown dates. No verified global event or editorial forecast has been published. Empty schedules are intentional, not fabricated.

Source and previews remain private. Media provenance is recorded, but redistribution permission is unknown; public launch still requires a media review and a real public correction channel.

## Run locally

Use Node 22.13 or newer, then in `site/`:

```sh
npm ci
npm run dev
```

Open the displayed local URL. `/?welcome=1` previews the entrance again. Language is remembered in browser storage and a one-year first-party cookie; clearing site data resets it. Explicit `/en` and `/ko` links retain their language, and switching language updates the preference.

Validation: `npm run check`, `npm test`, `npm run validate:content`, `npm run build`. See the MVP report for actual coverage and limits.

## Documentation

| Document | English | 한국어 |
| --- | --- | --- |
| Prices and acquisition | [Acquisition details](docs/en/acquisition-details.md) | [재화와 획득 정보](docs/ko/acquisition-details.md) |
| September intake and playback | [Content expansion](docs/en/content-expansion.md) | [정보 수집과 재생](docs/ko/content-expansion.md) |
| MVP and operation | [MVP status](docs/en/mvp-status.md) | [MVP 현황](docs/ko/mvp-status.md) |
| Product | [Product plan](docs/en/product-plan.md) | [제품 기획](docs/ko/product-plan.md) |
| Content | [Content model](docs/en/content-model.md) | [콘텐츠 모델](docs/ko/content-model.md) |
| Delivery | [Delivery plan](docs/en/delivery-plan.md) | [개발 계획](docs/ko/delivery-plan.md) |
| AI review | [Calendar automation](docs/en/calendar-automation.md) | [캘린더 AI 갱신](docs/ko/calendar-automation.md) |
| Design | [Design quality](docs/en/design-quality.md) | [디자인 기준](docs/ko/design-quality.md) |
| Sources | [Bilingual source register](docs/research-sources.md) | [공통 출처 목록](docs/research-sources.md) |

[GitHub repository](https://github.com/developdh/Winds-Ahead) · [Contribution rules](CONTRIBUTING.md)

PRs and commit messages use English. Site copy and project documentation are maintained in both languages. The site is unaffiliated with the publisher; third-party media and trademarks retain their owners.
