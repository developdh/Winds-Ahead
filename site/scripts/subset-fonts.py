"""Build renamed, page-text subsets. Requires fonttools[woff], brotli.
Pass official SUIT variable WOFF2 and Noto Serif KR variable TTF paths.
The unmodified source files are not committed; retain their OFL files.
"""
from pathlib import Path
from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
import sys
root=Path(__file__).resolve().parent.parent
text=''.join(chr(i) for i in range(32,127))+'燕雲鏡연운경'
for folder in ['app','components','lib','content']:
 for p in (root/folder).rglob('*'):
  if p.suffix in {'.tsx','.ts','.mjs','.json'} and '/ui/' not in str(p):text+=p.read_text()
for file,out,family,weights in [(sys.argv[1],'winds-ui.woff2','Winds UI',{'wght':(350,600)}),(sys.argv[2],'winds-heading.woff2','Winds Heading',{'wght':500})]:
 f=TTFont(file,lazy=False)
 options=subset.Options();options.flavor='woff2';options.name_IDs=['*'];options.name_legacy=True;options.name_languages=['*']
 s=subset.Subsetter(options=options);s.populate(text=text);s.subset(f)
 if family=='Winds Heading':f=instantiateVariableFont(f,weights,inplace=True)
 for record in f['name'].names:
  if record.nameID in [1,4,6,16]:record.string=(family.replace(' ','') if record.nameID==6 else family).encode(record.getEncoding())
 f.flavor='woff2';f.save(root/'public/fonts'/out)
 print(out,(root/'public/fonts'/out).stat().st_size)
