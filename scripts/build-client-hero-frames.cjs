/* Deterministic photo animation: gentle pushes and dissolves, no generated scene motion.
 * Keeps the existing 145-frame scroll contract, with separately composed phone frames.
 */
const fs = require('node:fs/promises');
const path = require('node:path');
const {spawnSync} = require('node:child_process');
const sharp = require('sharp');
const ffmpeg = process.env.FFMPEG_PATH || require('@ffmpeg-installer/ffmpeg').path;
const root = path.resolve(__dirname, '..');
const review = path.join(root, 'Client Photos - Review');
const count = 145;
const scenes = [
  {file: ['01 - Home and Cities', 'home_hero_1_london.jpg'], focal: .57},
  {file: ['04 - Travel and Documentary', 'natgeo_qatar_desert.jpg'], focal: .57},
  {file: ['01 - Home and Cities', 'home_hero_3_beirut.jpg'], focal: .78}
];
const name = i => `frame_${String(i + 1).padStart(4, '0')}.jpg`;
const ease = t => { t = Math.min(1, Math.max(0, t)); return t * t * (3 - 2 * t); };
async function main() {
  sharp.concurrency(2);
  for (const scene of scenes) scene.source = await sharp(path.join(review, ...scene.file))
    .removeAlpha().raw().toBuffer({resolveWithObject: true});
  for (const folder of ['frames', 'frames/mobile']) {
    const backup = path.join(root, '_archive/client-photo-update-2026-11-17', folder);
    await fs.mkdir(backup, {recursive: true});
    for (let i = 0; i < count; i++) {
      try { await fs.copyFile(path.join(root, folder, name(i)), path.join(backup, name(i)), fs.constants.COPYFILE_EXCL); }
      catch (error) { if (!['ENOENT', 'EEXIST'].includes(error.code)) throw error; }
    }
  }
  console.log('Original desktop and mobile frames backed up.');
  for (const [folder, width, height] of [['frames', 1280, 720], ['frames/mobile', 540, 960]]) {
    async function render(sceneIndex, frame) {
      const scene = scenes[sceneIndex];
      const progress = ease((frame - sceneIndex * 45) / 54);
      const zoom = 1 + .045 * progress;
      const {data, info} = scene.source;
      const aspect = width / height;
      const cropHeight = Math.floor(Math.min(info.height, info.width / aspect) / zoom);
      const cropWidth = Math.floor(cropHeight * aspect);
      const left = Math.round((info.width - cropWidth) * scene.focal);
      const top = Math.round((info.height - cropHeight) * .5);
      return sharp(data, {raw: info}).extract({left, top, width: cropWidth, height: cropHeight})
        .resize(width, height).jpeg({quality: 80, mozjpeg: true}).toBuffer();
    }
    for (let i = 0; i < count; i++) {
      const sceneIndex = i < 55 ? 0 : i < 100 ? 1 : 2;
      let output = await render(sceneIndex, i);
      const transition = i >= 45 && i <= 54 ? [1, 45] : i >= 90 && i <= 99 ? [2, 90] : null;
      if (transition) {
        const alpha = ease((i - transition[1]) / 9);
        const next = await render(transition[0], i);
        const layer = await sharp(next).ensureAlpha(alpha).png().toBuffer();
        output = await sharp(output).composite([{input: layer}]).jpeg({quality: 80, mozjpeg: true}).toBuffer();
      }
      await fs.writeFile(path.join(root, folder, name(i)), output);
    }
    console.log(`Built ${count} ${width} x ${height} frames in ${folder}/`);
  }
  const result = spawnSync(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-framerate', '12',
    '-i', path.join(root, 'frames/frame_%04d.jpg'), '-frames:v', String(count),
    '-c:v', 'libx264', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-y',
    path.join(review, 'Hero Animation - London Qatar Beirut.mp4')], {stdio: 'inherit'});
  if (result.error) throw result.error;
  if (result.status !== 0) throw Error('Hero MP4 export failed');
  console.log('Exported 12-second hero preview MP4 to the client review folder.');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
