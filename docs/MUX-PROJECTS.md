# Production Projects: Mux handover

The repository remains static HTML/CSS/JavaScript, compatible with its existing GitHub Pages deployment. A small React integration boundary is used exclusively for the requested MuxPlayer; React, ReactDOM and Mux are bundled together and loaded as a classic script only after clicking a Production project. No Next.js migration was performed. Posters use native lazy images with explicit 640x360 dimensions because Next/Image requires Next.js.

## Playback mapping

Runtime source of truth: data/portfolio.js. Edit muxPlaybackId there to replace a video. The audit manifest in docs/production-source-manifest.json also records each source's Playback ID. Preserve source/poster/title associations. Years remain null because verified dates have not been supplied; original categories and card order are preserved.

Although the supplied numbering was described as source-audit order, inspection of all eight public Mux HLS manifests and thumbnails showed a different order. The mapping below follows actual content and matching duration, not the supplied ordinal. Mux durations differ by roughly 0.02?0.04 seconds from source container durations.

| Existing card | Title | Original source | Supplied Mux project number | Playback ID |
|---|---|---|---|---|
| 1 | دور الصندوق الكويتي في مشاريع الطاقة المختلفة | Kuwait Fund's role in Energy Sectors | videoplayback.mp4 | 2 | `W96mHUHZ01NNOLI7gP01J3z6ksbMLbbb015w49W01nNbQsE` |
| 2 | كافيه الحي - (Season 1-Official Trailer) | videoplayback (1).mp4 | 8 | `rpNCPKMm3eruVUyFoZ02W6DZfvghzaLY4V00yYZ01DZjXA` |
| 3 | كافيه الحي الموسم الأول – الحلقة الأولى: اعطيني فرصة | videoplayback (2).mp4 | 4 | `tgIDCNqTrW9yyQWE5nIWU7LTcZ5mIgXP90199XVpzi01o` |
| 4 | كافيه الحي – الموسم الأول الحلقة الثانية: شي مخبّى | videoplayback (3).mp4 | 7 | `KsouvbeBCkd0102WTUaJfcNdad3citR7wzFv4uba7st00M` |
| 5 | كافيه الحي – الموسم الأول الحلقة الثالثة: نحنا شركاء | videoplayback (4).mp4 | 6 | `m9euOlfMpiUDcENBRDB1UgTsr8KgcOwDUaCW01khPjsk` |
| 6 | كافيه الحي – الموسم الأول الحلقة الرابعة: لمصلحتك | videoplayback (5).mp4 | 5 | `pZCB5TqBYNDWkr00finGBX01OmU5RtjS83ZE5fP01IBe9Q` |
| 7 | كافيه الحي – الموسم الأول الحلقة الخامسة: الوقت عم يسبقنا | videoplayback (7).mp4 | 3 | `yhHj4w4iIZpQjAt628mNihWjYEXVFT78R5nspBHTKXY` |
| 8 | كافيه الحي – الحلقة السادسة: نجحنا! | videoplayback (8).mp4 | 1 | `4V02002tT69Cd00CIYpF8iXQl47XKoRIARBrhzhJdyYlns` |

## Loading and cleanup

Initial HTML contains only local WebP posters. No Mux component, React root, iframe, video, player bundle, remote thumbnail, or stream is initialized before a click. A click opens the existing native dialog, locks background scrolling, displays loading feedback and loads js/generated/otium-video-player.js. One React root mounts one MuxPlayer for the selected ID with click-initiated autoplay, inline playback, on-demand controls, Otium colors, and the local poster. Browser autoplay restrictions may still require pressing Play; controls remain available. No resolution forcing or source upscaling is configured.

Close/Escape/outside click pauses playback, removes its source and unmounts the React root. Mux disconnect cleanup releases HLS resources. A generation token prevents late script loads from creating players after closing or switching. The downloaded module is cached for later opens, but the video player is recreated. Loading errors expose a retry action. Native dialog provides focus containment and background inertness; focus and scroll are restored on close. Mux tracking and cookies are disabled.

## Build and local preview

Run npm ci, then npm run build. The build bundles the player and regenerates production/index.html only. Run npm run dev and open http://127.0.0.1:4173/production/. Run npm run test:portfolio with Chrome installed for live streaming tests. No TypeScript/Next.js build exists in this repository. Commit the generated js/generated files for the current branch-based static hosting workflow. The generated bundle includes linked third-party license notices.

Direct runtime packages: @mux/mux-player-react 3.13.4, react 19.3.0, react-dom 19.3.0. Development packages: esbuild 0.28.2 and playwright-core 1.63.0. package-lock.json pins the full dependency graph. npm installation audit reported zero vulnerabilities.

The player bundle is 1.36 MB uncompressed, approximately 398 KB gzip. It includes the requested React integration plus Mux/HLS controls, and is entirely deferred until interaction. No external player CDN is required.

## Verification completed

- Production build passed; all eight actual streams played in headless Chrome, not mocked players.
- Each card's mounted Playback ID matched the mapping; only one player existed.
- Close paused and disconnected the retained player reference; no new stream requests after close in the observation window.
- Different cards reopened their corresponding stream; closing during slow script loading did not create an orphan player.
- Zero Mux requests and zero player-bundle requests before clicking.
- 1440px, 768px, 390px and 320px layouts passed: 16:9 stage, no horizontal overflow, inline playback, fullscreen entry/exit, play/pause, seek, mute/volume, Escape, outside click, focus restoration and filters.
- Mobile layouts were checked through browser viewports, not physical iOS/Android devices.
- Original MP4s remain outside the repository; /local-videos/ and /Otium-Source-Videos/ are ignored. Git tracks no MP4s.

Source quality remains 360p and will look soft on large displays. Future higher-resolution masters can replace the IDs and posters without redesigning the cards. Videos are scoped to Production Projects only. The integration is now deployed on GitHub Pages and Vercel; use the root README for current build and deployment commands.

## Files in this integration

Created: package.json, package-lock.json, scripts/build-player.cjs, scripts/build-production.cjs, src/otium-video-player.jsx, js/generated/otium-video-player.js, js/generated/otium-video-player.js.LEGAL.txt, docs/MUX-PROJECTS.md.

Modified: data/portfolio.js, docs/production-source-manifest.json, js/portfolio.js, portfolio.css, scripts/portfolio-component.cjs, scripts/check-portfolio.cjs, production/index.html.

Existing posters, source audit scripts/report and .gitignore changes came from the preceding inspection task. No source video was copied, edited, encoded, committed or uploaded in this integration. Local verification screenshots/logs are ignored under preview/.

Reference: https://www.mux.com/docs/guides/player-api-reference/react

## Playback recovery follow-up

The lazy bundle now uses a classic script rather than an ES module import, supporting direct-file previews and avoiding cached failed module imports. Failed script tags are removed and Retry makes a fresh request. Loader and stream errors have distinct messages and console diagnostics. canplay/playing clears the error overlay when a transient stream failure recovers. scripts/check-player-recovery.cjs verifies a failed first bundle request followed by actual playback on Retry at http://localhost:4173, plus transient error recovery and cleanup. All eight streams also passed the normal player checks. The reported localhost error was not reproduced in a clean browser; direct-file module blocking was reproduced separately.
