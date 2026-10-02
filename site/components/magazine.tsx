import Link from 'next/link';
import { ArrowLeft, ArrowRight, ArrowUpRight, Download } from 'lucide-react';
import { findCosmetic, imagesOf, nameOf, formatDay, type Locale } from '@/lib/catalog';
import { findIssue, magazineIssues, shareImagePath, sharePreviewPath, type MagazineIssue } from '@/lib/magazine';
import { sources } from '@/lib/roadmap';
import exportMetrics from '@/content/magazine-export-metrics.json';

function Mirror() {
  return <svg className="mag-mirror" viewBox="0 0 600 600" fill="none" aria-hidden="true"><circle cx="300" cy="300" r="270"/><circle cx="300" cy="300" r="246"/><path d="M30 300h540M300 30v540M109 109l382 382M109 491l382-382"/><circle cx="300" cy="300" r="170"/></svg>;
}
function Cover({ issue, l, compact = false }: { issue: MagazineIssue; l: Locale; compact?: boolean }) {
  const c = findCosmetic(issue.coverCosmeticId)!;
  const image = imagesOf(c)[0];
  return <div className={`mag-cover ${compact ? 'mag-cover-compact' : ''}`}>
    <Mirror />
    <img className="mag-cover-photo" src={image.thumbnail} alt={l === 'ko' ? '홍염의 밤 중국 공식 여성 참고 외형' : 'Blazing Conquest, official CN female reference'} width={720} height={1280} fetchPriority="high" />
    <div className="mag-cover-shade" />
    <div className="mag-cover-content">
      <div className="mag-masthead"><span>{l === 'ko' ? '연운경' : 'WINDS AHEAD'}</span><span>MAGAZINE</span></div>
      <div className="mag-cover-meta"><span>ISSUE {issue.number} · {l === 'ko' ? '창간호' : 'DEBUT ISSUE'}</span><time dateTime={issue.publishedAt}>2026.10.01</time></div>
      <p className="mag-overline">{l === 'ko' ? '글로벌 출시 예고 / 외관 정보' : 'GLOBAL SCHEDULE / APPEARANCE DETAILS'}</p>
      {compact ? <h2>{issue.title[l]}</h2> : <h1>{issue.title[l]}</h1>}
      <p className="mag-cover-deck">{issue.subtitle[l]}</p>
      <div className="mag-cover-bottom"><span>{l === 'ko' ? '공식 출시 예고 4종' : '4 OFFICIAL ANNOUNCEMENTS'}</span><span>01</span></div>
    </div>
    <span className="mag-photo-label">{l === 'ko' ? '중국 공식 참고사진 · 글로벌 실착 아님' : 'Official CN reference · not live Global footage'}</span>
  </div>;
}
export default function Magazine({ l, issueId }: { l: Locale; issueId?: string }) {
  const t = (en: string, ko: string) => l === 'ko' ? ko : en;
  const issue = findIssue(issueId);
  if (!issue) return <section className="magazine-index">
    <div className="mag-index-intro"><p className="mag-overline">WINDS AHEAD / EDITORIAL</p><h1>{t('Magazine', '매거진')}</h1><p>{t('Official appearance schedules and acquisition details, collected by issue.', '공식 외관 출시 일정·획득 정보를 회차별로 정리합니다.')}</p></div>
    {magazineIssues.map(i => <Link className="mag-issue-link" key={i.id} href={`/${l}/magazine/${i.id}`}><Cover issue={i} l={l} compact/><div className="mag-issue-caption"><div><span>ISSUE {i.number} · {formatDay(i.publishedAt, l)}</span><p>{i.title[l]}</p></div><span className="mag-read">{t('Read issue', '이번 호 읽기')}<ArrowUpRight size={20}/></span></div></Link>)}
    <p className="mag-index-note">{t('Schedules follow official announcements; unknown dates stay unknown.', '공식 출시 일정과 미발표 일정은 별도로 표시합니다.')}</p>
  </section>;
  const cover = findCosmetic(issue.coverCosmeticId)!;
  const coverImage = imagesOf(cover)[0];
  return <article className="magazine-article">
    <Link href={`/${l}/magazine`} className="mag-back"><ArrowLeft size={17}/>{t('All issues', '매거진 목록')}</Link>
    <Cover issue={issue} l={l}/>
    <div className="mag-publication"><span>{t('Published', '발행')} {formatDay(issue.publishedAt, l)} · America/New_York</span><span>{t('Information as of', '정보 기준일')} {issue.informationAsOf} · {t('Edition', '수정판')} {issue.revision}</span></div>
    <nav className="mag-contents" aria-label={t('Issue contents', '이번 호 목차')}>{issue.sections.map((s, i) => <a href={`#${s.id}`} key={s.id}><span>0{i+1}</span>{s.eyebrow[l]}<ArrowRight size={15}/></a>)}</nav>
    <div className="mag-reading">
      {issue.sections.map((s, i) => <section id={s.id} key={s.id} className={`mag-section mag-section-${s.id}`}>
        <div className="mag-section-heading"><span className="mag-section-number">0{i+1}</span><p className="mag-overline">{s.eyebrow[l]}</p><h2>{s.title[l]}</h2></div>
        {s.id === 'feature' && <figure className="mag-feature-photo"><a href={coverImage.full} target="_blank" rel="noreferrer" aria-label={t('Open complete CN reference artwork', '중국 참고사진 전체 보기')}><img src={coverImage.full} alt={t('Blazing Conquest female CN reference: red flowers, gold beast armor, and gourd', '홍염의 밤 여성 중국 참고 외형: 붉은 꽃, 금빛 짐승 갑옷, 호리병')} width={720} height={1280} loading="lazy"/></a><figcaption>{t('Official CN female reference. Tap for the complete artwork. Global announcement terms below.', '중국 공식 여성 참고사진 · 누르면 전체 이미지. 아래 획득 정보는 글로벌 공지 기준입니다.')}</figcaption></figure>}
        <div className="mag-prose">{s.body[l].split('\n\n').map((p, j) => <p key={j}>{p}</p>)}</div>
        {s.id === 'feature' && <Link className="mag-text-link" href={`/${l}/cosmetics/${cover.id}`}>{t('See the full gallery and server details', '전체 갤러리와 서버별 정보 보기')}<ArrowUpRight size={18}/></Link>}
        {s.id === 'october' && <div className="mag-picks">{issue.featuredCosmeticIds.filter(id => id !== cover.id).map(id => { const c = findCosmetic(id)!; const m = imagesOf(c)[0]; return <Link key={id} href={`/${l}/cosmetics/${id}`}><img src={m.thumbnail} alt={nameOf(c, l)} width={400} height={240} loading="lazy"/><span>{nameOf(c, l)}<ArrowUpRight size={16}/></span><small>{t('CN reference · Global scheduled', '중국 참고사진 · 글로벌 출시 예고')}</small></Link>; })}</div>}

      </section>)}
    </div>
    <section className="mag-share" id="share"><p className="mag-overline">MOBILE EDITION</p><h2>{t(`${issue.sharePageCount} photo pages`, `사진판 ${issue.sharePageCount}장`)}</h2><p>{t('A single-column mobile edition, ready to attach in order to a community post. Downloads match the language you are reading.', '모바일에서 아래로 읽는 한 열 구성입니다. 현재 언어의 이미지를 순서대로 첨부해 한 회차로 공유하세요.')}</p><a className="mag-download-all" href={`/magazine/${issue.id}/edition-${issue.revision}/${l}/${issue.id}-${l}.zip`} download><Download size={18}/>{t(`Download all ${issue.sharePageCount} JPGs`, `JPG ${issue.sharePageCount}장 한 번에 받기`)}</a><div className="mag-downloads">{Array.from({length: issue.sharePageCount}, (_, i) => <a key={i} href={shareImagePath(l,i+1,issue)} download={`winds-ahead-issue-01-${l}-${i+1}.jpg`}><img src={sharePreviewPath(l,i+1,issue)} alt={`${t('Share image', '공유 이미지')} ${i+1}`} width={1080} height={exportMetrics.pages.find(p => p.locale === l && p.page === i+1)?.height} loading="lazy"/><span>0{i+1}<Download size={16}/></span></a>)}</div><p className="mag-rights-note">{issue.shareArtPolicy[l]}</p><p className="mag-rights-note">{t('Keep the issue number and source labels when sharing. Check the destination community’s posting rules.', '공유할 때 회차·출처 표시를 유지하고 게시할 커뮤니티의 공지를 확인하세요.')}</p></section>
    <details className="mag-sources"><summary>{t('Sources, edition notes and corrections', '출처·발행 기록·정정 안내')}</summary><p>{t('An independent fan publication, not an official game announcement. This issue is a fixed editorial snapshot; the archive and roadmap carry current information.', '공식 게임 공지가 아닌 독립 팬 매거진입니다. 이 호는 발행 당시의 기록이며 도감과 로드맵에서 최신 정보를 확인할 수 있습니다.')}</p>{issue.corrections.length ? issue.corrections.map((c, index) => <p key={`${c.date}-${index}`}>{c.date} · {c.body[l]}</p>) : <p>{t('No corrections recorded for this edition.', '현재 수정판의 정정 기록은 없습니다.')}</p>}<ul>{issue.sourceIds.map(id => {const s = sources.find(source => source.id === id); return s && <li key={id}><a href={s.url} target="_blank" rel="noreferrer">{s.titleOriginal}<ArrowUpRight size={14}/></a></li>;})}</ul><p>{t('Game artwork remains excluded from the code license.', '게임 이미지는 프로젝트 코드 라이선스에서 제외됩니다.')}</p></details>
    <Link className="mag-next" href={`/${l}`}><span>{t('Cosmetic archive', '외관 도감')}</span>{t('Explore the archive', '외관 도감 둘러보기')}<ArrowRight size={24}/></Link>
  </article>;
}
