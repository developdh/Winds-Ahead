"""Build attributed, on-demand wiki facts from reviewed public DOM snapshots.

This importer never makes network requests or promotes community evidence to
official release facts. Run from any directory; raw snapshots live in docs/.
"""
import hashlib
import json
import re
import subprocess
from pathlib import Path
from urllib.parse import quote

SITE = Path(__file__).resolve().parents[1]
SNAPSHOT = SITE.parent / 'docs/research/huiji'
read = lambda p: json.loads(p.read_text())
write = lambda p, x: p.write_text(json.dumps(x, ensure_ascii=False, indent=2) + '\n')
records = read(SNAPSHOT / 'sets.json') + read(SNAPSHOT / 'other-appearances.json')
indexes = read(SNAPSHOT / 'indexes.json')
research = read(SITE / 'content/research.json')
localizations = read(SITE / 'content/localizations.json')
by_title = {r['title']: r for r in records}
entries = [(p, group['category']) for group in indexes for p in group['items']]
assert len(entries) == len(set(p['title'] for p, _ in entries)) == 395
assert len(by_title) == 383
pair = lambda en, ko: {'en': en, 'ko': ko}
url = lambda title: 'https://yy16s.huijiwiki.com/wiki/' + quote(title, safe='/')
normalize = lambda name: re.sub(r'[\s·・‧•：:「」【】]', '', name)
names = {}
for c in research['cosmetics']:
    for name in [c['nameOriginal'], *c.get('searchAliases', [])]:
        names.setdefault(normalize(name), set()).add(c['id'])
by_id = {c['id']: c for c in research['cosmetics']}
identity_map = read(SNAPSHOT / 'identity-map.json')
all_names = list(dict.fromkeys([p['title'] for p, _ in entries] + [x['label'] for r in records for x in r.get('components', [])]))
for record in records:
    if '部件一览' in record['text']:
        for line in record['text'].split('部件一览',1)[1].split('实装效果')[0].splitlines():
            match = re.fullmatch(r'(.+?)\s+(\d+)', line.strip())
            if match and match[1] not in all_names: all_names.append(match[1])
phonetics = subprocess.run(['uconv', '-x', 'Han-Latin; Latin-ASCII'], input='\n'.join(all_names), text=True, capture_output=True, check=True).stdout.splitlines()
romanized = dict(zip(all_names, phonetics, strict=True))
def romanize(name):
    return romanized.get(name, name).title()

SLOTS = {
    '发型': pair('Hair', '헤어'), '上衣': pair('Top', '상의'), '下装': pair('Bottom', '하의'), '下衣': pair('Bottom', '하의'),
    '服装': pair('Outfit', '의복'), '披挂': pair('Outerwear', '겉옷'), '帽子': pair('Headwear', '모자'),
    '颈饰': pair('Neck accessory', '목 장신구'), '发饰': pair('Hair ornament', '머리 장신구'),
    '耳饰': pair('Earrings', '귀 장신구'), '面饰': pair('Face accessory', '얼굴 장신구'),
    '腕饰': pair('Wrist accessory', '손목 장신구'), '配饰': pair('Accessory', '장신구'),
    '小型配饰': pair('Small accessory', '소형 장신구'), '中型配饰': pair('Medium accessory', '중형 장신구'),
    '大型配饰': pair('Large accessory', '대형 장신구'), '面妆': pair('Makeup', '화장'),
}
WEAPONS = dict(zip(['剑','枪','扇','伞','双刀','陌刀','绳镖','弓箭','横刀','手甲','舞绫鼓'], [pair(*x) for x in [('Sword','검'),('Spear','창'),('Fan','부채'),('Umbrella','우산'),('Dual blades','쌍도'),('Mo blade','장도'),('Rope dart','승표'),('Bow','활'),('Heng blade','횡도'),('Gauntlets','권갑'),('Ribbon drum','무릉고')]]))
GRADES = {k: pair(e, h) for k, e, h in [('金','Gold','금색'),('粉','Pink','분홍'),('紫','Purple','보라'),('蓝','Blue','파랑'),('绿','Green','초록'),('灰','Gray','회색')]}
def slot_label(name):
    clean = re.sub(r'^(梳妆|衣物|饰品)-', '', name)
    if clean.startswith(('小型配饰','中型配饰','大型配饰')):
        clean = re.sub('[一二三]$', lambda m: str('一二三'.index(m[0])+1), clean)
    base = re.sub(r'\d+$', '', clean)
    number = clean[len(base):]
    if base in SLOTS:
        return {l: label + (' ' + number if number else '') for l, label in SLOTS[base].items()}
    return pair(romanize(clean), clean)

