/* The client-approved PNG is the master (earthy-gradient revision, 17 November 2026).
 * Generate only its browser icon; the master keeps its approved bytes and dimensions.
 * Preserve the full master without redrawing, recolouring or background changes.
 */
const path = require('node:path');
const sharp = require('sharp');
const root = path.resolve(__dirname, '..');
sharp(path.join(root, 'assets/images/otium-nexus-logo.png'))
  .extract({left: 830, top: 15, width: 410, height: 540})
  .resize(128, 128, {fit: 'contain', background: {r:0,g:0,b:0,alpha:0}})
  .png()
  .toFile(path.join(root, 'assets/favicon.png'))
  .then(() => console.log('Created favicon from the approved logo I.'))
  .catch(error => { console.error(error); process.exitCode = 1; });
