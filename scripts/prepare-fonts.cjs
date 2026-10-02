/* One-time local font optimization. Runtime never contacts Google Fonts. */
const fs=require('node:fs/promises');const path=require('node:path');
const root=path.resolve(__dirname,'..');
(async()=>{
 const css=await fs.readFile(path.join(root,'_archive/woff2-source.css'),'utf8');
 const downloaded=new Map();const blocks=[];
 for(const match of css.matchAll(/\/\* ([\w-]+) \*\/\s*(@font-face\s*\{[^}]+\})/g)){
  const subset=match[1],block=match[2];
  const family=block.match(/font-family: '([^']+)'/)[1];
  const style=block.match(/font-style: ([^;]+)/)[1];
  const remote=block.match(/url\(([^)]+)\)/)[1];
  const filename=`${family.toLowerCase().replaceAll(' ','-')}-${style}-${subset}.woff2`;
  if(downloaded.has(filename)&&downloaded.get(filename)!==remote)throw Error('Unexpected font variant collision');
  if(!downloaded.has(filename)){
   const response=await fetch(remote);if(!response.ok)throw Error(`Font ${response.status}`);
   const buffer=Buffer.from(await response.arrayBuffer());
   await fs.writeFile(path.join(root,'assets/fonts',filename),buffer);downloaded.set(filename,remote);
   console.log(`${filename}: ${buffer.length} bytes`);
  }
  blocks.push(block.replace(remote,`assets/fonts/${filename}`));
 }
 if(downloaded.size<6)throw Error('Missing font styles');
 const stylesheet=await fs.readFile(path.join(root,'style.css'),'utf8');
 await fs.writeFile(path.join(root,'style.css'),blocks.join('\n')+'\n'+stylesheet.replace(/^(?:@font-face\s*\{[^}]+\}\s*)+/,''));
 const generatorPath=path.join(root,'scripts/render-pages.cjs');
 let generator=await fs.readFile(generatorPath,'utf8');
 generator=generator.replace('dm-sans-400.ttf','dm-sans-normal-latin.woff2').replace('instrument-serif-italic.ttf','instrument-serif-italic-latin.woff2').replaceAll('type="font/ttf"','type="font/woff2"');
 await fs.writeFile(generatorPath,generator);
})().catch(e=>{console.error(e);process.exit(1)});
