# Winds Ahead Magazine

[한국어](../ko/magazine.md) · [Magazine](https://windsahead.com/en/magazine)

The magazine collects verified appearance announcements and acquisition details in bilingual photographic issues. It adds no recurring schedule or automatic community posting. [Official schedule policy](official-schedules.md) applies to all current articles and exports.

Issue 01, October appearance update, retains its October 1, 2026 information date and America/New_York publication timezone. Edition 5 removes the Lian Tai He estimate and its cover mention. Six 1080px JPG pages per language contain the cover, four official October 4 appearance pages and a final site introduction. The web article also retains Bloom Night's discount-end interpretation. Actual Global availability is unverified.

`site/content/magazine.json` holds bilingual sections, source references and correction history. The edition number changes whenever downloads change. Earlier exports are preserved in Git history and removed from public assets. Artwork uses existing attributed official CN references; permission remains unknown and images are excluded from the code license. Complete originals remain in the archive.

Render with `site/scripts/render-magazine.mjs`, using installed Chrome/Playwright and optional `WINDS_BROWSER_MODULES`. Build each language ZIP from its six JPGs. Verify photo provenance, image dimensions/budgets, reserved preview dimensions, EN/KO mobile reading and downloads, then follow [releasing](releasing.md). Retain licensed font notices. Community posting requires separate user authorization.
