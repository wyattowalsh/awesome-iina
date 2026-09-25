#!/usr/bin/env python3
"""Build the v2 branding from editable geometry, layout data and preserved artwork.
No downloads or remote writes. Font files are required locally but never packaged.
"""
from __future__ import annotations
import argparse,base64,hashlib,io,json,math,struct,html
from copy import deepcopy
from pathlib import Path
from xml.etree import ElementTree as ET
import cairosvg
import numpy as np
from PIL import Image,ImageCms
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen

ROOT=Path(__file__).resolve().parents[1]
NS='http://www.w3.org/2000/svg';XL='http://www.w3.org/1999/xlink'
ET.register_namespace('',NS); ET.register_namespace('xlink',XL)
# No import-time file mutation. The same builder works with an explicit kit root.
TOK={};C={};GEO={};PROFILE=b''

def configure_root(root):
 global ROOT,TOK,C,GEO,PROFILE
 ROOT=Path(root).resolve(strict=True)
 TOK=json.loads((ROOT/'source/tokens.json').read_text());C=TOK['colors']
 GEO=json.loads((ROOT/'source/geometry.json').read_text())['optical_designs']
 profile_path=ROOT/'source/output-srgb.icc'
 if not profile_path.is_file():
  raise ValueError('Missing source/output-srgb.icc; do not silently generate a different profile')
 PROFILE=profile_path.read_bytes()


def write(path,text):
 p=ROOT/path;p.parent.mkdir(parents=True,exist_ok=True);p.write_text(text.rstrip()+'\n',encoding='utf-8')

def save_png(im,path):
 p=ROOT/path;p.parent.mkdir(parents=True,exist_ok=True)
 # This assigns the intended sRGB output interpretation; it does not recover v1 colorimetry.
 im.save(p,optimize=True,compress_level=9,icc_profile=PROFILE)

def svg_file(size,body,desc='Awesome IINA indexed media symbol',width=None,height=None):
 return f'<svg xmlns="{NS}" xmlns:xlink="{XL}" width="{width or size}" height="{height or size}" viewBox="0 0 {width or size} {height or size}" role="img"><title>{desc}</title>{body}</svg>'

def defs():
 return f'''<defs><linearGradient id="mark-front" x1="0" y1="0" x2="1" y2="1"><stop stop-color="{C['cyan']}"/><stop offset="1" stop-color="{C['blue']}"/></linearGradient><linearGradient id="title-ink" x1="0" x2="1"><stop stop-color="{C['cyan']}"/><stop offset="1" stop-color="{C['violet']}"/></linearGradient></defs>'''

def mark(size=32,theme='dark',mono=None,tile=False):
 """Three intentional optical geometries, not a resized raster drawing."""
 g=GEO[str(size)]
 back,bs=g['back'],g['back_stroke']
 x,y,w,r,stroke=g['frame'];play=g['play']
 front=mono or (C['light_cyan'] if theme=='light' else C['cyan'] if size<=24 else 'url(#mark-front)')
 rear=mono or (C['light_violet'] if theme=='light' else C['violet'])
 center=mono or (C['light_cyan'] if theme=='light' else C['foreground'])
 bg= f'<rect width="{size}" height="{size}" rx="{size*.22}" fill="{C["background"]}"/>' if tile else ''
 return bg+f'<path id="index-tab" d="{back}" fill="none" stroke="{rear}" stroke-width="{bs}" stroke-linejoin="round" stroke-linecap="round"/><rect id="media-card" x="{x}" y="{y}" width="{w}" height="{w}" rx="{r}" fill="none" stroke="{front}" stroke-width="{stroke}"/><path id="play-cue" d="{play}" fill="{center}"/>'

def render(svg,width,height=None):
 raw=cairosvg.svg2png(bytestring=svg.encode(),output_width=width,output_height=height or width)
 return Image.open(io.BytesIO(raw)).convert('RGBA')