def method_label(value):
    # Named events remain identifiers. These are summaries of the wiki wording,
    # never verified global shop labels or assertions about current availability.
    if '1280长鸣珠' in value: return pair('Shop · 1,280 Echo Beads', '상점 · 장명주 1,280개')
    if '商城' in value: return pair('Limited-time shop' if '限时' in value else 'Shop', '기간 한정 상점' if '限时' in value else '상점')
    if '战令' in value or value == '侠客行': return pair('Battle pass', '시즌 패스')
    if '探索' in value: return pair('Jiangnan exploration' if '江南' in value else 'Exploration', '강남 탐색' if '江南' in value else '탐색')
    if '不肝商店' in value: return pair('Bugan shop / chance drop from the listed boss', '불간 상점 / 원문에 기재된 수문장 확률 드롭')
    if '门派商店' in value: return pair('Sect shop exchange', '문파 상점 교환')
    if '伙伴' in value: return pair('Companion shop', '동료 상점')
    if '流派试炼' in value: return pair('Style trial · inheritance exchange', '유파 시련 · 전승 교환')
    if '浮景星梦图' in value: return pair('Exchange gift', '교환 증정 보상')
    if '转盘' in value: return pair('2026 wheel event', '2026년 룰렛 이벤트')
    if '和鸣' in value: return pair('Resonance draw', '공명 추첨')
    if '聆音' in value and '活动' not in value: return pair('Lingyin draw', '청음 추첨')
    return pair('Limited-time event' if '限时' in value else 'Event reward', '기간 한정 이벤트' if '限时' in value else '이벤트 보상')

def timing_label(value):
    if value == '开服常驻': return pair('Listed as permanent since launch', '서버 출시 이후 상시로 기재됨')
    result = {}
    for l in ('en','ko'):
        text = re.sub(r'(\d{4})年(\d{1,2})月(\d{1,2})日', lambda m: f'{m[1]}-{int(m[2]):02d}-{int(m[3]):02d}', value)
        text = re.sub(r'(\d{1,2})月(\d{1,2})日', lambda m: f'{m[1]}/{m[2]}' + (' (year unstated)' if l=='en' else ' (연도 미표기)'), text)
        for a,b in [('版本更新后',' after update' if l=='en' else ' 업데이트 후'),('更新后',' after update' if l=='en' else ' 업데이트 후'),('期间限时上架',' · limited availability' if l=='en' else ' · 기간 한정'),('至',' — '),('~',' — '),('时',':00')]: text=text.replace(a,b)
        result[l] = text
    return result

