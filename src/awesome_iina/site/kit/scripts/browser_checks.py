#!/usr/bin/env python3
"""Local Chromium rendering and routing proofs. No GitHub writes or external requests."""
from __future__ import annotations
import argparse,json,threading,shutil,re,base64,mimetypes,urllib.request
from pathlib import Path
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from urllib.parse import urlsplit,unquote
from playwright.sync_api import sync_playwright


def inline_document(file:Path,include_images:bool=True)->str:
 """Render known local bytes without navigating against managed browser network policy."""
 text=file.read_text(encoding='utf-8')
 # Tab-icon/manifest selection cannot be tested by set_content; exclude those fetch hints.
 text=re.sub(r'<link\b[^>]*rel="(?:icon|apple-touch-icon|manifest)"[^>]*>', '', text, flags=re.I)
 def replace(match):
  src=match.group(1)
  if not include_images:return 'src="data:,"'
  if urlsplit(src).scheme or src.startswith('data:'):return match.group(0)
  target=(file.parent/unquote(src)).resolve()
  mime=mimetypes.guess_type(target)[0] or 'application/octet-stream'
  data=base64.b64encode(target.read_bytes()).decode()
  return f'src="data:{mime};base64,{data}"'
 return re.sub(r'src="([^"]+)"',replace,text)