def build_marks():
 for theme in ['dark','light']:
  for size in [16,24,32]:
   art=svg_file(size,defs()+mark(size,theme),f'Awesome IINA — {size}-unit optical mark for {theme} surfaces')
   write(f'source/symbol-{size}-{theme}.svg',art)
   if size==32:
    write(f'assets/brand/symbol-{theme}.svg',art)
    for n in [128,256,512,1024]: save_png(render(art,n),f'assets/brand/symbol-{theme}-{n}.png')
 for name,color in [('ink',C['ink']),('white','#FFFFFF')]:
  svg=svg_file(32,mark(32,mono=color))
  write(f'source/symbol-{name}.svg',svg);write(f'assets/brand/symbol-{name}.svg',svg)
 for n in [16,24,32,48,64,128,256,512]:
  optical=n if n in (16,24) else 32
  art=svg_file(optical,defs()+mark(optical,tile=True))
  # Render large and integrate to the target sample grid; each small geometry is distinct.
  im=render(art,n*4).resize((n,n),Image.Resampling.LANCZOS)
  save_png(im,f'assets/brand/favicon-{n}.png')
  if n in (16,24,32):
   write(f'source/favicon-{n}.svg',art)
   # Source density variant preserves CSS optical geometry, unlike next larger optical design.
   save_png(render(art,n*8).resize((n*2,n*2),Image.Resampling.LANCZOS),f'assets/brand/favicon-{n}@2x.png')
 write('assets/brand/favicon.svg',svg_file(16,defs()+mark(16,tile=True)))
 # Pack EXACT independently drawn PNG frames; Pillow's general ICO writer resizes one source.
 sizes=[16,24,32,48,64,128,256];payloads=[(ROOT/f'assets/brand/favicon-{n}.png').read_bytes() for n in sizes]
 offset=6+16*len(sizes);directory=[]
 for n,b in zip(sizes,payloads):
  directory.append(struct.pack('<BBBBHHII',0 if n==256 else n,0 if n==256 else n,0,0,1,32,len(b),offset));offset+=len(b)
 (ROOT/'assets/brand/favicon.ico').write_bytes(struct.pack('<HHH',0,1,len(sizes))+b''.join(directory)+b''.join(payloads))
 # Large app-style tiles have deliberate optical padding, without claiming a native app exists.
 tile=svg_file(32,defs()+f'<rect width="32" height="32" fill="{C["background"]}"/><g transform="translate(3.2 3.2) scale(.8)">'+mark(32)+'</g>')
 for name,n in [('apple-touch-icon',180),('icon-192',192),('icon-512',512),('avatar-1024',1024)]:
  save_png(render(tile,n).convert('RGB'),f'assets/brand/{name}.png')
 write('source/avatar.svg',tile)

