/* Refresh optimized website images from preserved originals. Fonts use prepare-fonts.cjs. */
const fs = require('node:fs/promises');
const path = require('node:path');
const sharp = require('sharp');
const root = path.resolve(__dirname, '..');
const originals = path.join(root, '_archive/assets/images');
const photos = {
  'production': 'photo-1485846234645-a62644f84728',
  'set': 'photo-1489599849927-2ee91cede3ba',
  'travel': 'photo-1613490493576-7fde63acd811',
  'events': 'photo-1506157786151-b8491531f063',
  'landscape': 'photo-1464822759023-fed622ff2c3b',
  'architecture': 'photo-1600210492486-724fe5c67fb0'
};
async function main() {
  await fs.mkdir(originals, {recursive:true});
  if (process.argv.includes('--download')) {
    await Promise.all(Object.entries(photos).map(async ([name, id]) => {
      const response = await fetch(`https://images.unsplash.com/${id}?auto=format&fit=crop&w=1800&q=85`);
      if (!response.ok) throw new Error(`${name}: ${response.status}`);
      await fs.writeFile(path.join(originals, `${name}.jpg`), Buffer.from(await response.arrayBuffer()));
      console.log(`Downloaded ${name}`);
    }));
  }
  const sources = { hero: 'otium-architecture-original.png', ...Object.fromEntries(Object.keys(photos).map(k => [k, `${k}.jpg`])) };
  for (const [name, source] of Object.entries(sources)) {
    if (name === 'set' || name === 'architecture') continue;
    const input = path.join(originals, source);
    try { await fs.access(input); } catch { continue; }
    for (const width of [800, 1600]) {
      await sharp(input).resize({width, withoutEnlargement: true}).webp({quality: 83}).toFile(path.join(root, `assets/images/${name}-${width}.webp`));
    }
  }
  await sharp(path.join(root, '_archive/otium logo.png')).resize({width: 600}).webp({quality:90}).toFile(path.join(root, 'assets/images/otium-logo.webp'));
  console.log('Responsive images ready');
}
main().catch(e => {console.error(e);process.exitCode = 1;});
