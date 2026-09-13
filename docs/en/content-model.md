# Content, data, and forecasting policy v0.1

[한국어](../ko/content-model.md) · [Product plan](product-plan.md)

This is a proposed implementation model. No production catalog or validated prediction model exists yet.

## 1. Data structure

A cosmetic retains one stable ID across translated-name changes. Do not merge CN and Global items by name alone. Represent outfit/hair/weapon components, body variants, and dye variations explicitly.

| Entity | Main information | Relationships and constraints |
| --- | --- | --- |
| Cosmetic | ID, category, original Chinese name, tags, component IDs | Separate individual items from set membership |
| Localization | Cosmetic ID, locale, display name, description, aliases, translation status, name source | `official`, `provisional`, `missing`; preserve original Chinese separately |
| Variant | Cosmetic ID, body variant, style, dyed state | Publish verified variants only; unknown support remains null |
| RegionalRecord | Cosmetic ID, CN/Global, applicable regions/platforms, version, release status, availability | Locale is independent of server; connect evidence to each status |
| Acquisition | Regional record ID, method, amount, currency, conditions, start/end, sources | Never automatically copy CN values into Global |
| ReleaseEvent | Event ID, regional record ID, first release/rerun/ending, date/window, precision, sources | Multiple events preserve sale and rerun history |
| Forecast | Cosmetic ID, Global scope, window/version, evidence strength, rationale, assumptions, creation/review/due dates, status | Store separately from official ReleaseEvent facts |
| Source | URL, publisher, evidence tier, language, server, original publication date, verification timestamp, inspection scope | Separate the source's claim from editorial interpretation |
| Evidence | Target entity/field, source ID, page location/video timestamp, reviewer | State which source supports which value |
| Media | Cosmetic/variant ID, image/video type, URL/file reference, source, contributor, server/version, reuse basis, bilingual alt text | Distinguish displayable assets from source-link-only material |
| Revision | Target ID, before/after, reason, evidence IDs, editor, timestamp | Preserve corrections, withdrawals, and official supersession |

Minimum publication information: stable ID, original Chinese or verified official name, category, bilingual descriptions/name statuses, regional verification scope, sources, verification date, and usable primary media. Records awaiting media permission or content verification remain editorial drafts. Unknown detail values remain null and display as unverified rather than zero, free, or unsupported.

## 2. Regional status and scope

- Editorial-only `not_reviewed`: global research has not happened. Do not publish it as unannounced for Global.
- Public release states: `unannounced`, `announced`, `released`. An unannounced claim is limited to sources reviewed as of its verification date.
- Separate availability: `unknown`, `upcoming`, `available`, `ended`. An old sale announcement does not establish present availability without verification.
- Preserve cancelled or suspended schedules as event states with explanations. Do not claim an item will never reach Global without official evidence.
- Record applicable regions/platforms for each global announcement. Korean language does not imply a separate Korean server. Disclose unverified applicability.

## 3. Dates and time

- Store publication date, in-game start, sale ending, and verification date separately.
- Date precision: `instant`, `day`, `window`, `month`, `version`, `unknown`.
- For timed schedules, preserve the source timezone/offset and original wording; store verified instants in UTC and convert for the selected display timezone.
- Never invent UTC+8 when the source timezone is unclear. Date-only announcements remain dates, not midnight-UTC instants.
- Preserve inclusive/exclusive boundaries and conditions such as “after maintenance.” Do not confuse source date ranges with implementation half-open intervals.
- Never convert forecast months or versions to a first/last day just to fit a date input. Draw only the actual supported interval.

## 4. Evidence tiers and verification

| Tier | Material | What it can support |
| --- | --- | --- |
| A | Official websites, announcements, and accounts linked from official channels | Facts within the stated server, region, and version |
| B | Direct gameplay records with capture region/date, permitted creator material | Visible appearance and in-game observations; not a substitute for official future global dates |
| C | Community posts, reposts, summaries | Research leads; insufficient alone for a confirmed-release badge |

