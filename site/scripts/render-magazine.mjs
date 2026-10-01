/** Render the original-art mobile share edition. No game media enters these exports. */
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
const runtime = process.env.WINDS_BROWSER_MODULES;
const require = runtime ? createRequire(path.join(runtime, 'package.json')) : createRequire(import.meta.url);
const { chromium } = require('playwright');
const { issues } = JSON.parse(readFileSync(path.join(root, 'content/magazine.json'), 'utf8'));
const issue = issues[0];
const escape = s => s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const font = readFileSync(path.join(root,'public/fonts/winds-heading.woff2')).toString('base64');
const uiFont = readFileSync(path.join(root,'public/fonts/winds-ui.woff2')).toString('base64');
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1080, height: 1600 }, deviceScaleFactor: 1 });
const css = `@font-face{font-family:Heading;src:url(data:font/woff2;base64,${font});font-weight:500}@font-face{font-family:UI;src:url(data:font/woff2;base64,${uiFont});font-weight:400}*{box-sizing:border-box}body{margin:0;background:#131e18;color:#ece7da;font-family:UI,'Malgun Gothic',sans-serif;font-synthesis:none}.sheet{position:relative;isolation:isolate;padding:70px 76px 54px;min-height:1600px;overflow:hidden}.masthead{display:flex;align-items:baseline;justify-content:space-between;border-bottom:1px solid #b9c7ad88;padding-bottom:25px;font:500 46px Heading,serif}.masthead small{font:400 22px UI,sans-serif;letter-spacing:.18em}.meta{display:flex;justify-content:space-between;font-size:25px;color:#bac7af;margin-top:24px}.overline{font-size:28px;letter-spacing:.08em;color:#b4c9a3;margin:65px 0 25px}h1{font:500 80px/1.42 Heading,'Malgun Gothic',serif;white-space:pre-line;margin:0 0 42px;word-break:keep-all;letter-spacing:-.025em}p{font-size:43px;line-height:1.7;margin:0 0 32px;white-space:pre-line;word-break:keep-all;overflow-wrap:anywhere}.body{max-width:900px;position:relative}.footer{display:flex;justify-content:space-between;align-items:end;border-top:1px solid #b9c7ad66;padding-top:26px;margin-top:60px;color:#bec7b1;font-size:28px}.footer b{font:500 46px Heading,serif}.footnote{white-space:pre-line;font-size:30px;line-height:1.65;color:#bac5b3;margin-top:30px}.mirror{position:absolute;right:-290px;top:120px;width:1000px;height:1000px;border:1px solid #b9caad35;border-radius:50%;z-index:-1}.mirror:before,.mirror:after{content:'';position:absolute;border:1px solid #b9caad35;border-radius:50%;inset:45px}.mirror:after{inset:160px}.cream{background:#e6e1d3;color:#223629}.cream .overline,.cream .meta,.cream .footnote,.cream .footer{color:#4c634b}.cream .masthead,.cream .footer{border-color:#5c725966}.cream .mirror,.cream .mirror:before,.cream .mirror:after{border-color:#55784d33}.cover h1{font-size:112px;margin-top:65px;margin-bottom:70px;max-width:850px}.cover .kicker{font-size:34px;letter-spacing:.1em}.cover .line{display:block;width:110px;height:3px;background:#c6b791;margin:50px 0}.cover p{max-width:830px}.cover .big-number{font:500 250px/1 Heading,serif;margin:85px 0 40px;color:#afc79e}.cover .footer{margin-top:30px}.label{display:inline-block;border:1px solid #a6bb9677;padding:12px 20px;font-size:26px;letter-spacing:.05em;margin-bottom:34px}`;
const metrics = [];
try {
  for (const locale of ['ko','en']) {
    const output = path.join(root, 'public/magazine/issue-01',locale); mkdirSync(output,{recursive:true});
    const pages = [null, ...issue.sections.slice(1)];
    for (let index=0;index<pages.length;index++) {
      const section = pages[index];
      const num = String(index+1).padStart(2,'0');
      const masthead = locale==='ko' ? '연운경' : 'WINDS AHEAD';
      const title = section ? section.title[locale] : (locale==='ko' ? '다음 옷장을\n미리 펼치다' : 'Your next\nwardrobe,\na first look.');
      const body = section ? section.body[locale] : (locale==='ko' ? '10월의 불꽃, 그리고 기다리는 한 벌.\n외관을 발견하고 로드맵을 읽는 창간호.\n\n도감에서 모습을, 로드맵에서 일정을,\n매거진에서 눈여겨볼 이유를 찾아보세요.' : 'October’s flames, and an outfit worth watching.\nOur debut issue opens the archive and roadmap.\n\nDiscover appearances. Read the evidence.\nTell us what you want to see next.');
      const footnote = index===0 ? (locale==='ko'?'독립 팬 매거진 · 공식 정보와 운영자 예상 구분\n정보 기준 2026.10.01 · 발행일 America/New_York':'Independent fan magazine · official facts and estimates stay separate\nInformation as of 2026.10.01 · publication date in America/New_York') : index===3 ? (locale==='ko'?'예상 ≠ 공식 일정 · 근거 제한적 · 기존 예상 3차 기록\n근거와 변경 이력: windsahead.com/ko/calendar':'Estimate ≠ official schedule · limited evidence · forecast revision 3\nEvidence and history: windsahead.com/en/calendar') : index===1||index===2||index===4 ? (locale==='ko'?'출처: 연운 글로벌 공식 2026.09.30 외관 공지\n원문·최신 정보: windsahead.com/ko/magazine/issue-01':'Source: official Global appearance notice, September 30, 2026\nSources and current links: windsahead.com/en/magazine/issue-01') : (locale==='ko'?'외관 도감 · 로드맵 · 매거진\nwindsahead.com/ko':'COSMETICS · ROADMAP · MAGAZINE\nwindsahead.com/en');
      const html=`<!doctype html><html lang="${locale}"><meta charset="utf-8"><style>${css}</style><div class="sheet ${index===0?'cover':''} ${index===1||index===4?'cream':''}"><div class="mirror"></div><div class="masthead">${masthead}<small>MAGAZINE</small></div><div class="meta"><span>ISSUE 01 · ${locale==='ko'?'창간호':'DEBUT ISSUE'}</span><span>2026.10.01</span></div><div class="overline">${section?escape(section.eyebrow[locale]):'A FIRST LOOK / 01'}</div>${index===2?`<div class="label">${locale==='ko'?'글로벌 공식 출시 예고 · 실제 판매 미확인':'GLOBAL SCHEDULE · LIVE AVAILABILITY UNVERIFIED'}</div>`:''}<h1>${escape(title)}</h1>${index===0?'<span class="line"></span>':''}<div class="body">${body.split('\n\n').map(p=>`<p>${escape(p)}</p>`).join('')}</div>${index===0?'<div class="big-number">01</div>':''}<div class="footnote">${escape(footnote)}</div><div class="footer"><span>windsahead.com/${locale} · ${locale==='ko'?'수정판':'EDITION'} 1</span><b>${num} / 06</b></div></div></html>`;
      await page.setContent(html); await page.evaluate(()=>document.fonts.ready);
      const height = await page.locator('.sheet').evaluate(el=>Math.ceil(el.getBoundingClientRect().height));
      await page.setViewportSize({width:1080,height});
      await page.locator('.sheet').screenshot({path:path.join(output,`${num}.png`)});
      metrics.push({locale,page:index+1,width:1080,height});
    }
  }
} finally { await browser.close(); }
writeFileSync(path.join(root,'public/magazine/issue-01/export-metrics.json'),JSON.stringify({generatedFrom:'content/magazine.json',gameArtworkIncluded:false,pages:metrics},null,2)+'\n');
console.log(JSON.stringify(metrics));
