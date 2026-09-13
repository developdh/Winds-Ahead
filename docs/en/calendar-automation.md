# GitHub-based AI calendar updates

[한국어](../ko/calendar-automation.md) · [Content model](content-model.md) · [Performance criteria](design-quality.md)

**User decision:** GitHub holds canonical content, with recurring execution of this task providing initial AI review and updates. A daily 9:00 AM America/New_York check has been scheduled. A separate GPT API and automatic merging remain inactive. The implemented MVP content is maintained through reviewable content PRs; see the canonical paths in [MVP status](mvp-status.md).

## 1. Execution options

| Option | Behavior | Conditions |
| --- | --- | --- |
| Recurring checks in this task · selected | This task resumes with project context to inspect sources, reason, and update GitHub | Local project access requires the computer and app to run; subject to account usage limits and tool access |
| GitHub Actions + GPT API · future migration option | GitHub execution checks announcements and saves API-assisted proposals in PRs | API credentials/billing, execution limits, and failure handling; independent of the personal PC |

See [GitHub-hosted runners](https://docs.github.com/en/actions/concepts/runners/github-hosted-runners) for execution hosting and [OpenAI scheduled tasks](https://learn.chatgpt.com/docs/automations?surface=app) for local scheduling conditions. The schedule is attached to this task with app management ID `automation`. The API option remains unimplemented.

## 2. Shared update procedure

1. Inspect official CN, Global, and Korean announcements, selecting new material or substantive changes. Distinguish collection failure from no updates.
2. Structure original dates, regions, cosmetics, acquisition methods, and names. Unread image notices remain unverified.
3. Supply verified CN/Global matched records and current forecasts. Never generate schedules from conversation memory or model knowledge alone.
4. Let AI propose keeping, adding, revising, or withdrawing a forecast, with its window, evidence, counterevidence, and EN/KO rationale. Insufficient information must allow an unknown result.
5. Independently validate evidence references, date precision, regional scope, translations, duplicate IDs, and preservation of official records. Format validation does not replace factual verification.
6. Create an English PR or update the existing refresh PR only when content changes. Preserve prior forecasts and reasons. No changes means no PR.
7. Initially publish through reviewed merge and deployment. Automatic merging has not been selected and remains off unless separately requested. AI evidence ratings do not create official-confirmation badges.

[Responses API web search](https://developers.openai.com/api/docs/guides/tools-web-search) supports domain restrictions and source lists; inspect retrieved originals as part of the workflow. Use [Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs) for the result format, not as a guarantee of factual correctness.

## 3. Decision records

Each proposal records the cosmetic ID, previous/proposed forecast, `precision`, region/server scope, evidence IDs and inspection times, comparisons, `evidence_strength`, EN/KO rationale, assumptions, next review date, actual model/prompt version, and supersession relationship.

Repeated execution with identical evidence and inputs must not create duplicate PRs or schedule churn. Preserve existing judgments without material new evidence. Keep historical outcomes for comparison with eventual global releases.

## 4. Proposed cadence and failure handling

- Announcement checks are scheduled daily at 9:00 AM America/New_York, reconsidering affected cosmetics when something changes. Consult the app's next-run display for actual scheduling, including daylight-saving behavior.
- Review due dates and outcomes across the forecast list weekly. Restrict model calls to changed or overdue items.
- GitHub scheduled execution can be delayed, so do not promise real-time updates. Provide manual execution and the last successful-check timestamp. [GitHub workflow events](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows)
- Preserve the last good data on API or collection failure and record the reason/retry status. Notify only for failures, meaningful changes, or required user action.
- A scheduled date passing does not verify an actual release. Flag expired estimates for review.

## 5. Cost, access, and site speed

Store API credentials in GitHub secrets, outside the browser and repository files. Bound notices processed, input/output length, retries, and concurrent execution, and record usage. Cost depends on the model, search, and image inputs; measure a small representative batch before setting the operating cadence. [API pricing](https://developers.openai.com/api/docs/pricing)

Treat source material as evidence, not executable instructions. Constrain generated changes to content paths and separate them from executable code/configuration changes.

Calendar visitors never wait for a GPT response. Generate/cache pages from verified data after the update process, with catalog, detail, and calendar reading the same records. AI latency or failure therefore does not block browsing.

## 6. Current status and next completion criteria

Before scheduling, manually rechecked access to the CN/Global/Korean official news lists and the existing source register. This checks source access, not the complete image-extraction, forecasting, or calendar-publication flow.

The schedule now targets the implemented JSON content and its validation commands. The manual seed contains eight verified CN records and no global estimates. A scheduled end-to-end refresh has not yet been observed; validate its first actual content proposal before publication. The model follows this task's settings; a successful scheduled check does not validate release predictions.
