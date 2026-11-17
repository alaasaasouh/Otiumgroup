# Approved Otium identity

Approved on 17 November 2026: the original OTIUM lettering and sculptural I, with
earthy beige, taupe, and muted olive gradients, no airplane, and NEXUS GROUP spanning
the full wordmark width.

- Website master: [otium-nexus-logo.png](../../assets/images/otium-nexus-logo.png).
- Presentation: [interactive proof](logo-presentation.html) and [PNG preview](logo-preview.png).
- Generation directions: [generation-prompts.json](generation-prompts.json). The built-in
  image generation tool edited the original supplied logo; the approved PNG was copied
  into the website without further recoloring or geometry changes.
- Asset dimensions, SHA-256 hashes, and previous source commit: [asset manifest](asset-manifest.json).
- Archived files and verification: [cleanup manifest](cleanup-manifest.json).

The approved master is a transparent 2172 x 724 PNG. All six pages share the same
asset. Navbar, footer, and language-picker dimensions were retained. The browser icon
is generated from the central I by `node scripts/build-brand.cjs`. Brand asset URLs
include a version suffix to refresh cached copies.

All original concepts, including the rejected minimal direction and intermediate
renders, are preserved in `_archive/brand-update-2026-11-17/concepts-before-cleanup/`.
Loose original files and the client photo ZIP are in that archive's `loose-originals/`.
The organized `Client Photos - Review/` folder remains available for viewing and for
the image preparation scripts. Archives and review originals stay out of deployments.

See [rollback instructions](../ROLLBACK.md) and the [change log](../CHANGELOG.md).
