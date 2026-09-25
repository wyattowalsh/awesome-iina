import {readFile} from 'node:fs/promises';
import {relative,resolve,dirname} from 'node:path';
import {pathToFileURL} from 'node:url';
import {ROOT,walk,compilerApi} from './common.mjs';

/** Syntax-aware import policy. This is an architecture guard, NOT a security sandbox. */
export function boundaryErrors(source, filename, ts) {
  const errors=[];
  const role=filename.replaceAll('\\','/').split('/')[1];
  const tree=ts.createSourceFile(filename,source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TS);
  function check(specifier) {
    if (!specifier.startsWith('.')) { errors.push(`Runtime external import is not allowed: ${specifier}`); return; }
    const normalized=relative('src',resolve(dirname(filename),specifier)).replaceAll('\\','/');
    if (!normalized.startsWith(`${role}/`) && !normalized.startsWith('shared/')) errors.push(`Cross-runtime import: ${specifier}`);
    if (role==='shared' && !normalized.startsWith('shared/')) errors.push(`Shared dependency is not pure: ${specifier}`);
  }
  function visit(node) {
    if ((ts.isImportDeclaration(node)||ts.isExportDeclaration(node)) && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) check(node.moduleSpecifier.text);
    if (ts.isImportEqualsDeclaration(node)) errors.push('Import-equals is not supported in runtime source');
    if (ts.isNewExpression(node) && ts.isIdentifier(node.expression) && node.expression.text==='Function') errors.push('Dynamic function construction is not allowed');
    if (ts.isCallExpression(node)) {
      if (node.expression.kind===ts.SyntaxKind.ImportKeyword) errors.push('Dynamic import is not permitted in the baseline');
      if (ts.isIdentifier(node.expression)&&['require','eval','Function'].includes(node.expression.text)) errors.push(`Dynamic execution or loading: ${node.expression.text}`);
    }
    ts.forEachChild(node,visit);
  }
  visit(tree);
  return errors;
}
export async function checkBoundaries(root=ROOT) {
  const ts=compilerApi();
  const errors=[];
  for (const path of await walk(resolve(root,'src'))) {
    if (!path.endsWith('.ts')) continue;
    const filename=relative(root,path).replaceAll('\\','/');
    for (const error of boundaryErrors(await readFile(path,'utf8'),filename,ts)) errors.push(`${filename}: ${error}`);
  }
  return errors;
}
if (process.argv[1] && import.meta.url===pathToFileURL(resolve(process.argv[1])).href) {
  const errors=await checkBoundaries();
  if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}
  else console.log(JSON.stringify({layer:'source-boundaries',status:'passed'}));
}
