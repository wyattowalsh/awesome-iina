"""Create labelled diagnostic derivatives; does not replace shipping assets."""
from pathlib import Path
import argparse,json
import numpy as np
from PIL import Image,ImageDraw,ImageFont

def main(root):
 out=root/'qa/comparisons';out.mkdir(parents=True,exist_ok=True)
 f=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',18) if Path('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf').exists() else ImageFont.load_default(size=18)
 small=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',13) if Path('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf').exists() else ImageFont.load_default(size=13)
 # Actual 320 x 160 comparison, without enlarging it and pretending that is readability.
 canvas=Image.new('RGB',(752,294),'#F7F9FC');d=ImageDraw.Draw(canvas)
 d.text((24,16),'Social card — same 320 × 160 display pixels',font=f,fill='#132555')
 for x,name,p in [(24,'Original control','archive/original-kit/exports/social/github-social-preview-1280x640.png'),(408,'Revision 2','assets/brand/github-social-preview-1280x640.png')]:
  im=Image.open(root/p).convert('RGB').resize((320,160),Image.Resampling.LANCZOS);canvas.paste(im,(x,70));d.text((x,45),name,font=small,fill='#132555')
 d.text((24,251),'Diagnostic preview. View at 100%; this is not a platform crop or a user study.',font=small,fill='#465775');canvas.save(out/'social-before-after.png')
 # A simple tighter-crop control is not described as a custom optical drawing.
 original=Image.open(root/'archive/original-kit/originals/awesome-iina-simplified-icon.png').convert('RGB')
 a=np.asarray(original).astype(float)/255;linear=np.where(a<=.04045,a/12.92,((a+.055)/1.055)**2.4);l=linear@np.array([.2126,.7152,.0722]);ys,xs=np.where(l>.18)
 box=(int(xs.min()),int(ys.min()),int(xs.max()+1),int(ys.max()+1));cx=(box[0]+box[2])/2;cy=(box[1]+box[3])/2;side=max(box[2]-box[0],box[3]-box[1])+80
 cropbox=tuple(int(v) for v in (cx-side/2,cy-side/2,cx+side/2,cy+side/2));cropped=original.crop(cropbox)
 canvas=Image.new('RGB',(740,470),'#F7F9FC');d=ImageDraw.Draw(canvas)
 d.text((24,16),'Compact construction — controls and selected revision',font=f,fill='#132555')
 for row,label in enumerate(['Original export','Tighter crop only — not an optical redesign','Selected indexed-media drawing']):
  y=65+row*132;d.text((24,y),label,font=small,fill='#132555')
  for i,n in enumerate([16,24,32,48,64]):
   if row==0:im=Image.open(root/f'archive/original-kit/exports/web/favicon-{n}x{n}.png').convert('RGBA')
   elif row==1:im=cropped.resize((n,n),Image.Resampling.LANCZOS).convert('RGBA')
   else:im=Image.open(root/f'assets/brand/favicon-{n}.png').convert('RGBA')
   x=28+i*140;canvas.paste(im,(x,y+28),im);d.text((x,y+96),str(n)+' px',font=small,fill='#465775')
 canvas.save(out/'icon-controls.png')
 # Record exactly what the diagnostic crop means.
 data={'method':'sRGB-assumed relative luminance > 0.18 bounds; square crop with 80-source-pixel total extra margin. Diagnostic only, not a required occupied-area percentage.','bright_bbox_xyxy':box,'crop_xyxy':cropbox,'crop_status':'control only; not selected production design','new_social_source_em_size':48,'new_social_em_at_320_css':12,'old_social_descriptor_ink_at_320_css':5.75,'old_value_origin':'Prior audit diagnostic, reproduced in earlier addendum; font em and raster ink are different measures.'}
 (out/'methods.json').write_text(json.dumps(data,indent=2)+'\n')
 print('Comparison images written.')
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--root',type=Path,default=Path(__file__).resolve().parents[1]);a=p.parse_args();main(a.root.resolve())
