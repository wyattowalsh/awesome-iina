"""Inventory current production assets, not archived alternatives."""
from pathlib import Path
import json,hashlib,argparse,csv,io
from PIL import Image
from xml.etree import ElementTree as ET

def inventory(root):
 entries=[]
 for p in sorted((root/'assets/brand').iterdir()):
  if not p.is_file():continue
  e={'path':p.relative_to(root).as_posix(),'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'format':p.suffix[1:]}
  if p.suffix=='.png':
   im=Image.open(p);e|={'width':im.width,'height':im.height,'mode':im.mode,'alpha_extrema':list(im.convert('RGBA').getchannel('A').getextrema()),'color_profile':'embedded ICC' if im.info.get('icc_profile') else 'untagged retained original'}
  if p.suffix=='.svg':
   t=ET.parse(p).getroot();ns='{http://www.w3.org/2000/svg}'
   e|={'viewBox':t.get('viewBox'),'embedded_rasters':len(t.findall('.//'+ns+'image')),'text_elements':len(t.findall('.//'+ns+'text')),'path_elements':len(t.findall('.//'+ns+'path'))}
  if p.suffix=='.ico':e['frames']=[list(s) for s in sorted(Image.open(p).ico.sizes())]
  if 'social' in p.name or 'open-graph' in p.name:
   e|={'role':'canonical social composition','sources':['source/social-layout.json','source/geometry.json','source/tokens.json','source/social-background.png'],'design_family':'Indexed Media v2'}
  elif 'retained' in p.name:
   e|={'role':'optional supplementary illustration; not primary mark','sources':['archive/original-kit/exports/headers/readme-hero-1800x600.png'],'design_family':'preserved v1 illustration'}
  elif 'manifest' in p.name:
   e|={'role':'conditional website integration','sources':['source/manifest.template.json','source/deployment.json','scripts/brandkit/core.py'],'purpose_claim':'any, not maskable'}
  else:e|={'role':'canonical compact identity or optical derivative','sources':['source/geometry.json','source/tokens.json'],'design_family':'Indexed Media v2'}
  entries.append(e)
 report={'schema_version':2,'release':json.loads((root/'source/release.json').read_text())['revision'],'identity_release':'2.0.0-review.1','date':'2026-09-16','status':'implementation candidate; owner approval and public platform tests remain pending','asset_count':len(entries),'original_preservation_root':'archive/original-kit','font_binaries_distributed':False,'assets':entries}
 (root/'ASSET-MANIFEST.json').write_text(json.dumps(report,indent=2)+'\n')
 buf=io.StringIO();w=csv.DictWriter(buf,['path','format','bytes','width','height','role','sha256'],extrasaction='ignore');w.writeheader();w.writerows(entries)
 (root/'ASSET-INDEX.csv').write_text(buf.getvalue())
 return report
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--root',type=Path,default=Path(__file__).resolve().parents[1]);a=p.parse_args();print('Current production assets:',inventory(a.root.resolve())['asset_count'])
