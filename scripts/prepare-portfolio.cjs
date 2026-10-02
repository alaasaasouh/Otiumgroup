/* Downloads thumbnails and public metadata only. Never downloads video media. */
const fs = require('node:fs/promises');
const path = require('node:path');
const sharp = require('sharp');
const root = path.resolve(__dirname, '..');
const ids = ['9kM9o1gWy5M','evgzLGn4pOA','6IMbqihffk0','v4Klp5HNuPU','x4OnZ2mLECw','vosYXvKj6sQ','bzNMASgKv-o','iw7bPCWBrVM'];
(async () => {
  await fs.mkdir(path.join(root, 'assets/portfolio'), {recursive:true});
  for (const id of ids) {
    let buffer;
    for (const variant of ['maxresdefault','sddefault','hqdefault']) {
      const response = await fetch(`https://i.ytimg.com/vi/${id}/${variant}.jpg`, {signal:AbortSignal.timeout(20000)});
      if (!response.ok) continue;
      const candidate = Buffer.from(await response.arrayBuffer());
      const metadata = await sharp(candidate).metadata();
      if (metadata.width < 320) continue;
      buffer = candidate; break;
    }
    if (!buffer) throw new Error(`No valid thumbnail for ${id}`);
    for (const width of [480,960]) {
      await sharp(buffer).resize(width, Math.round(width*9/16), {fit:'cover'}).webp({quality:80})
        .toFile(path.join(root, `assets/portfolio/${id}-${width}.webp`));
    }
    console.log(`Optimized thumbnails: ${id}`);
  }
})().catch(error=>{console.error(error.message);process.exit(1)});
