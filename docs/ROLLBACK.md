# Backup and rollback

The source commit immediately before the logo update is
`0c31430a7314f6916e774905afe887719305b94e`. Git history retains all previously
committed website assets. No history was rewritten during cleanup.

## Restore only the previous gold logo

From the repository root, after preserving any later work:

```powershell
git restore --source=0c31430a7314f6916e774905afe887719305b94e -- assets/images/otium-nexus-logo.png assets/favicon.png
git add -- assets/images/otium-nexus-logo.png assets/favicon.png
git commit -m "Restore previous Otium logo and favicon"
git push origin main
```

This leaves the client photo replacements and hero sequence in place. The same two
files also have standalone copies in
`_archive/brand-update-2026-11-17/before/assets/`.

## Revert the complete logo and cleanup commit

Find its commit with:

```powershell
git log --oneline --grep="Apply earthy logo and archive design originals"
```

Run `git revert <commit-id>` and then `git push origin main`. This creates an auditable
reversal, restoring the previously tracked loose original files as well as the brand
assets and markup. Local archives remain available. Review later dependent changes
before reverting an older commit.

## Local snapshot and design archive

`_archive/brand-update-2026-11-17/` contains:

- `site-before-logo-update.zip`: all files tracked at the pre-update commit, preserving
  their paths. Git metadata, dependencies, private configuration and untracked review
  files are not part of this ZIP.
- `before/assets/`: standalone original logo and favicon.
- `concepts-before-cleanup/`: every logo concept, working render, presentation and prompt
  record from before the cleanup, with relative paths preserved.
- `loose-originals/`: the two unused root PNGs and the original client photo ZIP.
- `backup-manifest.json` and `cleanup-manifest.json`: hashes, source commit, archived
  paths and verification results.

Extract the snapshot into a separate empty folder first when recovering files. The
local archive is ignored by Git and is not uploaded to either website host. Keep a
separate copy of it when transferring or backing up this workspace.
