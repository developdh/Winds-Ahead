# Acquisition filters and appearance correction

[한국어](../ko/acquisition-filter.md)

The archive has an independent **How to obtain** filter alongside release-server choices and date/name sorting. For example, Battle Pass can be combined with newest Global releases. Available groups are Shop, Resonance/draws, Sound Jade Shop, Battle Pass, Events, Gameplay/milestones, Other exchanges and Source unverified.

Classification uses recorded acquisition methods and currencies. It does not infer free rewards from missing prices or treat a past listing as current availability. With all servers selected, a matching recorded method from either server can qualify; cards display that same method and server's price. Selecting a China or Global release filter restricts acquisition matching to that server. Missing Global terms cannot fall back to CN terms under a Global filter. An item with known CN terms is not classified as wholly unverified just because Global terms are absent.

The selection is retained in `acquisition` in the URL, alongside search, category, server and sort. It survives language changes, popup navigation and standalone detail return links. Unknown URL values fall back to all sources; reset clears the acquisition filter. On mobile the result count and sort share the first row, with the two filters below; each control retains a 44px target. Existing deferred photo/video loading is unchanged.

## Forged in Fire correction · September 14, 2026

The incorrect photo came from an editorial identity mismatch. The [CN announcement](https://www.yysls.cn/news/official/20251224/37780_1278303.html) names the red-cloth outfit with exposed face and gold beast shoulder armor **焰卷残夜**. The [English](https://www.wherewindsmeetgame.com/news/official/903update.html) and [Korean](https://www.wherewindsmeetgame.com/kr/news/official/903update.html) Global posters name the enclosed flame-helmet armor **Forged in Fire / 불길에 단련된 철골**. They are different outfits.

Keep `yan-juan-can-ye` as the original CN record with its correct portrait and CN price/date. Move the correctly cropped Global image, official names, Global acquisition terms and release event to `global-forged-in-fire`. Do not attach CN prices, composition or release dates to the Global outfit. Its CN counterpart remains unverified, without asserting Global exclusivity. The conflicting Global sale/removal dates are retained in both languages.

The [correction record](../research/2026-09-14-forged-in-fire-correction.json) preserves the prior data and rationale. Both existing image derivatives are retained under their correct identities; reuse permission remains unknown.