Official provenance is separate from permission to redistribute media. Search-result titles and dates embedded in URLs do not establish release dates. Cross-check English and Korean global announcements while allowing one language to publish earlier.

Inspect image-based notices directly before recording their fields. OCR produces a draft; manually compare names, currencies, numbers, and timezones. Preserve preview/in-development qualifications. Unread image content is not verified evidence.

Do not overwrite conflicting material merely because one source is newer. Compare region, server, and rerun context; mark unresolved fields under review. Record deleted sources and seek permitted alternative evidence.

## 5. Global release estimates

### Initial method: editorial review

1. Verify the CN release and identity of its global counterpart. Without official mapping, compare appearance, components, and acquisition type and record the matching rationale.
2. Compare verified historical cases with similar content families, acquisition methods, and version dependencies. Never add one fixed delay to all CN releases.
3. Record seasonality, holidays, collaborations, and possible global packaging changes as considerations, not established operating patterns of this game.
4. Publish only the month, window, or version supported by the evidence. Insufficient comparisons mean Unscheduled.
5. Write rationale and assumptions in both languages and assign a review due date. Revisit after official announcements or relevant changes.

| Strength | Editorial rule | Presentation |
| --- | --- | --- |
| Supported / 근거 충분 | Identity reviewed; directly relevant global context and multiple comparisons support the assumptions; no material contradiction | Estimated window and specific evidence; never becomes official confirmation |
| Limited / 근거 제한적 | Reasonable clues, but few comparisons or uncertainty about ordering/regional applicability | Broader window/version and remaining uncertainty |
| Insufficient / 근거 부족 | CN release exists but no evidence narrows global timing | Unscheduled without a date-based forecast |

These labels assess evidence, not probability. Do not populate fictional forecast dates before collecting actual comparison data. Seed verified official global schedules and historical CN records first, then add defensible estimates.

### Revisions

- When an official announcement appears, add a separate official event and preserve the old forecast as `superseded`. Never rewrite history to make a forecast look correct.
- Mark expired estimates or overdue reviews for reconsideration and surface them in the editorial work queue.
- Record `withdrawn` and a reason when assumptions fail. Passing a date never automatically means Released.
- If automated estimation is considered later, use at least five verified comparable pairs as an exploration threshold, not proof of reliability. Evaluate holdout results, interval coverage, errors, and sample size before adoption.

## 6. Photo and video workflow

- Use actual game material. Generated or speculative composite artwork cannot serve as cosmetic evidence.
- Prefer official source links/permitted video embeds and directly captured or permission-cleared images. Public URLs and attribution do not by themselves establish copying rights.
- Use providers' supported video playback methods and fall back to original links. Downloading and reuploading third-party video is not the default ingestion method.
- Link stored images to their source, owner/contributor, permission or applicable terms, edits, server/version, and bilingual descriptions. Apply the same rules to thumbnails.
- Hide unnecessary player identifiers or chat in screenshots; disclose edits without distorting the appearance.
- Optimize image sizes and reserve media aspect ratios to reduce layout shift. Do not put large image/video collections directly into Git.
- Provide a removal-request route on About. Do not invent an email address or ship a fake form before a real contact route is configured.

## 7. Editorial workflow

`Discover → verify source → match cosmetic → verify media → write EN/KO → validate data → preview → publish → correct`

Initially the maintainer edits structured content and media references in the repository and reviews changes through English PRs. Visitor submissions become separate drafts before verification. A private repository's issue page is not a public reporting route; connect a separate public reporting space or a real contact channel before public launch.

When a new notice is discovered, review affected records and forecasts together. Following the user's additional choice, daily checks in this task are scheduled; they maintain verified research only while the real content model is absent. Execution depends on the computer/app and tool access, so no service level is guaranteed. Record source, translation, and status corrections as revisions and include them in the next deployment. [Recurring review operations](calendar-automation.md)