def run(root:Path,chromium:str):
 out=root/'qa/previews';out.mkdir(parents=True,exist_ok=True)
 sizes=[16,24,32,48,64,128]
 def row(title,old=False):
  body=''
  for n in sizes:
   if old:
    url=f'../archive/original-kit/exports/web/favicon-{n}x{n}.png' if n<=64 else '../archive/original-kit/exports/icons/simplified-icon-256.png'
   else:url=f'../assets/brand/favicon-{n}.png'
   body+=f'<figure><img src="{url}" width="{n}" height="{n}" alt="{title} {n}px"><figcaption>{n} CSS px</figcaption></figure>'
  return f'<h2>{title}</h2><div class="row">{body}</div>'
 proof='''<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Native-size icon proof</title><style>*{box-sizing:border-box}body{margin:0;background:#fff;color:#132555;font:16px/1.4 system-ui;padding:28px}h1{font-size:22px;margin:0 0 12px}h2{font-size:16px;margin:18px 0 12px}.row{display:flex;gap:52px;align-items:flex-start;min-height:178px}.row figure{margin:0;min-width:80px}.row img{display:block}.row figcaption{margin-top:10px;font-size:12px}.dark{background:#080f2b;color:#f5faff;padding:18px;margin:0 -4px}.density{display:flex;gap:48px;align-items:center;min-height:80px}.density figure{margin:0;font-size:12px}.density img{display:block;margin-bottom:10px}</style><h1>Native CSS icon comparison</h1><p>Original control vs. deliberately drawn optical exports. Image elements, not browser-tab chrome. DPR is recorded in the result file.</p>'''
 proof+=row('Original control',True)+row('Revised — light surround')+'<div class="dark">'+row('Revised — dark surround')+'</div><h2>Same CSS size, different source density</h2><div class="density">'
 for n in [16,24,32]:
  for suffix in ['', '@2x']:
   proof+=f'<figure><img src="../assets/brand/favicon-{n}{suffix}.png" width="{n}" height="{n}" alt="{n} CSS px from {1 if not suffix else 2}x source">{n} CSS / {"1×" if not suffix else "2×"} source</figure>'
 proof+='</div></html>'
 (root/'qa/native-proof.html').write_text(proof)
 # A proof built from the actual head snippet exercises the intended site base path locally.
 head=(root/'integration/website-head.html').read_text()
 (root/'qa/production-head-proof.html').write_text('<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Metadata route proof</title>'+head+'</head><body><h1>Metadata route proof</h1><p>Local server mapping, not the public site.</p></body></html>')
 class Handler(SimpleHTTPRequestHandler):
  def __init__(self,*a,**kw):super().__init__(*a,directory=str(root),**kw)
  def log_message(self,*a):pass
  def translate_path(self,path):
   if path.startswith('/awesome-iina/'):path='/'+path[len('/awesome-iina/'):]
   return super().translate_path(path)
 server=ThreadingHTTPServer(('127.0.0.1',0),Handler)
 thread=threading.Thread(target=server.serve_forever,daemon=True);thread.start()
 base=f'http://127.0.0.1:{server.server_port}';checks=[];shots=[];console_errors=[];blocked=[];measures=[]
 def check(name,ok,details):checks.append({'id':name,'pass':bool(ok),'details':details})
 try:
  with sync_playwright() as p:
   browser=p.chromium.launch(executable_path=chromium,headless=True,args=['--no-sandbox'])
   version=browser.version
   for dpr in [1,2]:
    context=browser.new_context(viewport={'width':1440,'height':1000},device_scale_factor=dpr)
    def route(req):
     u=urlsplit(req.request.url)
     if u.scheme=='data' or u.hostname in ['127.0.0.1','localhost']:req.continue_()
     else:blocked.append(req.request.url);req.abort()
    context.route('**/*',route)
    page=context.new_page();page.on('pageerror',lambda e:console_errors.append(str(e)))
    page.set_content(inline_document(root/'review/index.html'));page.wait_for_load_state('networkidle')
    check(f'gallery-images-dpr{dpr}',page.locator('img').evaluate_all('(xs)=>xs.every(x=>x.complete && x.naturalWidth>0)'),'All current and control images loaded locally.')
    check(f'gallery-no-overflow-dpr{dpr}',page.evaluate('document.documentElement.scrollWidth<=innerWidth'),'Desktop body has no horizontal overflow; native strips may intentionally scroll on mobile.')
    path=out/f'gallery-desktop-dpr{dpr}.png';page.screenshot(path=str(path),full_page=False);shots.append(str(path.relative_to(root)))
    if dpr==1:
     page.locator('#theme').click();check('theme-toggle',page.locator('body').get_attribute('class')=='light' and page.locator('#theme').get_attribute('aria-pressed')=='true','Toggle updates visible theme and accessibility state.')
     path=out/'gallery-light.png';page.screenshot(path=str(path),full_page=False);shots.append(str(path.relative_to(root)))
     page.set_viewport_size({'width':390,'height':844});page.set_content(inline_document(root/'review/index.html'));page.wait_for_load_state('networkidle')
     check('gallery-mobile-overflow',page.evaluate('document.documentElement.scrollWidth<=innerWidth'),'390px viewport, no page-wide overflow.')
     path=out/'gallery-mobile-390.png';page.screenshot(path=str(path),full_page=False);shots.append(str(path.relative_to(root)))
    page.set_viewport_size({'width':980,'height':880});page.set_content(inline_document(root/'qa/native-proof.html'));page.wait_for_load_state('networkidle')
    data=page.locator('img').evaluate_all('(xs)=>xs.map(x=>({label:x.getAttribute("alt"),natural:[x.naturalWidth,x.naturalHeight],css:[x.getBoundingClientRect().width,x.getBoundingClientRect().height],declared:[Number(x.getAttribute("width")),Number(x.getAttribute("height"))]}))')
    measures.append({'dpr':dpr,'images':data})
    check(f'native-size-declarations-dpr{dpr}',all(i['css']==i['declared'] for i in data),f'{len(data)} placements match stated CSS sizes.')
    path=out/f'native-icons-dpr{dpr}.png';page.screenshot(path=str(path),full_page=True);shots.append(str(path.relative_to(root)))
    if dpr==1:
     cdp=context.new_cdp_session(page)
     for kind in ['achromatopsia','protanopia','deuteranopia','tritanopia']:
      cdp.send('Emulation.setEmulatedVisionDeficiency',{'type':kind})
      path=out/f'icons-simulated-{kind}.png';page.screenshot(path=str(path),full_page=True);shots.append(str(path.relative_to(root)))
     cdp.send('Emulation.setEmulatedVisionDeficiency',{'type':'none'})
     # A real responsive live-text integration page. No external assets needed.
     for width in [390,1200]:
      page.set_viewport_size({'width':width,'height':900});page.set_content(inline_document(root/'integration/demo/index.html'));page.wait_for_load_state('networkidle')
      check(f'readme-live-copy-{width}','Independent IINA' in page.locator('h1').inner_text() and 'Awesome IINA' in page.locator('.role').inner_text() and 'Not affiliated with the IINA project.' in page.locator('body').inner_text(),'Name, role and independence are live HTML.')
      check(f'readme-overflow-{width}',page.evaluate('document.documentElement.scrollWidth<=innerWidth'),'No horizontal page overflow.')
      path=out/f'readme-live-{width}.png';page.screenshot(path=str(path),full_page=True);shots.append(str(path.relative_to(root)))
      check(f'demo-primary-light-{width}',page.locator('.wordmark-light').is_visible() and not page.locator('.wordmark-dark').is_visible(),'Current light-surface wordmark is selected; no old hero is in the demo.')
      page.locator('#theme').click()
      check(f'demo-theme-dark-{width}',page.locator('.wordmark-dark').is_visible() and not page.locator('.wordmark-light').is_visible() and page.locator('#theme').get_attribute('aria-pressed')=='true','Click toggles the real wordmark selection, surroundings and accessible control state.')
      path=out/f'readme-dark-{width}.png';page.screenshot(path=str(path),full_page=True);shots.append(str(path.relative_to(root)))
      page.locator('#theme').click()
      check(f'demo-theme-restored-{width}',page.locator('.wordmark-light').is_visible() and page.locator('#theme').get_attribute('aria-pressed')=='false','Second click restores the light wordmark.')
     page.set_viewport_size({'width':390,'height':844})
     page.set_content(inline_document(root/'integration/demo/index.html',include_images=False));page.wait_for_load_state('networkidle')
     check('images-disabled-meaning',page.locator('h1').is_visible() and page.locator('.role').is_visible() and 'Not affiliated' in page.locator('body').inner_text(),'Image bytes suppressed in local inline proof; essential meaning remains visible.')
     path=out/'readme-images-disabled-390.png';page.screenshot(path=str(path),full_page=True);shots.append(str(path.relative_to(root)))
     page.set_content(inline_document(root/'qa/production-head-proof.html'));page.wait_for_load_state('networkidle')
     props=page.locator('meta[property^="og:"]').evaluate_all('(xs)=>Object.fromEntries(xs.map(x=>[x.getAttribute("property"),x.content]))')
     check('browser-og-fields',all(props.get(k) for k in ['og:title','og:type','og:image','og:url']),props)
     for asset in ['favicon.ico','favicon.svg','apple-touch-icon.png','icon-192.png','icon-512.png','site.webmanifest','github-social-preview-1280x640.png']:
      with urllib.request.urlopen(base+'/awesome-iina/assets/brand/'+asset,timeout=5) as response:
       payload=response.read()
       check('local-http-route:'+asset,response.status==200 and payload==(root/'assets/brand'/asset).read_bytes(),{'status':response.status,'content_type':response.headers.get('content-type'),'method':'Python urllib loopback HTTP; browser policy does not allow localhost navigation','public_host_tested':False})
     # Independent JS URL resolution on generated fixtures: not native installed-manifest processing.
     from brandkit.core import render_site
     cases=[('https://example.org/','/'),('https://example.org/awesome-iina/','/awesome-iina/'),('https://example.org/catalogs/iina/','/ids/iina'),('https://example.org/project-b/','/ids/project-b'),('https://example.org/relocated/','/awesome-iina/')]
     for case_id,(site,identity) in enumerate(cases):
      manifest=json.loads(render_site(root,site,app_id=identity)['site.webmanifest'])
      values=page.evaluate("""({manifest,manifestURL})=>{const start=new URL(manifest.start_url,manifestURL);return {id:new URL(manifest.id,start.origin).href,start:start.href,scope:new URL(manifest.scope,manifestURL).href,icons:manifest.icons.map(i=>new URL(i.src,manifestURL).href)}}""",{'manifest':manifest,'manifestURL':site+'assets/brand/site.webmanifest'})
      expected_origin=site.split('://')[0]+'://'+urlsplit(site).netloc
      check(f'manifest-js-resolution:{case_id}',values['id']==expected_origin+identity and values['start']==site and values['scope']==site and values['icons']==[site+'assets/brand/icon-192.png',site+'assets/brand/icon-512.png'],{'site':site,'configured_identity':identity,'browser_url_results':values,'native_manifest_processing_tested':False})
     # Check source typography bounding boxes with the fonts available on this machine.
     page.set_viewport_size({'width':1280,'height':640});page.set_content('<style>body{margin:0}</style>'+(root/'source/social-card-editable.svg').read_text());page.wait_for_load_state('networkidle')
     bboxes=page.locator('text').evaluate_all('(xs)=>xs.map(x=>{let b=x.getBBox();return {text:x.textContent,bbox:[b.x,b.y,b.width,b.height],family:getComputedStyle(x).fontFamily};})')
     check('editable-text-bounds',len(bboxes)==4 and all(i['bbox'][0]>=0 and i['bbox'][0]+i['bbox'][2]<=1216 and i['bbox'][1]+i['bbox'][3]<=448 for i in bboxes),bboxes)
     path=out/'editable-social-source.png';page.screenshot(path=str(path));shots.append(str(path.relative_to(root)))
    context.close()
   browser.close()
 finally:server.shutdown();server.server_close();thread.join(timeout=3)
 check('no-page-script-errors',not console_errors,console_errors)
 check('no-external-network-requests',not blocked,{'blocked_urls':blocked,'policy':'No browser network navigation. Data URLs contain exact local asset bytes; unexpected requests blocked.'})
 report={'schema_version':1,'release':json.loads((root/'source/release.json').read_text())['revision'],'browser_plugin':'not available; regular Playwright used','date':'2026-09-16','browser':'Chromium '+version,'render_mode':'Playwright set_content + inlined local image bytes. Managed Chromium blocked localhost navigation with ERR_BLOCKED_BY_ADMINISTRATOR; no policy was changed. Loopback serving checked separately with Python urllib.','status':'passed' if all(c['pass'] for c in checks) else 'failed','checks_passed':sum(c['pass'] for c in checks),'checks_total':len(checks),'checks':checks,'screenshots':shots,'native_image_measurements':measures,'limits':['Screenshots use image elements, not browser chrome favicon selection.','Color-vision views are browser simulations, not tests with users.','Canonical URLs are intended configuration. Loopback routes were checked with Python urllib, not browser navigation.','No GitHub upload/unfurl, Safari/iOS device test, calibrated physical-display test or user recognition study.']}
 (root/'qa/browser-results.json').write_text(json.dumps(report,indent=2)+'\n')
 print(f"Browser checks {report['checks_passed']}/{report['checks_total']}: {report['status']}")
 for c in checks:
  if not c['pass']:print('FAIL',c['id'],c['details'])
 return report

if __name__=='__main__':
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('--root',type=Path,default=Path(__file__).resolve().parents[1]);p.add_argument('--chromium',default=shutil.which('chromium'))
 a=p.parse_args()
 if not a.chromium:raise SystemExit('Pass --chromium with an installed Chromium executable. No browser is downloaded by this script.')
 result=run(a.root.resolve(),a.chromium);raise SystemExit(0 if result['status']=='passed' else 1)
