const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const ffmpeg = process.env.FFMPEG_PATH || require('@ffmpeg-installer/ffmpeg').path;
for (const [folder, width] of [['frames', 1280], ['frames/mobile', 960]]) {
  fs.mkdirSync(path.join(root, folder), { recursive: true });
  const result = spawnSync(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-i', path.join(root, '_archive/vid16.mp4'), '-vf', `fps=24,scale=${width}:-2`, '-q:v', '4', '-start_number', '1', '-y', path.join(root, folder, 'frame_%04d.jpg')], { stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status || 1);
}