class Type:
 def __init__(self,directory,accept_font_change=False):
  self.fonts={};self.meta=[]
  for style,file in [('bold','InterDisplay-Bold.otf'),('medium','InterDisplay-Medium.otf')]:
   p=Path(directory)/file
   if not p.is_file(): raise SystemExit(f'Missing local font: {p}. Obtain Inter from its official source; no font files ship in this kit.')
   expected=json.loads((ROOT/'provenance/font-inventory.json').read_text())
   expected_hash=next((x['sha256'] for x in expected if x['file']==file),None)
   actual_hash=hashlib.sha256(p.read_bytes()).hexdigest()
   if expected_hash!=actual_hash and not accept_font_change:
    raise ValueError(f'Font hash changed for {file}; use the documented version, or explicitly pass --accept-font-change and review the regenerated artwork')
   font=TTFont(p);self.fonts[style]=font
   self.meta.append({'role':style,'file':file,'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'family':font['name'].getDebugName(1),'style':font['name'].getDebugName(2),'version':font['name'].getDebugName(5),'distributed':False})
 def width(self,text,size,style,tracking=0):
  font=self.fonts[style];cmap=font.getBestCmap();scale=size/font['head'].unitsPerEm
  return sum(font['hmtx'][cmap[ord(ch)]][0]*scale for ch in text)+tracking*max(0,len(text)-1)
 def text(self,text,x,y,size,style,fill,editable=False,tracking=0):
  if editable:
   return f'<text x="{x}" y="{y}" fill="{fill}" font-family="Inter Display" font-weight="{700 if style=="bold" else 500}" font-size="{size}" style="font-kerning:none" letter-spacing="{tracking}" xml:space="preserve">{html.escape(text)}</text>'
  font=self.fonts[style];glyphs=font.getGlyphSet();cmap=font.getBestCmap();scale=size/font['head'].unitsPerEm;out=[];cursor=x
  for char in text:
   glyph=cmap[ord(char)];pen=SVGPathPen(glyphs);glyphs[glyph].draw(pen)
   path=pen.getCommands()
   if path:out.append(f'<path d="{path}" transform="translate({cursor:.5f} {y}) scale({scale:.8f} {-scale:.8f})"/>')
   cursor+=font['hmtx'][glyph][0]*scale+tracking
  return f'<g aria-label="{html.escape(text,quote=True)}" fill="{fill}">'+''.join(out)+'</g>'

def build_texture():
 old=ROOT/'archive/original-kit/originals/awesome-iina-readme-hero.png'
 im=Image.open(old).convert('RGB')
 box=(960,565,2020,724)
 crop=im.crop(box)
 save_png(crop,'source/retained-wave-crop.png')
 # Full social background: flat, known text backdrop with retained waves below content.
 w,h=1280,640
 im=Image.new('RGB',(w,h),C['background'])
 texture=crop.resize((1280,192),Image.Resampling.LANCZOS)
 a=np.asarray(texture).astype(float)
 bg=np.array(tuple(int(C['background'][i:i+2],16) for i in (1,3,5)))
 alpha=np.clip(np.arange(192)/70,0,1)[:,None,None]
 texture=Image.fromarray(np.uint8(np.clip(a*alpha+bg*(1-alpha),0,255)))
 im.paste(texture,(0,448))
 save_png(im,'source/social-background.png')
 write('provenance/wave-crop.json',json.dumps({'source':'archive/original-kit/originals/awesome-iina-readme-hero.png','crop_xyxy':box,'transform':'Crop, uniform resize from 1060x159 to 1280x192 (same aspect to rounding), 70px top fade to v2 background. Only a secondary texture; no old player icon or baked text is used in the canonical social card.','color_interpretation':'Original untagged RGB assumed sRGB; new outputs explicitly tagged sRGB.'},indent=2))
 return im

def build_cards(typeface):
 bg=(ROOT/'source/social-background.png').read_bytes();b64=base64.b64encode(bg).decode()
 layout=json.loads((ROOT/'source/social-layout.json').read_text())
 for editable in [False,True]:
  t=layout['title'];content=defs()+f'<image width="1280" height="640" xlink:href="data:image/png;base64,{b64}"/>'
  m=layout['mark']
  content+=f'<g transform="translate({m["x"]} {m["y"]}) scale({m["width"]/32})">'+mark(32)+'</g>'
  x=t['x'];y=t['baseline'];sz=t['size'];tr=t['tracking']
  first='Awesome '; second='IINA'
  content+=typeface.text(first,x,y,sz,'bold',C['foreground'],editable,tr)
  content+=typeface.text(second,x+typeface.width(first,sz,'bold',tr)+tr,y,sz,'bold',C['cyan'],editable,tr)
  for line in layout['role_lines']:
   content+=typeface.text(line['text'],line['x'],line['baseline'],line['size'],'medium',C['secondary'],editable,-.35)
  svg=svg_file(0,content,'Awesome IINA — independent catalog for the IINA ecosystem',1280,640)
  path='source/social-card-editable.svg' if editable else 'assets/brand/github-social-preview.svg'
  write(path,svg)
  if not editable:
   im=render(svg,1280,640).convert('RGB');save_png(im,'assets/brand/github-social-preview-1280x640.png')
   # Secondary 1200x630 card fitted without stretching; dimensions declared independently.
   small=im.resize((1200,600),Image.Resampling.LANCZOS)
   pad=Image.new('RGB',(1200,630),C['background']);pad.paste(small,(0,15));save_png(pad,'assets/brand/open-graph-1200x630.png')
 # Wordmarks: production glyph paths + editable counterparts, separate from symbol-only SVGs.
 for theme in ['dark','light']:
  fg=C['foreground'] if theme=='dark' else C['ink']
  for editable in [False,True]:
   body=defs()+f'<g transform="translate(0 0) scale(2)">'+mark(32,theme)+'</g>'
   body+=typeface.text('Awesome IINA',86,47,43,'bold',fg,editable,-.7)
   svg=svg_file(0,body,'Awesome IINA wordmark',400,64)
   write(f'{"source" if editable else "assets/brand"}/wordmark-{theme}{"-editable" if editable else ""}.svg',svg)
 # Retain exact original hero as a clearly labelled, optional secondary illustration.
 src=ROOT/'archive/original-kit/exports/headers/readme-hero-1800x600.png'
 (ROOT/'assets/brand/readme-hero-retained.png').write_bytes(src.read_bytes())


def build_metadata():
 from brandkit.core import render_site
 dep=json.loads((ROOT/'source/deployment.json').read_text())
 from urllib.parse import urlsplit
 if urlsplit(dep['project_url']).path!=dep['base_path']:
  raise ValueError('base_path must match the canonical project_url path')
 output=render_site(ROOT,dep['project_url'],dep.get('social_variant','github'))
 write('integration/website-head.html',output['website-head.html'].decode())
 write('assets/brand/site.webmanifest',output['site.webmanifest'].decode())
 demo=ROOT/'integration/demo/index.html'
 if demo.exists():
  local=output['website-head.html'].decode().replace(f'href="{dep["base_path"]}assets/brand/','href="../../assets/brand/')
  text=demo.read_text();start=text.index('<!-- Intended site configuration,');end=text.index('<style>',start)
  demo.write_text(text[:start]+local.rstrip()+'\n'+text[end:])


def main():
 parser=argparse.ArgumentParser(description=__doc__)
 parser.add_argument('--root',type=Path,default=ROOT)
 parser.add_argument('--accept-font-change',action='store_true')
 parser.add_argument('--font-dir',type=Path,required=True,help='Local Inter static OTF directory; binaries are never copied')
 args=parser.parse_args();configure_root(args.root);font=Type(args.font_dir,args.accept_font_change)
 build_marks();build_texture();build_cards(font);build_metadata()
 write('provenance/font-inventory.json',json.dumps(font.meta,indent=2))
 from write_manifest import inventory
 inventory(ROOT)
 print('Built canonical symbol, optical icons, social layout, wordmarks and retained hero.')

if __name__=='__main__':main()
