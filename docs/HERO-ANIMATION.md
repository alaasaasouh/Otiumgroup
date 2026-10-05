# Homepage video scroll animation

The golden portal moves toward the event space as visitors scroll down and reverses when they scroll up. Only the homepage uses this effect. Headings, buttons, navigation, and the rest of the page retain their existing functions.

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

To replace the footage, update the source and run `node scripts/extract-hero-frames.cjs`. This development helper uses the already-installed `@ffmpeg-installer/ffmpeg`, or an executable path supplied through `FFMPEG_PATH`. Update `count` in `js/hero.js` if the frame count changes. Verify the first and last frames, crop, contrast, and file sizes after replacing footage. The source video and extraction tools are not required on the public website; the JPG folders are.

Run `scripts/check-hero.cjs` with the installed Playwright path to verify forward and reverse playback, sticky positioning, mobile overflow, reduced motion, and the JavaScript-disabled poster. Screenshots are saved in `preview/hero-scroll-*.png`.

This addition supersedes earlier handover or presentation statements that the homepage video-scroll sequence was deferred. The existing client PDF has not been regenerated.

