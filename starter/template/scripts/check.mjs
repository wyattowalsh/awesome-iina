import {run} from './common.mjs';
// Never installs, formats, links, restarts IINA, or publishes.
for (const args of [
  ['scripts/quality.mjs','format-check'], ['scripts/quality.mjs','lint'],
  ['scripts/typecheck.mjs'], ['scripts/boundaries.mjs'], ['scripts/validate.mjs'],
  ['scripts/docs.ts','check'], ['--test','tests/unit/*.test.mjs','tests/contracts/*.test.mjs','tests/contracts/*.test.ts'],
]) run(process.execPath,args,{stdio:'inherit'});
