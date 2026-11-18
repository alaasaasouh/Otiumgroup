# Homepage video scroll animation

## Current three-photo sequence — 17 November 2026

The homepage now scrolls through London production, Qatar desert filming, and a Beirut
seaside dinner. Sources: `home_hero_1_london.jpg`, `natgeo_qatar_desert.jpg`, and
`home_hero_3_beirut.jpg` in `Client Photos - Review/`.

- Rebuild with `node scripts/build-client-hero-frames.cjs` (Sharp and FFmpeg required).
- 145 desktop JPEGs at 1280 × 720 and 145 separately composed portrait JPEGs at 540 × 960.
- Original portal frames are preserved in `_archive/client-photo-update-2026-11-17/frames/`.
- A 12-second, 12-fps review MP4 is exported to
  `Client Photos - Review/Hero Animation - London Qatar Beirut.mp4`.
- This is photo animation: gentle 4.5% camera pushes with two soft dissolves. It does
  not simulate moving water, people, or candle flames. The available Weave video service
  requires linking the user's Figma account before generative video can be produced.
- Phone framing is baked separately for each scene to preserve the camera/bridge,
  desert crew, and Beirut rocks/table. Runtime and static phone posters use centered cover.
- The existing 145-frame contract, bounded cache, loader, forward/reverse scroll,
  reduced-motion, data-saving, and failed-frame fallbacks remain in place.

## Historical portal animation

The original portal notes below are retained for reference. The former 6-second footage
describes that historical source. Its superseded extractor was removed in the
18 November cleanup and remains recoverable in Git history.

The golden portal moved toward the event space as visitors scrolled down and reversed when they scrolled up. Only the homepage used this effect.

- Source: the supplied `_archive/vid16.mp4`, 6.04 seconds, 1280 Ã— 720, 24 fps. Original preserved.
- Assets: 145 JPG frames in `frames/`, plus 960px mobile renditions in `frames/mobile/`.
- Runtime: plain HTML, CSS, and vanilla JavaScript. No framework, CDN, autoplay player, or audio.
- Scroll length: `250svh` desktop and `215svh` mobile, including the visible hero height. Edit these values in `hero.css` to change the duration.
- Motion: `js/hero.js` maps scrolling to frames, with easing of `.18`. A higher value follows scrolling more directly.
- Memory: at most four image requests at once, with a bounded decoded-image cache and nearby-frame loading. Frames are requested as needed, rather than downloading the entire sequence upfront.
- Fallbacks: the first frame is a normal image. Reduced motion, supported data-saving preferences, or unavailable canvas retain a static hero without the extra scrolling. No JavaScript also leaves normal document flow. Failure to load the initial animation frame disables the pinned sequence.
- The landscape footage fills the viewport, so phones crop its sides. The crop is positioned at 60% to favor the portal and stage.

## Changing it later

The homepage loading screen offers English, العربية, and Français before entry. The animation loads and decodes its opening frames behind this screen; choosing any language reveals the prepared homepage in the selected language without another request for the page. The picker remains until a choice is made, even after the first nine frames are ready. Visitors may enter while preparation continues. Reduced-motion and data-saving preferences keep the picker but use the static hero.

**Translations (5 October 2026):** English, professional French, and Modern Standard Arabic are functional across all ten pages. Choices are saved locally, internal navigation carries the language, and Arabic uses a right-to-left layout. See [TRANSLATIONS.md](TRANSLATIONS.md) for editing and rollback.

The picker markup is in `scripts/home-intro-markup.cjs`, its behavior in `js/home-intro.js`, and its styles in `hero.css`. Run `node scripts/check-loading.cjs` against the local preview server to check language entry, background loading, readiness, slow/failing frames, keyboard access, responsive layout, and static/script-failure fallbacks.

Edit hero copy and links in `scripts/render-pages.cjs`, then run `node scripts/render-pages.cjs --home-only`. Generated markup lives in `index.html`. Appearance is in `hero.css`; behavior is in `js/hero.js`. Shared styles remain in `style.css`.

To rebuild the current sequence, edit the source selection and run
`node scripts/build-client-hero-frames.cjs` with Sharp and FFmpeg available. Update
`count` in `js/hero.js` only if the frame count changes. Verify the first and last
frames, crop, contrast, and file sizes after replacing imagery. The source photos
and media tools are not required on the public website; both JPG folders are.

Run `scripts/check-hero.cjs` with the installed Playwright path to verify forward and reverse playback, sticky positioning, mobile overflow, reduced motion, and the JavaScript-disabled poster. Screenshots are saved in `preview/hero-scroll-*.png`.

This addition supersedes earlier handover or presentation statements that the homepage video-scroll sequence was deferred. The existing client PDF has not been regenerated.

