/* Optional publishing utility: node scripts/configure-domain.cjs https://your-domain.com/
 * Also accepts a deployment subdirectory, such as https://name.github.io/otium/.
 * Run after render-pages.cjs, once the actual public address is known.
 */
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const input=process.argv[2];
let base;
try { base=new URL(input); if(base.protocol!=='https:' || base.search || base.hash || base.username || base.password) throw new Error(); }
catch { console.error('Supply the approved HTTPS website address, including any deployment subdirectory.'); process.exit(1); }
if(!base.pathname.endsWith('/'))base.pathname+='/';
const pages=['','about/','divisions/','production/','travel/','events/','contact/'];
const xml=value=>value.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
for(const page of pages){
  const file=path.join(root,page,'index.html');
  let html=fs.readFileSync(file,'utf8');
  html=html.replace(/<link rel="canonical"[^>]*>/g,'').replace(/<meta property="og:url"[^>]*>/g,'');
  const url=new URL(page,base).href;
  html=html.replace('</head>',`<link rel="canonical" href="${xml(url)}"><meta property="og:url" content="${xml(url)}"></head>`);
  html=html.replace(/(<meta property="og:image" content=")[^"]*assets\/images\/([^"]+)(">)/,(_,a,image,b)=>a+xml(new URL(`assets/images/${image}`,base).href)+b);
  fs.writeFileSync(file,html);
}
const sitemap=`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map(page=>`  <url><loc>${xml(new URL(page,base).href)}</loc></url>`).join('\n')}\n</urlset>\n`;
fs.writeFileSync(path.join(root,'sitemap.xml'),sitemap);
fs.writeFileSync(path.join(root,'robots.txt'),`User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap.xml',base).href}\n`);
console.log('Canonical URLs, absolute social images, sitemap.xml and robots.txt configured for '+base.href);
