import {defineConfig} from 'astro/config';
import starlight from '@astrojs/starlight';
import tailwindcss from '@tailwindcss/vite';
import {readFileSync} from 'node:fs';
import {safeBase} from '../scripts/docs.ts';
const config=JSON.parse(readFileSync(new URL('../docs.config.json',import.meta.url),'utf8')) as {
  title: string;
  description: string;
  base?: string;
};
const site=process.env.DOCS_SITE;
if(site&&!/^https?:\/\//.test(site))throw new Error('DOCS_SITE must be an absolute HTTP(S) origin.');
export default defineConfig({
  site,base:safeBase(process.env.DOCS_BASE??config.base??'/'),output:'static',trailingSlash:'always',
  integrations:[starlight({title:config.title,description:config.description,
    sidebar:[
      {label:'Overview',link:'/'},
      {label:'Development',slug:'development'},
      {label:'Runtime boundaries',slug:'runtime'},
      {label:'Packaging and release',slug:'packaging'},
      {label:'Template upgrades',slug:'updating'},
      {label:'Documentation',slug:'documentation'},
      {label:'Native acceptance',slug:'native-testing'},
    ],
    customCss:['./src/styles/global.css','./src/styles/custom.css'],
  })],
  vite:{plugins:[tailwindcss()]},
});
