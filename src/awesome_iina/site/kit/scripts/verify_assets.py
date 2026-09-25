#!/usr/bin/env python3
"""Verify this brand kit without executing the archived kit or contacting a service."""
from __future__ import annotations
import argparse,hashlib,io,json,re,struct,sys
from collections import Counter
from pathlib import Path
from urllib.parse import urlsplit,urljoin,unquote
from xml.etree import ElementTree as ET
from html.parser import HTMLParser
import cairosvg
import numpy as np
from PIL import Image

class Tags(HTMLParser):
 def __init__(self):super().__init__();self.nodes=[]
 def handle_starttag(self,tag,attrs):self.nodes.append((tag,dict(attrs)))

def digest(path):return hashlib.sha256(path.read_bytes()).hexdigest()
def luminance(h):
 rgb=[int(h[i:i+2],16)/255 for i in (1,3,5)]
 lin=[v/12.92 if v<=.04045 else ((v+.055)/1.055)**2.4 for v in rgb]
 return sum(v*w for v,w in zip(lin,[.2126,.7152,.0722]))
def contrast(a,b):
 x,y=sorted([luminance(a),luminance(b)]);return(y+.05)/(x+.05)

def verify(root):
 checks=[]
 def check(name,passed,detail):checks.append({'id':name,'pass':bool(passed),'detail':detail})
 old=root/'archive/original-kit'
 # Supplied source checksums are evidence; archived scripts are not executed.
 matches=0
 for line in (old/'SHA256SUMS').read_text().splitlines():
  h,p=line.split(maxsplit=1);p=p.lstrip('*');target=old/p
  ok=target.is_file() and digest(target)==h;matches+=int(ok)
 check('original-checksums',matches==36,{'matching':matches,'expected':36})
 check('preserved-hero',digest(root/'assets/brand/readme-hero-retained.png')==digest(old/'exports/headers/readme-hero-1800x600.png'),'Retained export is byte-identical.')
 # All current raster dimensions and profile/alpha properties.
 inventory=[]
 for p in sorted((root/'assets/brand').glob('*')):
  if p.suffix=='.png':
   with Image.open(p) as im:
    im.load();a=im.convert('RGBA').getchannel('A').getextrema()
    item={'path':p.relative_to(root).as_posix(),'size':list(im.size),'mode':im.mode,'alpha_extrema':list(a),'icc_profile':bool(im.info.get('icc_profile')),'bytes':p.stat().st_size}
    inventory.append(item)
    if 'retained' not in p.name:check('srgb:'+p.name,im.info.get('icc_profile') is not None,'New PNG has explicit ICC profile.')
    if p.name.startswith('symbol-'):check('alpha:'+p.name,a==(0,255),'Symbol export includes real transparency and opaque artwork.')
    if p.name.startswith('favicon-'):
     n=int(p.stem.split('-')[1].split('@')[0]);scale=2 if '@2x' in p.stem else 1
     check('dimensions:'+p.name,im.size==(n*scale,n*scale),list(im.size))
 social=root/'assets/brand/github-social-preview-1280x640.png'
 check('github-image',Image.open(social).size==(1280,640) and social.stat().st_size<1_000_000,{'dimensions':[1280,640],'bytes':social.stat().st_size,'reference':'GitHub social-preview guidance'})
 # Exact ICO frame construction (includes native optical differences).
 ico=Image.open(root/'assets/brand/favicon.ico');ico_sizes=sorted(ico.ico.sizes())
 check('ico-sizes',ico_sizes==[(n,n) for n in [16,24,32,48,64,128,256]],ico_sizes)
 for w,h in ico_sizes:
  actual=ico.ico.getimage((w,h)).convert('RGBA');expected=Image.open(root/f'assets/brand/favicon-{w}.png').convert('RGBA')
  check('ico-pixels:'+str(w),np.array_equal(np.asarray(actual),np.asarray(expected)),'Frame equals the corresponding optically selected PNG, not an automatic resample of one master.')
 for n in [16,24]:
  small=Image.open(root/f'assets/brand/favicon-{n}.png').convert('RGBA')
  large=Image.open(root/'assets/brand/favicon-32.png').convert('RGBA').resize((n,n),Image.Resampling.LANCZOS)
  check('distinct-optical:'+str(n),not np.array_equal(np.asarray(small),np.asarray(large)),'Small export is not the 32px image resampled.')
 # Genuine geometry-only marks; typography editability explicitly separated.
 ns='{http://www.w3.org/2000/svg}'
 for p in sorted((root/'assets/brand').glob('symbol-*.svg')):
  svg=ET.parse(p).getroot()
  check('path-source:'+p.name,len(svg.findall('.//'+ns+'path'))>=2 and not svg.findall('.//'+ns+'image') and not svg.findall('.//'+ns+'text'),'No raster, no visible text and no external font in standalone mark.')
 editable=ET.parse(root/'source/social-card-editable.svg').getroot()
 check('editable-social-text',len(editable.findall('.//'+ns+'text'))==4,[t.text for t in editable.findall('.//'+ns+'text')])
 production=ET.parse(root/'assets/brand/github-social-preview.svg').getroot()
 check('outlined-social-type',len(production.findall('.//'+ns+'text'))==0 and bool(production.findall('.//'+ns+'path')),'Outlined production type. The one embedded background image is documented raster, not false vector art.')
 # All four OG properties and chosen output geometry.
 head=Tags();head.feed((root/'integration/website-head.html').read_text())
 props={a['property']:a.get('content') for t,a in head.nodes if t=='meta' and 'property' in a}
 check('og-required',all(props.get(k) for k in ['og:title','og:type','og:image','og:url']),props)
 dep=json.loads((root/'source/deployment.json').read_text())
 check('canonical-url',props['og:url']==dep['project_url'] and props['og:type']=='website','Intended URL checked against configuration; public reachability not tested.')
 check('og-dimensions',props.get('og:image:width')=='1280' and props.get('og:image:height')=='640',{'image':props.get('og:image')})
 check('no-output-placeholders',all('{{' not in (v or '') and 'YOUR_DOMAIN' not in (v or '') for v in props.values()),'Source template placeholders are resolved in delivered head.')
 manifest=json.loads((root/'assets/brand/site.webmanifest').read_text())
 for icon in manifest['icons']:
  p=root/'assets/brand'/icon['src'];check('manifest:'+icon['src'],p.exists() and 'x'.join(map(str,Image.open(p).size))==icon['sizes'] and icon['purpose']=='any',icon)
 # Correct manifest identity uses the origin of the resolved launch URL, not the manifest folder.
 manifest_url=urljoin(dep['project_url'],'assets/brand/site.webmanifest')
 start=urljoin(manifest_url,manifest['start_url']);parsed=urlsplit(start)
 origin=f'{parsed.scheme}://{parsed.netloc}/'
 check('manifest-identity',isinstance(manifest.get('id'),str) and manifest['id']==dep['app_id'] and urljoin(origin,manifest['id'])==urljoin(origin,dep['app_id']),{'id':manifest['id'],'resolved_id':urljoin(origin,manifest['id']),'method':'Standards-based URL calculation; native processing not asserted'})
 check('manifest-launch-and-scope',start==dep['project_url'] and urljoin(manifest_url,manifest['scope'])==dep['project_url'],{'start':start,'scope':urljoin(manifest_url,manifest['scope'])})
 check('manifest-template-policy',json.loads((root/'source/manifest.template.json').read_text())['id']=='{{APP_ID}}','Generated ID is configured explicitly; no version/base-path inference.')
 for name in ['wordmark-dark-editable.svg','wordmark-light-editable.svg','social-card-editable.svg']:
  texts=ET.parse(root/'source'/name).getroot().findall('.//'+ns+'text')
  check('editable-kerning-css:'+name,bool(texts) and all(t.get('style')=='font-kerning:none' and t.get('font-kerning') is None for t in texts),'Supported CSS policy; actual glyph parity is checked separately in Chromium.')
 from brandkit.core import selected_asset_records
 selected={r['path'] for r in selected_asset_records(root)}
 check('primary-shipping-selection','assets/brand/readme-hero-retained.png' not in selected and len(selected)==35,'Historical hero remains optional, not default installation/delivery.')
 demo=(root/'integration/demo/index.html').read_text()
 check('primary-demo-selection','wordmark-dark.svg' in demo and 'wordmark-light.svg' in demo and 'readme-hero-retained.png' not in demo,'Primary demo uses current wordmarks and live copy.')
 predecessor=json.loads((root/'provenance/v2.1.0-verification/ASSET-MANIFEST.json').read_text())
 artwork=[r for r in predecessor['assets'] if r['format'] in ['png','svg','ico']]
 check('production-artwork-preserved',len(artwork)==35 and all(digest(root/r['path'])==r['sha256'] for r in artwork),'All 35 original production artwork files are unchanged; only metadata/exchange sources change.')
 # Planned dependencies, not fake linear critical paths.
 plan=json.loads((root/'docs/RELEASE-PLAN.json').read_text());tasks={x['id']:x for x in plan['tasks']};visiting=set();done=set()
 def visit(i):
  if i in visiting:raise ValueError('Dependency cycle')
  if i in done:return
  visiting.add(i)
  for parent in tasks[i]['depends_on']:visit(parent)
  visiting.remove(i);done.add(i)
 try:
  for i in tasks:visit(i)
  acyclic=True
 except (KeyError,ValueError):acyclic=False
 check('task-dag',acyclic and 'T04' not in tasks['T05']['depends_on'] and tasks['T06A']['depends_on']==['T01'],'Social and README work are parallel; metadata preparation does not await icon exports.')
 # Check the known HTML interfaces, not the archived review pages.
 references=[]
 for file in [root/'review/index.html',root/'START-HERE.html',root/'integration/demo/index.html']:
  tags=Tags();tags.feed(file.read_text())
  for tag,a in tags.nodes:
   target=a.get('src') or (a.get('href') if tag in ('a','link') else None)
   if not target or target.startswith(('#','data:')) or urlsplit(target).scheme:continue
   dest=(file.parent/unquote(target.split('#')[0])).resolve()
   references.append({'file':str(file.relative_to(root)),'target':target,'exists':dest.is_file()})
 check('local-html-references',all(x['exists'] for x in references),references)
 # No font binaries, including disguised font file signatures.
 fontfiles=[]
 for p in root.rglob('*'):
  if p.is_file():
   with p.open('rb') as f:magic=f.read(4)
   if p.suffix.lower() in {'.otf','.ttf','.woff','.woff2','.ttc'} or magic in [b'OTTO',b'wOFF',b'wOF2',b'ttcf',b'\x00\x01\x00\x00']:fontfiles.append(str(p.relative_to(root)))
 check('no-font-binaries',not fontfiles,fontfiles)
 tokens=json.loads((root/'source/tokens.json').read_text());c=tokens['colors']
 contrast_values={k:round(contrast(c[k],c['background']),3) for k in ['foreground','secondary','cyan','violet']}
 check('intended-role-text-contrast',contrast_values['secondary']>=4.5,{'ratios':contrast_values,'method':'Known intended solid colors in assigned sRGB, not antialiased edge samples or whole-page certification.'})
 results={'schema_version':1,'release':json.loads((root/'source/release.json').read_text())['revision'],'date':'2026-09-16','checks_passed':sum(x['pass'] for x in checks),'checks_total':len(checks),'status':'passed' if all(x['pass'] for x in checks) else 'failed','checks':checks,'asset_inventory':inventory,'limitations':['No live GitHub upload','No real browser-tab chrome selection verification','No Safari/iOS device test','No human recognition study','No trademark clearance or full C2PA validation'],'type_of_claim':'Technical artifact checks, not human brand approval'}
 return results

def main():
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('--root',type=Path,default=Path(__file__).resolve().parents[1]);p.add_argument('--output',type=Path)
 a=p.parse_args();root=a.root.resolve();report=verify(root);out=a.output or root/'qa/validation.json';out.parent.mkdir(exist_ok=True,parents=True);out.write_text(json.dumps(report,indent=2)+'\n')
 print(f"{report['checks_passed']}/{report['checks_total']} passed; {report['status']}")
 for c in report['checks']:
  if not c['pass']:print('FAIL',c['id'],c['detail'])
 raise SystemExit(0 if report['status']=='passed' else 1)
if __name__=='__main__':main()
