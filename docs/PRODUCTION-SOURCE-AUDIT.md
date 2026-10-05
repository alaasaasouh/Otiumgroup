# Production project source audit

The inspection results below describe the original 4 October audit. During the 5 October cleanup, its contact sheets and intermediate inspection files were preserved in `_archive/cleanup-2026-10-05/preview/source-inspection/`. New inspections still generate `preview/source-inspection/`. Current playback integration is documented in [MUX-PROJECTS.md](MUX-PROJECTS.md).

Inspected 2026-10-04 using FFmpeg. Eight local MP4 files; all fully decoded without reported errors. SHA-256 checks confirm originals unchanged. Exact bytes and hashes are in [the manifest](production-source-manifest.json). Bitrates below are FFmpeg-reported estimates; MB/kB are decimal.

**All sources are 360p, not 1080p, 1440p, or 4K.** Keep these files unchanged for upload if these are the available copies, but obtain higher-resolution masters (preferably 1080p or better) for premium desktop playback. Further compression would lose detail; upscaling cannot restore it. This recommendation applies to every file.

| Filename | Duration | Resolution | Ratio | FPS | Video codec | Video / total kbps | MB | Tier | Mux upload ready |
|---|---|---|---|---|---|---|---|---|---|
| videoplayback (1).mp4 | 00:00:45.98 | 640 × 360 | 16:9 | 25 | H.264 Main | 515 / 647 | 3.72 | 360p | Yes, with quality caveat |
| videoplayback (2).mp4 | 00:03:23.57 | 640 × 360 | 16:9 | 25 | H.264 Main | 452 / 583 | 14.85 | 360p | Yes, with quality caveat |
| videoplayback (3).mp4 | 00:02:46.86 | 640 × 360 | 16:9 | 25 | H.264 Main | 343 / 474 | 9.90 | 360p | Yes, with quality caveat |
| videoplayback (4).mp4 | 00:03:02.86 | 640 × 360 | 16:9 | 25 | H.264 Main | 424 / 556 | 12.71 | 360p | Yes, with quality caveat |
| videoplayback (5).mp4 | 00:03:21.08 | 640 × 360 | 16:9 | 25 | H.264 Main | 437 / 568 | 14.30 | 360p | Yes, with quality caveat |
| videoplayback (7).mp4 | 00:02:36.50 | 640 × 360 | 16:9 | 25 | H.264 Main | 369 / 500 | 9.79 | 360p | Yes, with quality caveat |
| videoplayback (8).mp4 | 00:03:23.45 | 640 × 360 | 16:9 | 25 | H.264 Main | 387 / 518 | 13.18 | 360p | Yes, with quality caveat |
| videoplayback.mp4 | 00:03:00.00 | 640 × 360 | 16:9 | 25 | H.264 Main | 377 / 508 | 11.44 | 360p | Yes, with quality caveat |

All audio is AAC-LC, stereo, 44.1 kHz, approximately 127–128 kbps. These MP4/H.264 files are suitable Mux upload candidates based on local inspection and [Mux input guidance](https://www.mux.com/docs/guides/minimize-processing-time). Actual acceptance requires Mux processing; nothing has been uploaded.

## Posters

Eight visually selected WebP posters, quality 90, each 640 × 360 with the original 16:9 canvas preserved. No artificial 1920px upscale. Existing subtitles, title graphics, and letterboxing are part of the source and were not retouched. Full-width desktop sharpness is limited by the original resolution.

| Source | Poster | Selected timestamp | kB |
|---|---|---|---|
| videoplayback (1).mp4 | [videoplayback-1-poster.webp](../public/images/production/projects/videoplayback-1-poster.webp) | 25.29s | 42.5 |
| videoplayback (2).mp4 | [videoplayback-2-poster.webp](../public/images/production/projects/videoplayback-2-poster.webp) | 111.96s | 26.5 |
| videoplayback (3).mp4 | [videoplayback-3-poster.webp](../public/images/production/projects/videoplayback-3-poster.webp) | 16.69s | 60.8 |
| videoplayback (4).mp4 | [videoplayback-4-poster.webp](../public/images/production/projects/videoplayback-4-poster.webp) | 45.72s | 27.9 |
| videoplayback (5).mp4 | [videoplayback-5-poster.webp](../public/images/production/projects/videoplayback-5-poster.webp) | 50.27s | 21.3 |
| videoplayback (7).mp4 | [videoplayback-7-poster.webp](../public/images/production/projects/videoplayback-7-poster.webp) | 39.13s | 36.2 |
| videoplayback (8).mp4 | [videoplayback-8-poster.webp](../public/images/production/projects/videoplayback-8-poster.webp) | 81.38s | 40.2 |
| videoplayback.mp4 | [videoplayback-poster.webp](../public/images/production/projects/videoplayback-poster.webp) | 45s | 37.3 |

The manifest maps source filenames to posters and includes empty Mux Playback ID fields for later integration. In Next.js, use the recorded nextImageSrc with width/height and responsive sizes. The current repository is a static site, so these assets have only been prepared: no framework migration or component wiring was performed.

## Scope and protection

- Source directory remains outside the repository. /local-videos/ and /Otium-Source-Videos/ are ignored as additional protection if folders with those names are placed at the repository root.
- No originals modified, moved, deleted, committed, or uploaded. No compressed MP4 copies created.
- No Production components, project data, or page design changed. No YouTube or Facebook media accessed.
- Intermediate contact sheets and sampled PNGs remain in ignored preview/source-inspection/.
- Provide filename-to-Mux-Playback-ID mappings before integration. No secret Mux API keys belong in frontend files.

## Reproducing locally

Requires Node.js, sharp, and @ffmpeg-installer/ffmpeg (or FFMPEG_PATH pointing to FFmpeg), available in this workstation's parent node_modules. Run node scripts/inspect-production-sources.cjs with the source directory argument, review contact sheets, then run node scripts/prepare-production-posters.cjs. Selections in the latter script apply to this exact eight-file audit and must be reviewed if the input set changes.
