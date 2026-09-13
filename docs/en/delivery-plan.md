# Delivery and operations plan v0.2

[한국어](../ko/delivery-plan.md) · [Product plan](product-plan.md)

**Implementation update · September 13, 2026:** The owner-private MVP is implemented. The simplified interface and exact content paths are recorded in [MVP status](mvp-status.md), which supersedes unimplemented screen and data proposals below. Global forecasting accuracy is not validated.

## 1. Current stage and decision status

The current deliverable is the bilingual owner-private MVP, its verified CN seed, and reviewable GitHub milestones. Deployment status is tracked in the MVP report.

| Status | Decision |
| --- | --- |
| User requirement | Winds Ahead / 연운경 (燕雲鏡); CN-based cosmetic information, photos/videos, and estimated global calendar |
| User requirement | English/Korean site and documentation; English PRs; GitHub updates during the project |
| User decision | Start a new private GitHub repository |
| User decision | GitHub content management; recurring checks in this task for initial AI updates |
| User decision | Prioritize design, UI/UX, responsive behavior, and speed over a shorter development schedule |
| Proposed defaults | Exploration-first home, account-free watchlist, manually verified content, ink/jade visual direction |
| Verify before implementation | Representative media and usage basis, real regional date/name matching, hosting execution path |
| Decide before public launch | Domain, editorial contact/public reporting route, publication scope, analytics if needed |

Do not block earlier work on undecided choices unrelated to it. Present concrete options and conditions when an actual expense or external communication becomes necessary.

## 2. Proposed technical direction

Start with **React/TypeScript pages and structured content maintained in the repository**. Separate cosmetic IDs, media references, regional records, and translations, with schema validation before deployment. Pre-render reading-focused pages where possible and add the interactions needed for filters, calendar, and watchlist.

At implementation time, verify the supported Sites starter and hosting compatibility before selecting the specific framework and version. This planning phase does not install an application, register hosting, or purchase services. The requested GitHub repository remains the source of truth; if hosting later needs a separate repository, document that deployment connection.

Use permitted external players or image storage/CDN for media files; keep metadata and small code assets in Git. Start with the selected GitHub editing workflow; reader accounts, an operational database, and separate administrator authentication are not initial requirements. A CMS remains an option if the operating model is revisited later. AI reasoning runs outside visitor requests. [Recurring checks and calendar updates](calendar-automation.md)

## 3. Milestones and completion criteria

These milestones establish order and scope, not committed calendar dates or development durations.

Add designs and a clickable prototype of the three core screens with representative material to M1. Verify responsive behavior, accessibility, and speed during M2/M3 implementation. Make necessary design and performance improvements within those stages to meet the user's quality priority; use M4 for integrated journeys. [Completion evidence and performance targets](design-quality.md)

| Stage | Deliverable | Completion criteria | Example English PR title |
| --- | --- | --- | --- |
| M0 · Planning | Bilingual PRD, content policy, source register, contribution rules | Matching language scope, research separated from proposals, reviewable repository changes | `docs: define bilingual product and editorial plan` |
| M1 · Data and screen validation | 5–8 representative draft records, official-name matching, explore/detail/calendar wireframes | Sources and media use verified; screen rules for confirmation, estimates, unknown timing, and reruns | `feat: establish cosmetic data and core page layouts` |
| M2 · Catalog | EN/KO routes, search/filters, detail gallery, evidence | Browse and play representative material on mobile/desktop; preserve shared filters and language context | `feat: add bilingual cosmetic catalog and media details` |
| M3 · Schedule and watchlist | Calendar, unscheduled items, watchlist, revisions | Date precision/timezones/expired forecasts; browsing works with blocked storage | `feat: add release calendar and local watchlist` |
| M4 · Launch preparation | Expanded seed content, correction route, accessibility/performance checks, preview/deployment | Core journeys pass, public data quality met, real contact route and deployment recovery available | `feat: prepare Winds Ahead for initial release` |
| M5 · Operational improvements | ICS, comparison, CMS/accounts/notifications if justified | Select individual scope from actual usage and editorial workload | Feature-specific PRs |

If M1 lacks evidence for real forecasts, isolate synthetic cases as **test/wireframe-only** and exclude them from public content. Never distort launch content to manufacture predictions.

## 4. Initial public-release criteria

- Visitors can open a cosmetic and inspect images, videos, sources, and CN/Global status.
- Representative name/alias searches in three languages resolve to the same cosmetic. Filters and result counts work in both UI locales.
- Missing translations show original names and a pending notice; official names remain distinguishable from provisional translations.
- Dates, release status, and acquisition claims have evidence and verification dates on every published record.
- Official events and estimates remain distinct across detail, calendar, and revision history. Insufficient evidence produces Unscheduled.
- Verify representative outfits, hair, weapons, accessories, and several acquisition methods. Quality takes priority over the 20–30 record target.
- Core flows work at 360px mobile, tablet, and desktop widths, with keyboard use and 200% enlargement.
- Provide real alternatives or guidance for unavailable video, missing images, empty search, removed records, and blocked storage.
- Validate localized titles, descriptions, canonical/hreflang metadata, and sitemaps to disambiguate translated URLs.
- About identifies the independent fan project and provides media attribution and working correction/removal routes.
- Core screens have bilingual mobile/desktop visual review and performance measurements under slower conditions. Document conditions and distinguish availability of actual field data.

## 5. Validation plan

During planning, check document links, bilingual scope, and consistent terminology. Do not add application tests before an application exists.

During implementation, automate checks for date conversion, forecast intervals, status transitions, translation omissions, and evidence references where mistakes distort information. Browser checks focus on search → detail → save, preserving context across language switches, and understanding confirmed/estimated/unscheduled states. Avoid redundant tests for every string or simple styling choice.

Seed-content validation checks duplicate IDs, missing references, required translations, unsupported dates/prices, unusable media, and accidental publication of editorial drafts. Measure performance after connecting representative images and video providers.

## 6. GitHub workflow

- Repository: private [developdh/Winds-Ahead](https://github.com/developdh/Winds-Ahead), created under the authenticated account with its connection verified.
- Treat `main` as the integration baseline. Use `docs/...`, `feat/...`, `fix/...`, and `content/...` branches with meaningful commits.
- Default PR titles, descriptions, and commit messages to English. Explain the reason, resulting behavior, validation, and remaining limits.
- Changes to site content or documentation meaning update Korean and English together. Facts have a shared canonical source.
- Share the initial plan in a draft PR; attach validation evidence to completed implementation. This rule does not enable automatic merging.
- Push/update PRs at meaningful points such as planning completion, core screens, schedule functionality, and launch readiness rather than every local edit.
- Use `content:` commits to trace sources and reasons for editorial updates. Keep code and third-party media ownership separate; do not include external media in the project's code license.
- Preserve local work during authentication/network problems and report actual remote synchronization status. Never commit or print secrets.

## 7. Implementation sequence

Select representative cosmetics and sources, then make the three core screens concrete. Establish data validation and bilingual structure, followed by the catalog, calendar/watchlist, and launch preparation. Decide deployment and account/notification expansion according to the actual requirements of those stages.
