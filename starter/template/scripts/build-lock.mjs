import {open,unlink} from 'node:fs/promises';
/** One build per checkout. Stale locks require explicit human inspection/removal. */
export async function acquireBuildLock(path) {
  const handle=await open(path,'wx',0o600);
  try{await handle.writeFile(JSON.stringify({pid:process.pid,startedAt:new Date().toISOString()}));}
  catch(error){await handle.close();await unlink(path);throw error;}
  let released=false;
  return async()=>{if(released)return;released=true;await handle.close();await unlink(path);};
}
