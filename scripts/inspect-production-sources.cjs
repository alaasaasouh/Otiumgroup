/* Read-only source inspection. All generated material stays in this workspace. */
const fs=require('node:fs');const path=require('node:path');const crypto=require('node:crypto');
const {spawnSync}=require('node:child_process');const sharp=require('sharp');
const root=path.resolve(__dirname,'..');
const source=process.argv[2];if(!source)throw Error('Supply source folder');
const ffmpeg=process.env.FFMPEG_PATH||require('@ffmpeg-installer/ffmpeg').path;
const output=path.join(root,'preview/source-inspection');fs.mkdirSync(output,{recursive:true});
const files=fs.readdirSync(source).filter(f=>/\.(mp4|mov|m4v|mkv|webm|avi|mts|m2ts)$/i.test(f)).sort((a,b)=>a.localeCompare(b,undefined,{numeric:true}));
(async()=>{
 const report=[];
 for(const [i,file] of files.entries()){
  const input=path.join(source,file),stat=fs.statSync(input);
  const result=spawnSync(ffmpeg,['-hide_banner','-i',input],{encoding:'utf8'});
  if(result.error)throw result.error;
  const log=result.stderr;fs.writeFileSync(path.join(output,`source-${i+1}.txt`),log);
  const duration=log.match(/Duration: (\d+):(\d+):([\d.]+).*bitrate: (\d+) kb\/s/);
  const video=log.split('\n').find(line=>line.includes('Video:'));
  if(!duration||!video)throw Error(`Cannot inspect ${file}`);
  const seconds=Number(duration[1])*3600+Number(duration[2])*60+Number(duration[3]);
  const dimensions=video.match(/\b(\d{2,5})x(\d{2,5})\b/);
  const row={filename:file,sourcePath:input,key:`project-${String(i+1).padStart(2,'0')}`,durationSeconds:seconds,duration:duration.slice(1,4).join(':'),width:Number(dimensions[1]),height:Number(dimensions[2]),aspectRatio:video.match(/DAR ([\d:]+)/)?.[1],fps:Number(video.match(/([\d.]+) fps/)?.[1]),codec:video.match(/Video: ([^,]+)/)?.[1],videoBitrateKbps:Number(video.match(/(\d+) kb\/s/)?.[1]),containerBitrateKbps:Number(duration[4]),sizeBytes:stat.size,audio:log.split('\n').find(line=>line.includes('Audio:'))?.trim(),sha256:crypto.createHash('sha256').update(fs.readFileSync(input)).digest('hex')};
  row.samples=[];
  const tiles=[];
  for(const [sample,fraction] of [.1,.25,.4,.55,.7,.85].entries()){
   const time=Number((seconds*fraction).toFixed(2));
   const shot=path.join(output,`${row.key}-${sample+1}.png`);
   const extract=spawnSync(ffmpeg,['-hide_banner','-loglevel','error','-ss',String(time),'-i',input,'-frames:v','1','-y',shot],{encoding:'utf8'});
   if(extract.status!==0)throw Error(extract.stderr);
   row.samples.push({index:sample+1,time,path:shot});
   const thumb=await sharp(shot).resize(320,180,{fit:'contain',background:'#151b17'}).png().toBuffer();
   tiles.push({input:thumb,left:(sample%3)*320,top:Math.floor(sample/3)*212});
   const label=Buffer.from(`<svg width="320" height="32"><rect width="320" height="32" fill="#151b17"/><text x="12" y="22" fill="white" font-size="16">${sample+1} / ${time}s</text></svg>`);
   tiles.push({input:label,left:(sample%3)*320,top:Math.floor(sample/3)*212+180});
  }
  await sharp({create:{width:960,height:424,channels:3,background:'#151b17'}}).composite(tiles).jpeg({quality:88}).toFile(path.join(output,`${row.key}-contact.jpg`));
  report.push(row);console.log(JSON.stringify({...row,samples:undefined,sourcePath:undefined,sha256:undefined}));
 }
 fs.writeFileSync(path.join(output,'inspection.json'),JSON.stringify(report,null,2));
})().catch(e=>{console.error(e);process.exit(1)});
