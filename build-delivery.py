from pathlib import Path
import html,re,base64,zipfile,mimetypes
root=Path(__file__).resolve().parent;p=root/'dist';md=(p/'validation.md').read_text();out=[];table=False;ul=False
for line in md.splitlines():
 if not line.startswith('|') and table:out.append('</tbody></table></div>');table=False
 if not line.startswith('- ') and ul:out.append('</ul>');ul=False
 def fmt(s):
  s=html.escape(s);s=re.sub(r'\*\*(.*?)\*\*',r'<strong>\1</strong>',s);return re.sub(r'`(.*?)`',r'<code>\1</code>',s)
 if line.startswith('|'):
  cells=[x.strip() for x in line.strip('|').split('|')]
  if all(re.fullmatch(r'[-: ]+',x) for x in cells):continue
  if not table:out.append('<div class="table-wrap"><table><tbody>');table=True;tag='th'
  else:tag='td'
  out.append('<tr>'+''.join(f'<{tag}>{fmt(x)}</{tag}>' for x in cells)+'</tr>')
 elif line.startswith('#'):
  k=len(line)-len(line.lstrip('#'));out.append(f'<h{k}>{fmt(line[k:].strip())}</h{k}>')
 elif line.startswith('- '):
  if not ul:out.append('<ul>');ul=True
  out.append('<li>'+fmt(line[2:])+'</li>')
 elif line.strip():out.append('<p>'+fmt(line)+'</p>')
body=''.join(out)
actions='<div class="actions"><a class="btn red" href="test-log-template.csv" download>Download blank test log ↓</a><a class="btn white" href="validation.md" download>Documentation Markdown ↓</a></div>'
(p/'validation.html').write_text('<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>ComboFlow — Validation kit</title><link rel="stylesheet" href="style.css"></head><body><main class="doc"><a href="index.html">← Back to prototype</a>'+actions+body+'</main></body></html>')
standalone=(p/'index.html').read_text();standalone=re.sub(r'<link rel="stylesheet" href="style.css[^\"]*">','<style>'+(p/'style.css').read_text()+'</style>',standalone)
for name in ['engine','kitchen','app']:
 standalone=re.sub(r'<script src="'+name+r'.js[^\"]*"></script>',lambda m:'<script>'+(p/(name+'.js')).read_text()+'</script>',standalone)
standalone=standalone.replace('href="validation.html" target="_blank"','href="#validation" onclick="document.getElementById(\'guide\').showModal();return false"')
dialog='<dialog id="guide" style="max-width:1000px;width:95vw;height:90vh;border:1px solid #ddd;border-radius:12px"><button class="btn red" onclick="document.getElementById(\'guide\').close()" style="position:sticky;top:0">Close validation kit ×</button><div class="doc">'+actions+body+'</div></dialog>'
for filename,mime in [('test-log-template.csv','text/csv'),('validation.md','text/markdown')]:
 data=base64.b64encode((p/filename).read_bytes()).decode();dialog=dialog.replace('href="'+filename+'" download','href="data:'+mime+';base64,'+data+'" download="'+filename+'"')
standalone=standalone.replace('</body>',dialog+'</body>').replace('href="index.html"','href="#" onclick="resetRun();return false"')
# Embed local brand assets and licensed fonts so the single HTML is truly offline.
for asset in sorted((p/'assets').iterdir()):
 if asset.suffix in ['.jpg','.png','.svg','.ttf','.woff','.woff2']:
  mime={'.ttf':'font/ttf','.svg':'image/svg+xml'}.get(asset.suffix,mimetypes.guess_type(asset.name)[0])
  data='data:'+mime+';base64,'+base64.b64encode(asset.read_bytes()).decode()
  standalone=standalone.replace('assets/'+asset.name,data)
licenses='\n\n'.join((p/'assets'/f).read_text() for f in ['Oswald-OFL.txt','Roboto-OFL.txt'])
standalone=standalone.replace('</body>','<details class="font-license"><summary>Font licenses · Oswald / Roboto</summary><pre>'+html.escape(licenses)+'</pre></details></body>')
(p/'ComboFlow-standalone.html').write_text(standalone)
with zipfile.ZipFile(root.parent/'ComboFlow-prototype.zip','w',zipfile.ZIP_DEFLATED) as z:
 for f in p.rglob('*'):
  if f.is_file():z.write(f,'ComboFlow/'+str(f.relative_to(p)))
 z.writestr('ComboFlow/README.txt','Open index.html with a browser, keeping the folder together. Or send ComboFlow-standalone.html as one offline file. Validation kit: validation.html. Blank test log: test-log-template.csv. No real orders or user-study results.');z.writestr('ComboFlow/source-checks/logic-tests.cjs',(root/'logic-tests.cjs').read_text().replace("./dist/engine.js","../engine.js"))
print('Built documentation, single-file offline prototype and ZIP.')

with zipfile.ZipFile(root.parent/'ComboFlow-prototype.zip','a',zipfile.ZIP_DEFLATED) as z:
 z.writestr('ComboFlow/source-checks/kitchen-tests.cjs',(root/'kitchen-tests.cjs').read_text().replace('./dist/kitchen.js','../kitchen.js').replace('./dist/engine.js','../engine.js'))
