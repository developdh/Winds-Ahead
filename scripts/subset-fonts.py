"""Build renamed, page-text subsets. Requires fonttools[woff], brotli.
Pass official Gowun Dodum Regular TTF and Noto Serif KR variable TTF paths.
The unmodified source files are not committed; retain their OFL files.
"""
from pathlib import Path
from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
import sys
import hashlib,re
import json
root=Path(__file__).resolve().parent.parent
text=''.join(chr(i) for i in range(32,127))+'燕雲鏡연운경'
for folder in ['app','components','lib','content']:
 for p in (root/folder).rglob('*'):
  if p.suffix in {'.tsx','.ts','.mjs','.json'} and '/ui/' not in str(p):text+=p.read_text()
for p in (root/'public/data/wiki').glob('*.json'):
 data=json.loads(p.read_text())
 # Raw source fields are downloadable evidence, not rendered interface text.
 data.pop('sourceFields',None)
 text+=json.dumps(data,ensure_ascii=False)
for file,out,family,weights in [(sys.argv[1],'winds-ui.woff2','Winds UI',{'wght':400}),(sys.argv[2],'winds-heading.woff2','Winds Heading',{'wght':500})]:
 f=TTFont(file,lazy=False)
 options=subset.Options();options.flavor='woff2';options.name_IDs=['*'];options.name_legacy=True;options.name_languages=['*']
 s=subset.Subsetter(options=options);s.populate(text=text);s.subset(f)
 if family=='Winds Heading':f=instantiateVariableFont(f,weights,inplace=True)
 for record in f['name'].names:
  if record.nameID in [1,4,6,16]:record.string=(family.replace(' ','') if record.nameID==6 else family).encode(record.getEncoding())
 f.flavor='woff2';f.save(root/'public/fonts'/out)
 digest=hashlib.sha256((root/'public/fonts'/out).read_bytes()).hexdigest()[:12]
 css=root/'app/globals.css'
 css.write_text(re.sub(r'/fonts/'+re.escape(out)+r'(?:\?v=[a-z0-9-]+)?', '/fonts/'+out+'?v='+digest,css.read_text()))
 print(out,(root/'public/fonts'/out).stat().st_size)
