# Winds Ahead product plan v0.2

[한국어](../ko/product-plan.md) · [Document index](../../README.md)

Prepared: 2026-09-12 (America/New_York). Stage: planning draft. This is a proposed scope, not a set of actual game-release predictions.

## 1. Product definition

**Winds Ahead / 연운경 (燕雲鏡)** is a fan catalog helping global-server players explore cosmetics announced or released in China and understand their global release status and possible timing.

The three primary visitor tasks are:

1. Find an appearance seen on the China server and inspect its photos, videos, and acquisition method.
2. Determine whether its global release is confirmed and understand the evidence behind any estimate.
3. Save desired cosmetics and check schedule changes on a later visit.

Focus on cosmetics and their schedules rather than general game guides or all game news. The initial editorial workflow must be manageable by one operator.

## 2. Initial release scope

| Priority | Capability | Visitor value |
| --- | --- | --- |
| P0 | Cosmetic catalog | Primary image, name, category, and CN/Global status at a glance |
| P0 | Search and filters | Korean, English, original Chinese names and aliases; category, acquisition method, and global status |
| P0 | Cosmetic detail | Photos, videos, body variants, included pieces, region-specific release/acquisition information, sources |
| P0 | Roadmap calendar | Month and list views separating official schedules from estimated windows |
| P0 | Evidence information | Sources, last verification, reasons for revisions, official versus provisional names |
| P0 | English and Korean | Interface, content descriptions, search, dates, errors, and empty states |
| P0 | Watchlist | Save on this device without signing in and view saved cosmetics |
| P0 | Editing and corrections | Maintainer publishing workflow and a visitor route for reporting errors |
| P1 | Calendar export | Start with confirmed-event ICS downloads; estimates require a separate choice |
| P1 | Cosmetic comparison | Compare two appearances, included pieces, and acquisition methods |
| P1 | Simple editorial interface | Introduce a CMS when publishing volume justifies replacing GitHub editing |
| P2 | Accounts and notifications | Cross-device watchlists and opt-in change notifications |

The initial catalog centers on outfit sets and includes hair, weapons, and accessories. The model can accommodate additional categories without requiring exhaustive coverage at launch. Aim for 20–30 verified representative records; never publish incomplete facts merely to reach the target.

Comments, community forums, public file uploads, spending expectation calculators, private leaks, and game-account integration are outside the initial scope. Start content editing with the user's selected GitHub workflow. Following their additional choice, daily research checks in this task are scheduled and will extend to calendar maintenance once real catalog data exists. A separate GPT API, administrator CMS, and visitor notifications are not currently activated. [Operating model](calendar-automation.md)

## 3. Site structure

`{locale}` is `ko` or `en`. `/` resolves language by saved preference, browser language, then English. Direct visits to a localized URL retain that language.

| Route | Screen | Main action |
| --- | --- | --- |
| `/{locale}` | Explore home and catalog | Default to released-in-CN, unannounced-for-Global cosmetics; allow all statuses |
| `/{locale}/cosmetics/{id}` | Cosmetic detail | Gallery, facts by region, schedule evidence, watchlist action |
| `/{locale}/calendar` | Roadmap | Month/list switch, official/estimated schedules, unscheduled items |
| `/{locale}/watchlist` | Watchlist | Saved items on this device and their current status |
| `/{locale}/updates` | Updates | New records, official announcements, revised/withdrawn forecasts, corrections |
| `/{locale}/about` | About | Verification process, forecast rules, source/media policy, correction route |

Store filters and sorting in the URL for sharing and browser navigation. Stable detail IDs survive translated-name changes. An item whose global status has not been researched must not immediately be categorized as unannounced.

## 4. Main screens

### Explore home

Open with search and real cosmetic cards. Use 3–4 columns on desktop and 1–2 on mobile as space allows.

```text
Winds Ahead   Catalog  Roadmap  Watchlist  Updates             EN | 한국어
Search cosmetics [ Name / original name / alias                         ]
[Category] [Acquisition] [Global status] [Sort]                 N results
┌ Primary image ┐ ┌ Primary image ┐ ┌ Primary image ┐
│ Name          │ │ Name          │ │ Name          │
│ Released CN   │ │ Confirmed GL  │ │ Est. window    │
│ Method     ♡  │ │ Date       ♡  │ │ Evidence    ♡  │
└───────────────┘ └───────────────┘ └───────────────┘
```

Essential card information is the localized name, access to the original name, category, global status, appropriately precise schedule when available, and watchlist action. Avoid excessive badges and long descriptions. The diagram contains no real cosmetics or dates.

### Cosmetic detail