target = SITE / 'public/data/wiki'
target.mkdir(parents=True, exist_ok=True)
manifest, added, matched, missing, unmatched_lines = [], [], [], [], []
for entry, category in entries:
    title = entry['title']; r = by_title.get(title)
    expected_category = {'sets':'outfit','weapon':'weapon_skin','effect':'effect','mount':'mount'}[category]
    candidates = {cid for cid in names.get(normalize(title), set()) if by_id[cid]['category'] == expected_category}
    if title in identity_map:
        candidates = {identity_map[title]['cosmeticId']}
        assert by_id[next(iter(candidates))]['category'] == expected_category
    assert len(candidates) <= 1, (title, candidates)
    if candidates:
        cid = next(iter(candidates)); c = by_id[cid]
        (added if c.get('wikiOnly') else matched).append(cid)
    else:
        slug = re.sub(r'[^a-z0-9]+', '-', romanize(title).lower()).strip('-')
        cid = 'wiki-' + (slug or hashlib.sha256(title.encode()).hexdigest()[:12])
        if cid in by_id: cid += '-' + hashlib.sha256(title.encode()).hexdigest()[:6]
        assert cid not in by_id, title
        source_id = 'huiji-' + cid.removeprefix('wiki-')
        research['sources'].append({'id':source_id,'url':url(title) if r else url('外观' if category=='sets' else '外观/武器'), 'publisher':'燕云十六声中文维基 contributors', 'server':'CN', 'titleOriginal':title, 'displayedPublicationDate':None, 'evidenceTier':'C', 'kind':'community'})
        c = {'id':cid,'nameOriginal':title,'romanization':romanize(title),'category':{'sets':'outfit','weapon':'weapon_skin','effect':'effect','mount':'mount'}[category], 'sourceId':source_id,'wikiOnly':True,'officialNameEn':None,'officialNameKo':None,
             'cnRelease':{'date':None,'precision':'unknown','timezone':None,'contextual':False,'basis':'Community wiki reference; official release not independently verified.'},
             'acquisition':{'kind':'unknown','pricing':'unknown','amount':None,'regularAmount':None,'currencyOriginal':None,**pair('Acquisition not independently verified.', '획득 정보는 공식 자료로 확인 중입니다.'),'location':{'original':'未核实',**pair('Not verified','확인 중')},'conditions':pair('Community acquisition notes, where available, appear in the wiki section.','위키에 기재된 획득 정보는 아래 참고 항목에서 확인할 수 있습니다.')},
             'global':{'status':'unknown','releaseDate':None,'officialName':None},'images':[],'officialVideos':[],'mediaStatus':'pending',
             'namingNote':pair('Provisional reading of the Chinese identifier; an official global name has not been verified.','공식 한국어 명칭 미확인으로 중국 원명을 표기합니다.')}
        research['cosmetics'].append(c); by_id[cid] = c
        names[normalize(title)] = {cid}
        localizations[cid] = {'koName':title,'description':pair('A community-documented appearance. Explore its wiki details and keep regional release evidence separate.','커뮤니티 위키에 기록된 외관입니다. 구성과 참고 정보를 살펴보고 서버별 출시 근거를 함께 확인하세요.')}
        added.append(cid)
    c['wikiDetails'] = True
    if title != c['nameOriginal'] and title not in c.get('searchAliases',[]):
        c.setdefault('searchAliases',[]).append(title)
    fields = {}
    for line in r['text'].splitlines() if r else []:
        if '\t' in line:
            key, value = line.split('\t',1)
            fields[key] = value.strip()
    grade = fields.get('等级') or next((line.strip() for line in r['text'].splitlines()[:3] if line.strip() in GRADES), None) if r else None
    flags = {key: True if fields.get(label)=='✔' else False if fields.get(label)=='✘' else None for key,label in [('dye','染色'),('tailoring','裁造'),('gifting','赠送'),('trading','交易')]}
    components = []
    if r and '部件一览' in r['text']:
        block = r['text'].split('部件一览',1)[1].split('实装效果')[0]
        for line in block.splitlines():
            line=line.strip()
            if not line or line.startswith(('结算演出','风华值','女号','合计','集齐套装')): continue
            # One legacy article has parallel male/female columns, not four parts.
            parallel = re.fullmatch(r'([^\t]+)\t(\d+)\t\1\t\2',line)
            match = parallel or re.fullmatch(r'(.+?)\s+(\d+)',line)
            if not match:
                if line: unmatched_lines.append({'set':title,'line':line,'reason':'No value; possible empty template slot. Not asserted as a component.'})
                continue
            label,score=match[1],int(match[2]); linked=next((x for x in r.get('components',[]) if x['label']==label),None)
            components.append({'nameOriginal':label,'label':slot_label(label),'styleScore':score,'sourceUrl':url(linked['title']) if linked and '页面不存在' not in linked['title'] else None})
    score=fields.get('风华值'); score=int(score) if score and score.isdigit() else None
    reward=fields.get('集齐奖励',fields.get('收集奖励',''))
    reward_value={'amount':100,'currencyOriginal':'长鸣玉','currency':pair('Echo Jade','장명옥')} if reward in ['100长鸣玉','长鸣玉\xa0x100'] else None
    method=fields.get('获取方式',fields.get('具体获取方式'))
    animation=fields.get('结算演出'); animation_points=re.search(r'(\d+)\s*风华',animation or '')
    details={'schemaVersion':1,'cosmeticId':cid,'titleOriginal':title,'sourceUrl':url(title) if r else c and ('https://yy16s.huijiwiki.com'+('/wiki/'+quote('外观') if category=='sets' else '/wiki/'+quote('外观/武器'))),
        'revisionUrl':'https://yy16s.huijiwiki.com'+r['revision'] if r and r.get('revision') else None,'checkedAt':'2026-09-13','license':'CC BY-NC-SA 3.0','articleAvailable':bool(r),'category':category,
        'grade':GRADES.get(grade),'gradeOriginal':grade,'styleScore':score,'flags':flags,'components':components,
        'reportedComponentCount':int(fields['部件数量']) if fields.get('部件数量','').isdigit() else int(fields['数量部件']) if fields.get('数量部件','').isdigit() else None,
        'collectionReward':reward_value,'resultsAnimation':{'available':True,'styleScore':int(animation_points[1]) if animation_points else None} if animation and animation.startswith('有') else None,
        'acquisition':{'original':method,**method_label(method)} if method else None,
        'timing':{'original':fields['上线时间'],**timing_label(fields['上线时间']),'timezone':None} if fields.get('上线时间') else None,
        'weapon':{'original':fields['兵器'],**WEAPONS[fields['兵器']]} if fields.get('兵器') else None,
        'martialArt':fields.get('武学'),'replacedMove':fields.get('替换的招式'),
        'mountType':{'original':fields['类型'],**(pair('Mechanical mount','기교 탈것') if fields['类型']=='坐骑·奇巧' else pair('Horse','말'))} if fields.get('类型') else None,
        'sourceFields':fields}
    if title=='芝兰自芳':
        details['additionalNote']=pair('The wiki lists 325 style points per body type and 20 for set completion, plus a CN¥68 battle pass price. This is not a standalone outfit price.','위키에는 체형별 풍화치 325점과 세트 완성 20점, 시즌 패스 가격 68위안이 기재되어 있습니다. 의상 단품 가격이 아닙니다.')
    if not r: missing.append(title)
    write(target/(cid+'.json'),details)
    manifest.append({'cosmeticId':cid,'titleOriginal':title,'articleAvailable':bool(r),'componentCount':len(components)})

write(SITE/'content/research.json',research)
write(SITE/'content/localizations.json',localizations)
write(SNAPSHOT/'integration.json',{'checkedAt':'2026-09-13','catalogTotal':len(research['cosmetics']),'references':len(manifest),'detailedArticles':len(records),'added':added,'matched':matched,'missingArticles':missing,'components':sum(x['componentCount'] for x in manifest),'excludedEmptyRows':unmatched_lines,'records':manifest})
print(json.dumps({'catalog':len(research['cosmetics']),'references':len(manifest),'added':len(added),'matched':len(matched),'components':sum(x['componentCount'] for x in manifest),'missing':len(missing)},ensure_ascii=False))
