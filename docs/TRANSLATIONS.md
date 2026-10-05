# French and Arabic

The site supports English, professional French, and Modern Standard Arabic on all ten pages. Choose a language on the homepage loading screen or use the header/footer selector. Arabic sets `lang="ar"` and `dir="rtl"`; the logo and video timeline keep their original direction.

The homepage animation prepares behind the picker. Choosing a language translates the already loaded page without restarting the animation or navigating again.

## Editing and behavior

- `data/translations.js`: English source strings mapped to `[French, Arabic]`. Update the corresponding key when changing English copy. Includes titles, descriptions, accessibility labels, form messages, and portfolio content.
- `js/i18n.js`: local translation, dynamic UI updates, saved choice, and internal links. `?lang=en`, `?lang=fr`, or `?lang=ar` takes priority over `localStorage` (`otium-language`). Links preserve the language even when storage is unavailable.
- `i18n.css`: language controls, responsive typography, and Arabic layout adjustments.
- `scripts/localization-markup.cjs`: shared translation hooks and language selectors, used by the page generator.
- `js/contact.js`: localized validation and downloadable inquiry briefs. Visitor-entered content remains unchanged. Email delivery is configured through FormSubmit; see [CONTACT.md](CONTACT.md) for activation.
- `src/media-ar.js`: Arabic video-control translations. French controls use the bundled Media Chrome translation. Rebuild the player after editing these files. Video audio, artwork, and embedded text remain the original media.

English remains the source HTML and the fallback when JavaScript or translation files are unavailable. Translations run in the browser; this change does not introduce separately rendered search-indexable locale pages or alter existing canonical URLs. No external translation service is used.

Run `npm run test:i18n` with the local preview running. It checks source coverage, all ten pages at desktop/tablet/mobile sizes, language navigation, form validation and downloads, background animation continuity, video playback controls, storage restrictions, no-JavaScript fallback, and the English rollback setting.

## Reverting

The translation work is isolated on `feature/french-arabic`. The pre-translation version is saved as Git tag `before-translations-2026-10-05`, pointing to `085448421a0b9c1c14688339a8f290d1e09319e7`.

For a quick English-only content fallback, set `localizationEnabled: false` in `data/site.js`. All three entry buttons then open English and the language selectors disappear. The localization assets and layout layer remain installed.

For a complete rollback after merging, revert the translation commit with `git revert <translation-commit>`, then publish that revert. This preserves the existing history and later unrelated changes. Before merging, `main` remains the original English version. Keep any uncommitted work safe before switching branches.
