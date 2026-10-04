/* Run after inspect-production-sources.cjs. Reads originals; never rewrites them. */
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { spawnSync } = require('node:child_process');
const sharp = require('sharp');
const root = path.resolve(__dirname, '..');
const ffmpeg = process.env.FFMPEG_PATH || require('@ffmpeg-installer/ffmpeg').path;
const rows = JSON.parse(fs.readFileSync(path.join(root, 'preview/source-inspection/inspection.json')));
// Visually reviewed contact-sheet selections; no first-frame or black-frame defaults.
const selections = [4, 4, 1, 2, 2, 2, 3, 2];
const output = path.join(root, 'public/images/production/projects');
const docs = path.join(root, 'docs');
fs.mkdirSync(output, { recursive: true });
fs.mkdirSync(docs, { recursive: true });
(async () => {
  const manifest = [];
  for (const [i, row] of rows.entries()) {
    const decode = spawnSync(ffmpeg, ['-hide_banner', '-v', 'error', '-xerror', '-i', row.sourcePath, '-map', '0:v:0', '-map', '0:a?', '-f', 'null', '-'], { encoding: 'utf8' });
    if (decode.error || decode.status !== 0 || decode.stderr.trim()) throw Error(`Decode check failed for ${row.filename}: ${decode.error || decode.stderr}`);
    const sha256 = crypto.createHash('sha256').update(fs.readFileSync(row.sourcePath)).digest('hex');
    if (sha256 !== row.sha256) throw Error(`Source changed: ${row.filename}`);
    const sample = row.samples.find(s => s.index === selections[i]);
    const filename = row.filename.replace(/\.mp4$/i, '').replace(/ \((\d+)\)/, '-$1') + '-poster.webp';
    const poster = path.join(output, filename);
    await sharp(sample.path).resize({ width: Math.min(1920, row.width), withoutEnlargement: true }).webp({ quality: 90, effort: 6 }).toFile(poster);
    const metadata = await sharp(poster).metadata();
    if (metadata.width !== row.width || metadata.height !== row.height) throw Error('Unexpected poster dimensions');
    const { sourcePath, samples, ...info } = row;
    manifest.push({ ...info, resolutionTier: '360p', fullDecodeCheck: 'passed', sourceHashUnchanged: true, muxReadiness: 'Ready for upload; low-resolution source. Mux processing not yet tested.', recommendation: 'Upload unchanged if using this copy; obtain a 1080p or higher master for premium desktop presentation. Do not upscale or recompress.', poster: { file: `public/images/production/projects/${filename}`, nextImageSrc: `/images/production/projects/${filename}`, width: metadata.width, height: metadata.height, timeSeconds: sample.time, sizeBytes: fs.statSync(poster).size }, muxPlaybackId: null });
    console.log(`${row.filename}: decode OK, original unchanged, poster ${fs.statSync(poster).size} bytes`);
  }
  fs.writeFileSync(path.join(docs, 'production-source-manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
  const table = manifest.map(r => `| ${r.filename} | ${r.duration} | ${r.width} × ${r.height} | ${r.aspectRatio} | ${r.fps} | H.264 Main | ${r.videoBitrateKbps} / ${r.containerBitrateKbps} | ${(r.sizeBytes / 1e6).toFixed(2)} | 360p | Yes, with quality caveat |`).join('\n');
  const posters = manifest.map(r => `| ${r.filename} | [${path.basename(r.poster.file)}](../${r.poster.file}) | ${r.poster.timeSeconds}s | ${(r.poster.sizeBytes / 1000).toFixed(1)} |`).join('\n');
  fs.writeFileSync(path.join(docs, 'PRODUCTION-SOURCE-AUDIT.md'), `# Production project source audit\n\nInspected 2026-10-04 using FFmpeg. Eight local MP4 files; all fully decoded without reported errors. SHA-256 checks confirm originals unchanged. Exact bytes and hashes are in [the manifest](production-source-manifest.json). Bitrates below are FFmpeg-reported estimates; MB/kB are decimal.\n\n**All sources are 360p, not 1080p, 1440p, or 4K.** Keep these files unchanged for upload if these are the available copies, but obtain higher-resolution masters (preferably 1080p or better) for premium desktop playback. Further compression would lose detail; upscaling cannot restore it. This recommendation applies to every file.\n\n| Filename | Duration | Resolution | Ratio | FPS | Video codec | Video / total kbps | MB | Tier | Mux upload ready |\n|---|---|---|---|---|---|---|---|---|---|\n${table}\n\nAll audio is AAC-LC, stereo, 44.1 kHz, approximately 127–128 kbps. These MP4/H.264 files are suitable Mux upload candidates based on local inspection and [Mux input guidance](https://www.mux.com/docs/guides/minimize-processing-time). Actual acceptance requires Mux processing; nothing has been uploaded.\n\n## Posters\n\nEight visually selected WebP posters, quality 90, each 640 × 360 with the original 16:9 canvas preserved. No artificial 1920px upscale. Existing subtitles, title graphics, and letterboxing are part of the source and were not retouched. Full-width desktop sharpness is limited by the original resolution.\n\n| Source | Poster | Selected timestamp | kB |\n|---|---|---|---|\n${posters}\n\nThe manifest maps source filenames to posters and includes empty Mux Playback ID fields for later integration. In Next.js, use the recorded nextImageSrc with width/height and responsive sizes. The current repository is a static site, so these assets have only been prepared: no framework migration or component wiring was performed.\n\n## Scope and protection\n\n- Source directory remains outside the repository. /local-videos/ and /Otium-Source-Videos/ are ignored as additional protection if folders with those names are placed at the repository root.\n- No originals modified, moved, deleted, committed, or uploaded. No compressed MP4 copies created.\n- No Production components, project data, or page design changed. No YouTube or Facebook media accessed.\n- Intermediate contact sheets and sampled PNGs remain in ignored preview/source-inspection/.\n- Provide filename-to-Mux-Playback-ID mappings before integration. No secret Mux API keys belong in frontend files.\n\n## Reproducing locally\n\nRequires Node.js, sharp, and @ffmpeg-installer/ffmpeg (or FFMPEG_PATH pointing to FFmpeg), available in this workstation's parent node_modules. Run node scripts/inspect-production-sources.cjs with the source directory argument, review contact sheets, then run node scripts/prepare-production-posters.cjs. Selections in the latter script apply to this exact eight-file audit and must be reviewed if the input set changes.\n`);
})().catch(error => { console.error(error); process.exit(1); });
