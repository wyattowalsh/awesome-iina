import {readFileSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import vm from 'node:vm';
import {ROOT,compilerApi} from '../../scripts/common.mjs';
/** Isolated Node-VM contract execution only, never labeled native-JSC evidence. */
export function loadTS(path,globals={}) {
  const ts=compilerApi(),cache=new Map();
  function load(filename){
    filename=resolve(filename);
    if(cache.has(filename))return cache.get(filename).exports;
    const module={exports:{}};cache.set(filename,module);
    const result=ts.transpileModule(readFileSync(filename,'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2019,module:ts.ModuleKind.CommonJS,verbatimModuleSyntax:false}});
    const localRequire=(specifier)=>{
      if(!specifier.startsWith('.'))throw new Error('External module in mock runtime');
      return load(resolve(dirname(filename),specifier.replace(/\.js$/,'.ts')));
    };
    const wrapper=vm.runInNewContext(`(function(exports,require,module){${result.outputText}\n})`,globals,{filename,timeout:1000});
    wrapper(module.exports,localRequire,module);
    return module.exports;
  }
  return load(resolve(ROOT,path));
}
