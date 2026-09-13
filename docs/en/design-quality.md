# Design, responsive behavior, and performance criteria

[한국어](../ko/design-quality.md) · [Product plan](product-plan.md)

**User requirement:** Prioritize design, UI/UX, usability across screen sizes, and interaction responsiveness even when development takes longer. This document specifies targets and verification methods, not measured performance results.

## 1. Complete quality work with each feature

Refine the catalog, detail, and calendar through `information structure → visual design → interaction → responsive behavior → accessibility → performance verification`. Do not defer all refinement to the final stage. Fix unresolved core-journey problems and recheck the affected flow.

M1 includes designs and a clickable prototype of the three core screens using representative real material. M2 and M3 include responsive, usability, and performance verification of their screens. M4 focuses on integrated journeys and the deployment environment.

## 2. Visual and usability principles

- Choose image aspect ratios and crops that preserve readable silhouettes, materials, and colors. Provide full-appearance and enlarged views on detail pages.
- Apply the ink/jade direction consistently through color, type, spacing, borders, and states. Decoration must not obscure names, sources, or dates.
- Give immediate visual feedback for search, saving, filters, and gallery actions. Longer operations need progress and retry paths.
- Respect Korean input-method composition. Preserve filters, month, and list position where possible across back navigation and language switches.
- Make body/dye conditions and official/estimated/unscheduled states understandable within the image-browsing flow.
- Design loading, empty, error, blocked-media, and save-failure states to the same standard as the normal screen.

## 3. Responsive behavior and accessibility

| Check | Criterion |
| --- | --- |
| Screen sizes | Check 320, 360, 390, 768, 1024, and 1440 CSS px plus intermediate widths |
| Mobile calendar | Readable list default; thumb-accessible month navigation and status filters |
| Mobile detail | Image → name/status → key facts; do not merely shrink desktop columns |
| Touch | Project target of 44×44 CSS px for primary controls with adequate spacing |
| Text | Body at least 16px, regular labels at least 14px; check long EN/KO names and 200% enlargement |
| Keyboard | Operable search, filters, enlargement, closing, and saving; visible/restored focus |
| Motion | Respect reduced motion; omit autoplay and unnecessary continuous animation |
| Browsers | Check Chromium, Firefox, and WebKit; record actual iOS/Android-device coverage separately |

Do not accept unintended horizontal scrolling, clipped names, overlapping badges, or hard-to-tap filters as complete. Automated checks alone do not establish usability.

## 4. Speed targets and measurement

Real-user targets, separated by mobile and desktop at the 75th percentile, are **LCP ≤ 2.5 seconds, INP ≤ 200ms, and CLS ≤ 0.1**. These adopt the [Core Web Vitals recommendations](https://web.dev/articles/vitals). Before launch, measure under controlled slower-network/CPU conditions; assess field-target compliance after collecting actual usage samples. A Lighthouse score alone cannot establish real-user INP or overall UX quality.

Initial project transfer targets for representative explore/detail pages are no more than 200KB compressed initial JavaScript and 600KB of first-viewport images. Record request-level transfer sizes and investigate overruns. Do not compromise cosmetic detail or Korean readability just to meet a number. Document comparisons and rationale when revising a budget.

- Serve images sized for their display area with supported formats and fallbacks. Prioritize the first key image; defer offscreen images.
- Reserve image dimensions and avoid layout movement during font replacement. Measure Korean font transfer size as well.
- Load video players and heavy gallery functions on demand. Do not download every video on the first visit.
- Cache verified content for reading pages and the calendar. AI API calls belong in the publication pipeline, outside the visitor request path.
- Repeatedly exercise filters and month navigation with representative and expanded test data to check delay and stuttering.

## 5. Completion evidence

UI PRs include EN/KO mobile/desktop captures, checked core journeys, device/browser/network conditions, performance measurements, and remaining limits. Repeat measurements under the same conditions and distinguish physical-device checks from emulation. Content PRs check plausible regressions from their changes, including image size, missing translations, and layout effects.


## Selected typography · 2026-09-13

The user selected option B: Noto Serif KR at 500 for large titles and SUIT for interface text. Desktop body copy uses weight 350; small controls, dates and mobile body copy use 400. Keep dark-theme contrast and 16px minimum body text. Only the selected, licensed, renamed webfont subsets ship.

Follow-up: use SUIT 300 for large section text (20px+), 350 for normal desktop copy, and 400 for compact controls/dates and mobile body text. Compact card names use 450. Noto Serif KR titles stay at 500.
