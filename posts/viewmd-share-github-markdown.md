---
title: viewmd — Share GitHub Markdown Files as Clean Readable Pages
description: viewmd renders GitHub Markdown files directly in the browser, without the GitHub interface.
date: 2026-06-01
tags: [info]
---

GitHub's interface works well for developers, but it's not built for reading. On mobile especially, a Markdown file opens surrounded by file trees, action buttons, and repo navigation — most of which the reader doesn't need.

[viewmd](https://viewmd.github.io) strips all of that away and renders the file as a clean readable page.

---

### Two practical uses

**Sharing documentation or guides.** If you want to point someone to a README or a setup guide from your repository, a viewmd link gives them just the content — nothing else. No distractions, no GitHub account required, works cleanly on mobile.

**Publishing Markdown without a website.** If you write in Markdown and store files on GitHub, viewmd lets you share them as readable pages without setting up GitHub Pages or any hosting. The file stays where it is; viewmd handles the rendering.

---

### How to use it

Replace `github.com` with `viewmd.github.io` in any GitHub file URL:

```
https://github.com/owner/repo/blob/main/README.md
→
https://viewmd.github.io/owner/repo/blob/main/README.md
```

Opening `viewmd.github.io/owner/repo` without a file path loads the repository's `README.md` directly.

---

### Source

[github.com/viewmd/viewmd.github.io](https://github.com/viewmd/viewmd.github.io)
