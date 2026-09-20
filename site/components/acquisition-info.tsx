import { serverName } from '@/lib/regional-status';
import { currencyName } from '@/lib/acquisition';
import type { Cosmetic, Locale } from '@/lib/catalog';
export default function AcquisitionInfo({ c, l }: { c: Cosmetic; l: Locale }) {
  const a = c.acquisition;
  const t = (en: string, ko: string) => l === 'ko' ? ko : en;
  const fixed = a.pricing === 'fixed';
  const currency = currencyName(a.currencyOriginal, l);
  return <section className="acquisition-info" aria-labelledby={`acquisition-${c.id}-${c.acquisitionServer ?? "CN"}`}>
    <div className="acquisition-heading">
      <h2 id={`acquisition-${c.id}-${c.acquisitionServer ?? "CN"}`}>{t('How to obtain', '획득 정보')}</h2>
      <span>{serverName(c.acquisitionServer ?? 'CN', l)}</span>
    </div>
    <p className="small-muted">{t("Price in the announcement", "공지 기준 가격")}</p>
    <p className="acquisition-price">
      {fixed ? <><span>{currency}</span><strong>× {a.amount!.toLocaleString(l === 'ko' ? 'ko-KR' : 'en-US')}</strong></> :
        <strong>{a.pricing === 'free' ? t('Free reward', '무료 보상') : a.pricing === 'draw' ? t('Draw reward', '추첨 보상') : a.pricing === 'pass' ? t('Paid battle pass', '유료 강호령') : a.kind === 'milestone' ? t('Milestone reward', '단계 보상') : t('Amount unknown', '필요 수량 미정')}</strong>}
    </p>
    {a.regularAmount !== null && <p className="acquisition-discount">{t('Limited discount', '한정 할인')} · {t('Regular price', '정가')} <s>{currency} × {a.regularAmount}</s></p>}
    <dl>
      <div><dt>{t('Where', '획득처')}</dt><dd>{a.location[l]}<small lang="zh-Hans">{a.location.original}</small></dd></div>
      <div><dt>{t('Method', '획득 방식')}</dt><dd>{a.pricing === 'free' ? t('Gameplay or event reward', '플레이·이벤트 보상') : a.kind === 'unknown' ? t('Under review', '확인 중') : a.pricing === 'draw' ? t('Chance reward', '확률형 추첨') : a.pricing === 'pass' ? t('Purchase + level reward', '구매 후 레벨 보상') : a.kind === 'milestone' ? t('Reach a progression tier', '누적 단계 달성') : a.kind === 'shop' ? t('Direct purchase', '직접 구매') : t('Currency exchange', '재화 교환')}</dd></div>
      <div><dt>{t('Currency', '필요 재화')}</dt><dd>{currency ?? t('Not stated', '공지 미표기')}{a.currencyOriginal && <small lang="zh-Hans">{a.currencyOriginal}</small>}</dd></div>
      {!fixed && a.pricing !== 'free' && <div><dt>{t('Required amount', '필요 수량')}</dt><dd>{a.pricing === 'draw' ? t('Total not established', '총 필요 수량 미정') : a.pricing === 'unknown' ? t('Not stated in the source', '공지에 수량 미표기') : t('Price not stated', '구매 가격 미정')}</dd></div>}
    </dl>
    {a.conditions && <p className="acquisition-conditions">{a.conditions[l]}</p>}
    {a.sourceExcerpt && <details className="regional-evidence"><summary>{t("Original acquisition wording", "획득 조건 원문")}</summary><p lang="zh-Hans">{a.sourceExcerpt}</p></details>}
    <p className="acquisition-scope">{t('Terms for the server shown above. Current availability may differ.', '위에 표시된 서버의 조건입니다. 현재 획득 가능 여부는 다를 수 있습니다.')}</p>
  </section>;
}
