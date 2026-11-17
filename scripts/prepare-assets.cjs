/* Build responsive WebP copies of the approved client photos. Never downloads stock. */
const fs = require('node:fs/promises');
const path = require('node:path');
const sharp = require('sharp');
const root = path.resolve(__dirname, '..');
const photos = require('./client-photo-manifest.cjs');
const sources = path.join(root, 'Client Photos - Review');
const output = path.join(root, 'assets/images');
const backup = path.join(root, '_archive/client-photo-update-2026-11-17/images');
async function main() {
  await fs.mkdir(backup, {recursive: true});
  for (const [name, source] of Object.entries(photos)) {
    const input = path.join(sources, ...source);
    await fs.access(input);
    for (const width of [800, 1600]) {
      const filename = `${name}-${width}.webp`;
      const target = path.join(output, filename);
      try { await fs.copyFile(target, path.join(backup, filename), fs.constants.COPYFILE_EXCL); }
      catch (error) { if (!['ENOENT', 'EEXIST'].includes(error.code)) throw error; }
      await sharp(input).rotate().resize({width, withoutEnlargement: true}).webp({quality: 83}).toFile(target);
    }
    console.log(`Prepared ${name}: ${source[1]}`);
  }
}
main().catch(e => {console.error(e);process.exitCode = 1;});