- First section: primary image/gallery, name, regional status, and watchlist action.
- Media: enlargement, front/back/detail views, body variants, and video. Mark unavailable views as unavailable.
- Composition: link outfit, hair, and accessories separately and state what is included in a set.
- Comparison: separate CN and Global columns for release date, acquisition method, price/currency, and sale window; stack on mobile.
- Schedule: official announcement or estimated window, evidence strength, reasoning, verification date, and revisions.
- Footer: sources, capture region/version, contributor attribution, and correction action.

Label China-server footage above the player as `CN footage / CN 서버 영상`. Identify dyed, altered, and promotional material. Load video on interaction without autoplay. Provide the original source link when embedded playback is unavailable.

### Roadmap calendar

- Default to month view on desktop and list view on mobile. Both read the same records.
- Distinguish official dates with solid styling and estimates with dashed/patterned styling plus text; never rely on color alone.
- Month-level estimates appear in a separate monthly forecast area; version-level estimates appear in version groups. Neither becomes an arbitrary day.
- Keep cosmetics without sufficient scheduling evidence in an Unscheduled section.
- Distinguish first release, rerun, and sale ending. CN historical schedules have a separate filter.
- Allow inspection of the selected display timezone and the source's original timezone. Language never implicitly selects a server or timezone.
- If an estimate expires without confirmation, show “Estimate window passed · Under review.” Do not automatically mark it released or move it to next month.

### Watchlist and updates

Use device-local storage without an account. Explain unavailable storage while keeping browsing functional. Do not promise real-time or email notifications at launch. Updates are site-wide records; per-user read tracking is a later capability.

## 5. Facts and forecasts

| Label | Meaning |
| --- | --- |
| Released in CN / 중국 출시 | Evidence supports a China-server release |
| Not announced for Global / 글로벌 미발표 | No matching announcement found in reviewed official global sources as of verification |
| Confirmed for Global / 글로벌 출시 확정 | An official global announcement exists; its date can still be unspecified |
| Released in Global / 글로벌 출시됨 | A global release is verified; this does not mean it is currently obtainable |
| Estimated / 예상 | Editorial judgment stored separately from official facts |
| Unscheduled / 일정 미정 | Insufficient evidence for a date window |

Release status, current availability, and presence of a forecast are separate values. An item can have a global release history while its sale has ended. Describe forecast evidence as Supported / 근거 충분 or Limited / 근거 제한적; avoid percentages that imply calibrated probabilities. See the [content model](content-model.md) for the full rules.

## 6. Languages and naming

- Use `Winds Ahead` as the English display name and `연운경` in Korean. Include `燕雲鏡` and the alternate name in the introduction/footer.
- Separate interface strings from editorial translations; maintain both languages in each content change.
- Distinguish original Chinese names, verified official English/Korean global names, editorial translations, and search aliases.
- Label nonofficial names “Provisional translation / 임시 번역.” When no translation exists, show the Chinese name with a localized translation-pending notice.
- Keep factual values such as region, status, dates, and prices in shared data so locales cannot disagree.
- Preserve the current item, month, and filters when switching language. Chinese is source data, not a third interface locale.

## 7. Visual direction

**User-confirmed priority:** Allocate sufficient time to design, UI/UX, responsive behavior, and speed even when development takes longer. A core screen is complete only after design, interaction, mobile usability, and performance checks. [Detailed quality criteria](design-quality.md)

Proposed direction: **a contemporary wuxia catalog with authentic cosmetic imagery against a dark ink surface**. Suggested palette: deep navy `#101820`, light text `#F1F5F9`, jade accent `#67D8C5`, and amber estimate accent `#F5BE63`. Reserve circular mirror motifs and serif type for small headings and divisions; use readable sans-serif type for regular controls.

Real game imagery carries the design; generated artwork must not substitute for actual cosmetics. Use body text of at least 16px, common labels of at least 14px, adequate contrast, keyboard operation, focus restoration after gallery dialogs, and reduced motion. Avoid artificial Korean letter spacing and compulsory horizontal scrolling for the mobile calendar.

## 8. Success criteria and next step

Initial usability checks ask whether visitors can find a name, inspect a video, distinguish confirmation from estimation, and save an item without explanation. Content-quality targets: sources and verification dates on 100% of published records; reasoning and revisions on 100% of forecasts; zero missing core screens across Korean and English.

Next: verify representative cosmetic material and develop explore/detail/calendar wireframes. Implementation and deployment are outside this planning deliverable. See the [delivery plan](delivery-plan.md) for completion criteria and the [source register](../research-sources.md) for research evidence.
