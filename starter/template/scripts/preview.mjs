import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {pathToFileURL} from 'node:url';
import {ROOT,json,inside} from './common.mjs';
import {verifyStage} from './validate.mjs';

const bridge=String.raw`
// Simulated browser bridge. It exposes no native operation and makes no network requests.
const callbacks=new Map();let ready=null,sequence=0;
const titles={normal:'Example media',empty:'',unicode:'日本語のタイトル 🎬 Café',long:'A very long media title '.repeat(30),disconnected:'Waiting for IINA'};
function emit(){
 if(!ready)return;
 const select=document.querySelector('[data-scenario]');const name=select?.value||'normal';
 const heading=document.querySelector('#title');
 if(name==='disconnected'){
  if(heading)heading.textContent='Connecting';
  document.querySelector('#status').textContent='Preview: bridge disconnected';
  return;
 }
 const raw=titles[name]??'';
 const payload={v:1,kind:'snapshot',viewId:ready.viewId,sequence:++sequence,title:raw.slice(0,500),paused:true};
 callbacks.get('iina-starter:state:v1')?.(payload);
}
window.iina={onMessage(name,fn){callbacks.set(name,fn);},postMessage(name,data){if(name==='iina-starter:state:v1'&&data?.kind==='ready'){ready=data;emit();}}};
document.addEventListener('DOMContentLoaded',()=>{
 const box=document.createElement('aside');
 box.id='preview-controls';
 box.setAttribute('aria-label','Browser simulation controls');
 box.style.cssText='pointer-events:auto;background:Canvas;color:CanvasText;border:1px solid CanvasText;padding:.75rem;margin:0 0 1rem;max-inline-size:28rem';
 const title=document.createElement('strong');title.textContent='BROWSER SIMULATION: not native IINA';box.append(title,document.createElement('br'));
 const label=document.createElement('label');label.setAttribute('for','preview-scenario');label.textContent='Scenario: ';
 const select=document.createElement('select');select.id='preview-scenario';select.name='preview-scenario';select.dataset.scenario='';
 for(const key of Object.keys(titles)){const option=document.createElement('option');option.value=key;option.textContent=key;select.append(option);}
 label.append(select);box.append(label);document.body.prepend(box);select.addEventListener('change',emit);emit();
});
`;
export function previewPath(url){
  const pathname=new URL(url,'http://localhost').pathname;
  const decoded=decodeURIComponent(pathname);
  if(decoded==='/'||decoded==='/ui/')return 'ui/index.html';
  if(['ui/index.html','ui/index.js','ui/style.css'].includes(decoded.slice(1)))return decoded.slice(1);
  return null;
}
export function createPreviewServer(stage) {
  return createServer(async(req,res)=>{
    const port=res.socket.localPort;
    if(![`127.0.0.1:${port}`,`localhost:${port}`].includes(req.headers.host)){res.writeHead(403);res.end('Invalid host');return;}
    if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,{Allow:'GET, HEAD'});res.end();return;}
    res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');
    res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self'; connect-src 'none'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'");
    try {
      if(new URL(req.url,'http://localhost').pathname==='/__preview/bridge.js'){
        res.setHeader('Content-Type','text/javascript; charset=utf-8');res.end(req.method==='HEAD'?'':bridge);return;
      }
      const path=previewPath(req.url);if(!path){res.writeHead(404);res.end('Only the staged preview UI is served.');return;}
      let content=await readFile(inside(stage,path));
      if(path.endsWith('.html'))content=Buffer.from(content.toString().replace('<head>','<head><script src="/__preview/bridge.js"></script>'));
      res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css'})[extname(path)]+'; charset=utf-8');
      res.end(req.method==='HEAD'?'':content);
    }catch(error){res.writeHead(error.code==='ENOENT'?404:400);res.end('Preview request could not be served.');}
  });
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href) {
  const project=await json('.iina-project.json');
  if(project.preset==='command')throw new Error('The command preset has no webview to preview.');
  const stage=resolve(ROOT,'.build',project.slug);await verifyStage(stage,project);
  const port=Number(process.env.PREVIEW_PORT??4173);
  if(!Number.isInteger(port)||port<1024||port>65535)throw new Error('PREVIEW_PORT must be 1024..65535.');
  const server=createPreviewServer(stage);server.on('error',error=>{console.error(error);process.exitCode=1;});
  server.listen(port,'127.0.0.1',()=>console.log(`Browser simulation only: http://127.0.0.1:${port}/ui/ (no native operations)`));
  for(const signal of ['SIGINT','SIGTERM'])process.once(signal,()=>{server.close();server.closeAllConnections();});
}
