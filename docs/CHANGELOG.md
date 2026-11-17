# Website change log

## 18 November 2026 - Complete client website text

- Applied all 65 non-empty paragraphs and placement instructions from the supplied
  Word document, with exact English copy and complete French and Arabic translations.
- Updated the homepage, Our Story and About page, Productions and Events pages,
  company directory, shared identity, office cities, metadata and inquiry branding.
- Added Productions and Events dialogs while preserving full-page links, the
  approved logo, photography, animation frames and video portfolio.
- Removed the obsolete rule that stripped international positioning from copy.
- Added a source-document hash and paragraph-by-paragraph coverage report. See
  [the content update guide](CLIENT-CONTENT-UPDATE.md).
- Validation passed: 65/65 document paragraphs, all three languages, six responsive
  pages at widths down to 320 pixels, dialog controls and focus restoration, asset
  and navigation checks, local inquiry downloads, and the production build.

## 17 November 2026 - Approved earthy logo and folder cleanup

- Applied the approved earthy-gradient logo to the shared website asset. Retained
  the sculptural I, original lettering and depth; removed the airplane and extended
  NEXUS GROUP across the wordmark.
- Regenerated the browser icon from the approved I and versioned brand URLs to refresh
  cached images. Navbar and page sizing were retained.
- Kept one approved brand presentation and its generation directions in `docs/brand/`.
- Archived the loose original PNGs, client photo ZIP, and all previous logo concepts.
  Kept the organized photo-review folder in place because the media scripts use it.
- Created a complete ZIP of the previously committed site plus separate previous
  logo/favicon copies and hashes before editing. Backup location:
  `_archive/brand-update-2026-11-17/`.
- Previous source commit: `0c31430a7314f6916e774905afe887719305b94e`.
- Per-file source/destination paths and verification hashes are in
  [the brand manifests](brand/README.md). Recovery: [ROLLBACK.md](ROLLBACK.md).
- Validation: production build, all six pages and 290 frame files, approved asset hash,
  and unchanged navbar/logo dimensions at 1440, 390 and 320 pixels. Detailed results:
  [verification.json](brand/verification.json).
- Cleanup exception: Windows is retaining two empty concept working directories locally
  until their handles are released. All actual concept files are already backed up and
  removed from the working folder; paths are recorded in the cleanup manifest.

## 17 November 2026 - Client photography and hero

- Commit `0c31430`: replaced stock images with approved client photos, added About/Story
  imagery, and built the London / Qatar desert / Beirut photo-animation hero.
- Verified all six pages and 290 frames, forward/reverse scroll, reduced motion,
  loader fallbacks, slideshows, and desktop/mobile layouts in English, French and Arabic.
- Previous photo delivery images and portal frames are preserved locally under
  `_archive/client-photo-update-2026-11-17/`.
