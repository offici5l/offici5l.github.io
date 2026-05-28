# offici5l.github.io

Minimal personal site. Dark by default. Posts with tags and pinning. Zero JS frameworks.

## Setup

Fork or use as template. Name the repo `your-username.github.io`.

Edit `config.json`:

```json
{
  "name": "your-name",
  "bio": "one line about you",
  "avatar": "https://your-username.github.io/assets/images/avatar.webp",
  "username_github": "your-username",
  "username_telegram": "your-channel",
  "username_twitter": "your-handle",
  "email": "you@example.com",
  "siteDesc": "Short description for search engines.",
  "siteUrl": "https://your-username.github.io",
  "projects": []
}
```

Enable GitHub Pages: Settings → Pages → Deploy from branch `main`, folder `/`.

## Writing posts

Create a `.md` file in `posts/`:

```markdown
---
title: My Post
date: 2026-01-01
description: Short summary.
tags: [python, xiaomi]
pinned: true
---

Content here.
```

- `tags` — shown as filters on the homepage
- `pinned: true` — post stays at the top, visually separated from the rest

Push to `main`. GitHub Actions runs `build.py` and commits the generated files.

## Local preview

```bash
pip install markdown
python build.py
python -m http.server 8000
```

## Structure

```
├── posts/          ← your .md files go here
├── assets/         ← images and static files
├── config.json     ← site configuration
├── build.py        ← generates everything
├── main.css        ← styles
├── main.js         ← theme toggle + posts rendering
├── 404.html        ← not found page
└── .github/
    └── workflows/
        └── build.yml
```

Generated files (`index.html`, `feed.xml`, `sitemap.xml`, `robots.txt`, `posts.json`, `/{slug}/`) are committed by CI and listed in `.gitignore` to avoid noise in local diffs.

## License

MIT
