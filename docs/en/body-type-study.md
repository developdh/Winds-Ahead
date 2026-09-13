# Body type study

[한국어](../ko/body-type-study.md)

The owner found both SUIT and Pretendard unsuitable and requested a broader comparison. No replacement is selected yet. The local study is at `/design/body-font-study.html`; its source and licensed subsets are retained in `site/design-studies/body-type/`, outside production public assets.

| Candidate | Light / regular | Source |
| --- | --- | --- |
| Wanted Sans | 350 / 400, variable | [Official project](https://github.com/wanteddev/wanted-sans) |
| Spoqa Han Sans Neo | 300 / 400 | [Official project](https://github.com/spoqa/spoqa-han-sans) |
| IBM Plex Sans KR | 300 / 400 | [Official project](https://github.com/IBM/plex), distributed by Google Fonts |
| Gowun Dodum | 400 only | [Google Fonts source](https://github.com/google/fonts/tree/main/ofl/gowundodum) |

The title stays in Noto Serif KR. Preview controls change body text only; Korean, English, dates, numbers, and actual acquisition text share a consistent layout. The lower comparison shows all four at once. Shape impressions in the study are editorial judgments, not font authors' claims.

For local preview, copy `index.html` to `site/public/design/body-font-study.html` and `fonts/` to `site/public/design/body-fonts/`. This ignored public preview directory must be moved out before packaging production. The checked-in font subsets use renamed internal family names and retain their original OFL notices. Revisit the selected face across the actual site before final typography approval.
