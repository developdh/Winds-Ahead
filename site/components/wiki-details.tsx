"use client";
import { useEffect, useState } from "react";
import { ArrowUpRight, Check, Minus, RefreshCw } from "lucide-react";
import type { Locale } from "@/lib/catalog";
import type { WikiDetails as WikiData } from "@/lib/wiki";

// Each item is a small static document. The archive never imports the corpus.
const cache = new Map<string, WikiData>();
export default function WikiDetails({ id, l }: { id: string; l: Locale }) {
  const [data, setData] = useState<WikiData | null>(() => cache.get(id) ?? null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const t = (en: string, ko: string) => l === "ko" ? ko : en;
  useEffect(() => {
    const controller = new AbortController();
    const cached = cache.get(id);
    setFailed(false);
    setData(cached ?? null);
    if (!cached) fetch(`/data/wiki/${encodeURIComponent(id)}.json`, { signal: controller.signal })
      .then(response => { if (!response.ok) throw new Error("Missing wiki detail"); return response.json(); })
      .then((responseData) => {
        const value = responseData as WikiData;
        if (value.schemaVersion !== 1 || value.cosmeticId !== id) throw new Error("Mismatched wiki detail");
        if (!controller.signal.aborted) { cache.set(id, value); setData(value); }
      })
      .catch(() => { if (!controller.signal.aborted) setFailed(true); });
    return () => controller.abort();
  }, [id, attempt]);
  if (!data) return <section className="wiki-panel wiki-loading" aria-live="polite" aria-busy={!failed}>
    <h2>{t("Composition & collection", "구성과 수집 정보")}</h2>
    {failed ? <><p>{t("These details could not be loaded.", "참고 정보를 불러오지 못했습니다.")}</p><button className="text-link" onClick={() => setAttempt(value => value + 1)}><RefreshCw size={16} />{t("Try again", "다시 불러오기")}</button></> : <p>{t("Loading wiki details…", "위키 정보를 불러오는 중…")}</p>}
  </section>;
  const flagLabels = { dye: t("Dyeing", "염색"), tailoring: t("Tailoring", "재단"), gifting: t("Gifting", "선물"), trading: t("Trading", "거래") };
  const flagValue = (value: boolean | null) => value === null ? t("Not stated", "미기재") : value ? t("Supported", "가능") : t("Not supported", "불가");
  return <section className="wiki-panel" aria-labelledby={`wiki-heading-${id}`}>
    <header className="wiki-heading"><div><p className="eyebrow">{t("Community reference · China", "커뮤니티 참고 · 중국")}</p><h2 id={`wiki-heading-${id}`}>{data.category === "sets" ? t("Inside the set.", "한 벌을 이루는 것들.") : t("Appearance details.", "외관 상세 정보.")}</h2></div><a className="text-link" href={data.sourceUrl} target="_blank" rel="noreferrer">{t("Huiji Wiki", "灰机wiki")}<ArrowUpRight size={16} /></a></header>
    {!data.articleAvailable ? <p className="wiki-empty">{t("The wiki lists this appearance, but its detail article has not been written yet.", "위키 목록에는 있지만 상세 문서는 아직 작성되지 않은 항목입니다.")}</p> : <div className={`wiki-layout ${data.components.length ? "has-components" : ""}`}>
      {data.components.length > 0 && <div className="wiki-composition">
        <div className="wiki-list-heading"><h3>{t("Set composition", "세트 구성")}<span>{data.components.length}</span></h3><span>{t("Style points", "풍화치")}</span></div>
        <ul>{data.components.map((part, index) => <li key={`${part.nameOriginal}-${index}`}>
          <span className="wiki-part-order" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
          {part.sourceUrl ? <a href={part.sourceUrl} target="_blank" rel="noreferrer" title={part.nameOriginal}>{part.label[l]}<ArrowUpRight size={13} /></a> : <span title={part.nameOriginal}>{part.label[l]}</span>}
          <span className="wiki-part-score">{part.styleScore?.toLocaleString(l) ?? "—"}</span>
        </li>)}</ul>
        {data.reportedComponentCount !== null && data.reportedComponentCount !== data.components.length && <p className="small-muted">{t(`The wiki reports ${data.reportedComponentCount} pieces; ${data.components.length} rows have values. See the original for the difference.`, `위키 기재 부위 수는 ${data.reportedComponentCount}개이며, 값이 있는 구성 행은 ${data.components.length}개입니다. 차이는 원문에서 확인하세요.`)}</p>}
      </div>}
      <div className="wiki-information">
        {(data.grade || data.styleScore !== null) && <div className="wiki-highlights">{data.grade && <div><span>{t("Rarity", "등급")}</span><strong>{data.grade[l]}</strong></div>}{data.styleScore !== null && <div><span>{t("Style points", "풍화치")}</span><strong>{data.styleScore.toLocaleString(l)}</strong></div>}</div>}
        {data.category === "sets" && <dl className="wiki-flags">{(Object.keys(flagLabels) as (keyof typeof flagLabels)[]).map(flag => <div key={flag}><dt>{flagLabels[flag]}</dt><dd data-supported={data.flags[flag] === true}>{data.flags[flag] === true ? <Check size={15} /> : <Minus size={15} />}{flagValue(data.flags[flag])}</dd></div>)}</dl>}
        <dl className="wiki-facts">
          {data.collectionReward && <div><dt>{t("Set completion reward", "세트 완성 보상")}</dt><dd>{data.collectionReward.currency[l]} <span className="wiki-number">{data.collectionReward.amount}</span></dd></div>}
          {data.resultsAnimation && <div><dt>{t("Results animation", "결산 연출")}</dt><dd>{t("Included", "있음")}{data.resultsAnimation.styleScore !== null && <small> · {data.resultsAnimation.styleScore} {t("style points", "풍화치")}</small>}</dd></div>}
          {data.weapon && <div><dt>{t("Weapon type", "무기 종류")}</dt><dd>{data.weapon[l]}</dd></div>}
          {data.mountType && <div><dt>{t("Mount type", "탈것 종류")}</dt><dd>{data.mountType[l]}</dd></div>}
          {data.martialArt && <div><dt>{t("Martial art · original name", "적용 무학 · 원명")}</dt><dd lang="zh-Hans">{data.martialArt}</dd></div>}
          {data.replacedMove && <div><dt>{t("Replaced move · source label", "변경 초식 · 원문 표기")}</dt><dd lang="zh-Hans">{data.replacedMove}</dd></div>}
          {data.acquisition && <div><dt>{t("Acquisition · wiki", "획득처 · 위키")}</dt><dd>{data.acquisition[l]}</dd></div>}
          {data.timing && <div><dt>{t("Availability · wiki", "출시·판매 시기 · 위키")}</dt><dd>{data.timing[l]}<small>{t("Time zone not stated", "시간대 미표기")}</small></dd></div>}
        </dl>
        {data.additionalNote && <p className="small-muted">{data.additionalNote[l]}</p>}
        <p className="wiki-score-note">{t("Style points measure collection progress. They are not a price. Completion rewards are earned, not paid.", "풍화치는 외관 수집 점수이며 가격이 아닙니다. 세트 완성 보상은 지불 비용이 아닌 획득 보상입니다.")}</p>
      </div>
    </div>}
    <footer className="wiki-provenance"><p>{t("Source: 燕云十六声中文维基 contributors. Facts reorganized and labels translated under CC BY-NC-SA 3.0. Wiki notes may differ by version; official regional release records are shown separately.", "출처: 燕云十六声中文维基 기여자. CC BY-NC-SA 3.0에 따라 정보를 재구성하고 항목을 번역했습니다. 위키 정보는 버전별로 다를 수 있으며 공식 서버별 출시 기록과 구분합니다.")}</p><div><a href="https://creativecommons.org/licenses/by-nc-sa/3.0/" target="_blank" rel="noreferrer">CC BY-NC-SA 3.0</a>{data.revisionUrl && <a href={data.revisionUrl} target="_blank" rel="noreferrer">{t("Source revision", "원문 수정 이력")}</a>}<a href={`/data/wiki/${id}.json`} download>{t("Reference data", "참고 데이터")}</a><span>{t("Checked", "확인")} {data.checkedAt}</span></div>
      {(data.acquisition || data.timing) && <details className="wiki-original"><summary>{t("Original acquisition & timing notes", "획득처·일정 원문 확인")}</summary>{data.acquisition && <p lang="zh-Hans">{data.acquisition.original}</p>}{data.timing && <p lang="zh-Hans">{data.timing.original}</p>}</details>}
    </footer>
  </section>;
}
