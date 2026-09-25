import {watch,existsSync} from 'node:fs';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {spawn} from 'node:child_process';
import {ROOT} from './common.mjs';

/** Debounced single-writer queue. Changes during a build schedule one later build. */
export function createBuildQueue(build,{delay=120,onError=console.error}={}) {
  let running=false,pending=false,stopped=false,timer=null;
  async function drain(){
    timer=null;if(running||stopped)return;
    running=true;pending=false;
    try{await build();}catch(error){onError(error);}finally{running=false;if(pending&&!stopped)timer=setTimeout(drain,delay);}
  }
  return {
    request(){if(stopped)return;pending=true;if(running)return;if(timer)clearTimeout(timer);timer=setTimeout(drain,delay);},
    stop(){stopped=true;pending=false;if(timer)clearTimeout(timer);},
    get running(){return running;},
  };
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href) {
  let child=null;
  const queue=createBuildQueue(()=>new Promise((done,reject)=>{
    child=spawn(process.execPath,['scripts/build.mjs'],{cwd:ROOT,stdio:'inherit',shell:false});
    child.once('error',reject);child.once('exit',code=>{child=null;code===0?done():reject(new Error(`Build failed (${code}); watching for the next change.`));});
  }));
  const watchers=[];
  try {
    for(const directory of ['src','types'])if(existsSync(resolve(ROOT,directory)))watchers.push(watch(resolve(ROOT,directory),{recursive:true},()=>queue.request()));
    for(const file of ['Info.json','.iina-project.json','package.json'])watchers.push(watch(resolve(ROOT,file),()=>queue.request()));
    for(const watcher of watchers)watcher.on('error',error=>{console.error(error);shutdown();process.exitCode=1;});
    queue.request();console.log('Watching source. Rebuilds do not reload or restart IINA. Ctrl+C stops the watcher.');
  }catch(error){shutdown();throw error;}
  function shutdown(){queue.stop();for(const watcher of watchers)watcher.close();if(child)child.kill('SIGTERM');}
  process.once('SIGINT',shutdown);process.once('SIGTERM',shutdown);
}
