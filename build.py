#!/usr/bin/env python3
import os
import shutil
import re
import json
from datetime import datetime, timezone
from email.utils import format_datetime
from markdown_it import MarkdownIt
from mdit_py_plugins.tasklists import tasklists_plugin

def load_info():
    try:
        with open('config.json', encoding='utf-8') as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return {}

def _auto_site_url():
    owner     = os.environ.get('GITHUB_REPOSITORY_OWNER', '')
    repo      = os.environ.get('GITHUB_REPOSITORY', '')
    repo_name = repo.split('/')[-1] if '/' in repo else ''
    if owner and repo_name:
        if repo_name == f'{owner}.github.io':
            return f'https://{owner}.github.io'
        return f'https://{owner}.github.io/{repo_name}'
    return 'https://example.github.io'

_info     = load_info()
SITE_URL  = _info.get('siteUrl', '').rstrip('/') or _auto_site_url()
SITE_NAME = _info.get('name')     or ''
SITE_DESC = _info.get('siteDesc') or ''
SITE_BIO  = _info.get('bio')      or SITE_DESC
AVATAR    = _info.get('avatar')   or ''

POSTS_DIR = 'posts'
OUT_DIR   = 'public'
HLJS_VER  = '11.10.0'
HLJS_CSS  = '/assets/hljs/github.min.css'
HLJS_DARK = '/assets/hljs/github-dark.min.css'
HLJS_JS   = f'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/{HLJS_VER}/highlight.min.js'

FOUC = (
    '  <script>(function(){var t=localStorage.getItem("theme")||"dark";'
    'document.documentElement.setAttribute("data-theme",t);'
    'var l=document.getElementById("hljs-theme");'
    f'if(l)l.href=t==="light"?"{HLJS_CSS}":"{HLJS_DARK}";'
    '}());</script>\n'
)

SVG_SUN   = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>'
SVG_MOON  = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>'
SVG_BACK  = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="M12 5l-7 7 7 7"/></svg>'
SVG_SHARE = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>'
SVG_PIN   = '<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M16 2H8a1 1 0 0 0-.7 1.71L11 7.41V18a1 1 0 0 0 .55.89l2 1A1 1 0 0 0 15 19V7.41l3.71-3.71A1 1 0 0 0 16 2z"/></svg>'
CF_ANALYTICS = '<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon=\'{"token": "1825761b3d024affb84ca8cb579990bf"}\'></script>'

THEME_BTN = f'<button class="theme-btn" id="theme-btn" aria-label="Toggle theme">{SVG_SUN}</button>'

def make_renderer():
    md = MarkdownIt('commonmark', {'html': True, 'typographer': False})
    md.enable('table')
    md.enable('strikethrough')
    md.use(tasklists_plugin)
    return md

MD = make_renderer()

def render_markdown(text):
    html = MD.render(text)
    html = add_heading_ids(html)
    html = add_lang_labels(html)
    return html

def add_heading_ids(html):
    def make_id(text):
        slug = re.sub(r'<[^>]+>', '', text)
        slug = slug.lower().strip()
        slug = re.sub(r'[^\w\s-]', '', slug)
        slug = re.sub(r'[\s_]+', '-', slug)
        return slug
    def replace(m):
        tag, inner = m.group(1), m.group(2)
        return f'<{tag} id="{make_id(inner)}">{inner}</{tag}>'
    return re.sub(r'<(h[1-4])>(.*?)</\1>', replace, html, flags=re.DOTALL)

def add_lang_labels(html):
    def replace(m):
        lang = re.search(r'language-(\w+)', m.group(1))
        if not lang: return m.group(0)
        return f'<pre><span class="code-lang">{lang.group(1)}</span><code {m.group(1)}>'
    return re.sub(r'<pre><code ([^>]+)>', replace, html)

def esc(s):
    return str(s).replace('&','&amp;').replace('<','&lt;').replace('>','&gt;').replace('"','&quot;')

def parse_frontmatter(text):
    if not text.startswith('---'):
        return {}, text
    try:
        end = text.index('---', 3)
    except ValueError:
        return {}, text
    fm = {}
    for line in text[3:end].strip().splitlines():
        if ':' in line:
            k, v = line.split(':', 1)
            k, v = k.strip(), v.strip()
            if k == 'tags':
                fm[k] = [t.strip() for t in v.replace('[','').replace(']','').split(',') if t.strip()]
            else:
                fm[k] = v
    return fm, text[end + 3:].strip()

def slugify(filename):
    return 'post/' + os.path.splitext(filename)[0]

def fmt_date(s):
    try:
        return datetime.strptime(s, '%Y-%m-%d').strftime('%b %Y')
    except Exception:
        return s

def parse_date(s):
    try:
        return datetime.strptime(s, '%Y-%m-%d')
    except Exception:
        return datetime(1970, 1, 1)

def json_ld(title, desc, raw_date, url):
    d = {
        '@context':    'https://schema.org',
        '@type':       'Article',
        'headline':    title,
        'description': desc,
        'url':         url,
    }
    if raw_date:
        try:
            datetime.strptime(raw_date, '%Y-%m-%d')
            d['datePublished'] = raw_date
            d['dateModified']  = raw_date
        except ValueError:
            pass
    if SITE_NAME: d['author'] = {'@type': 'Person', 'name': SITE_NAME}
    if AVATAR:    d['image']  = AVATAR
    return f'  <script type="application/ld+json">{json.dumps(d, ensure_ascii=False)}</script>\n'

JS_THEME = """<script>
(function() {
  var DARK  = '/assets/hljs/github-dark.min.css';
  var LIGHT = '/assets/hljs/github.min.css';
  var root  = document.documentElement;
  function apply(t) {
    root.setAttribute('data-theme', t);
    localStorage.setItem('theme', t);
    var l = document.getElementById('hljs-theme');
    if (l) l.href = t === 'light' ? LIGHT : DARK;
    var btn = document.getElementById('theme-btn');
    if (btn) btn.innerHTML = t === 'dark' ? '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>' : '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  }
  var btn = document.getElementById('theme-btn');
  if (btn) btn.addEventListener('click', function() {
    apply(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });
})();
</script>"""

JS_COPY = """<script>
document.querySelectorAll('.article-body pre').forEach(function(pre) {
  var code = pre.querySelector('code');
  var lines = (code || pre).innerText.trim().split('\\n').length;
  if (lines < 3) return;
  var btn = document.createElement('button');
  btn.className = 'copy-btn'; btn.textContent = 'copy';
  btn.addEventListener('click', function() {
    navigator.clipboard.writeText((code || pre).innerText.trimEnd())
      .then(function() {
        btn.textContent = 'copied';
        setTimeout(function() { btn.textContent = 'copy'; }, 2000);
      })
      .catch(function() {
        btn.textContent = 'failed';
        setTimeout(function() { btn.textContent = 'copy'; }, 2000);
      });
  });
  pre.appendChild(btn);
});
</script>"""

JS_POST = """<script>
(function() {
  var bar = document.createElement('div');
  bar.className = 'reading-progress';
  document.body.prepend(bar);
  window.addEventListener('scroll', function() {
    var doc = document.documentElement;
    var pct = doc.scrollTop / (doc.scrollHeight - doc.clientHeight);
    bar.style.width = Math.min(100, pct * 100) + '%';
  }, { passive: true });
})();
document.querySelectorAll('.article-body h1[id], .article-body h2[id], .article-body h3[id], .article-body h4[id]').forEach(function(h) {
  var a = document.createElement('a');
  a.className = 'anchor'; a.href = '#' + h.id; a.textContent = '#';
  h.appendChild(a);
});
</script>"""

JS_SHARE = """<script>
(function() {
  var btn = document.querySelector('.share-btn');
  var label = btn && btn.querySelector('.share-label');
  if (!btn) return;
  btn.addEventListener('click', function() {
    if (navigator.share) {
      navigator.share({ title: document.title, url: window.location.href }).catch(function(){});
    } else {
      navigator.clipboard.writeText(window.location.href)
        .then(function() {
          if (label) label.textContent = 'copied!';
          setTimeout(function() { if (label) label.textContent = 'share'; }, 2000);
        })
        .catch(function() {
          if (label) label.textContent = 'failed';
          setTimeout(function() { if (label) label.textContent = 'share'; }, 2000);
        });
    }
  });
})();
</script>"""

def head(title, desc, og_type, url, extra_head=''):
    og_img  = f'  <meta property="og:image" content="{SITE_URL}{AVATAR}">\n'  if AVATAR else ''
    tw_img  = f'  <meta name="twitter:image" content="{SITE_URL}{AVATAR}">\n' if AVATAR else ''
    icon    = f'  <link rel="icon" type="image/png" sizes="32x32" href="/assets/images/favicon.png">\n' \
              f'  <link rel="icon" href="{AVATAR}" type="image/webp">\n' \
              f'  <link rel="apple-touch-icon" href="/assets/images/apple-touch-icon.png">\n' if AVATAR else ''
    return (
        '<!DOCTYPE html>\n<html lang="en" data-theme="dark">\n<head>\n'
        '  <meta charset="UTF-8">\n'
        '  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">\n'
        '  <meta name="color-scheme" content="dark light">\n'
        f'  <title>{esc(title)}</title>\n'
        f'  <meta name="description" content="{esc(desc)}">\n'
        f'  <meta name="author" content="{esc(SITE_NAME)}">\n'
        f'  <meta property="og:title" content="{esc(title)}">\n'
        f'  <meta property="og:description" content="{esc(desc)}">\n'
        f'  <meta property="og:type" content="{og_type}">\n'
        f'  <meta property="og:url" content="{url}">\n'
        f'{og_img}'
        '  <meta name="twitter:card" content="summary_large_image">\n'
        f'  <meta name="twitter:title" content="{esc(title)}">\n'
        f'  <meta name="twitter:description" content="{esc(desc)}">\n'
        f'{tw_img}'
        f'  <link rel="canonical" href="{url}">\n'
        f'  <link rel="alternate" type="application/rss+xml" title="{esc(SITE_NAME)}" href="{SITE_URL}/feed.xml">\n'
        f'{icon}'
        '  <link rel="preconnect" href="https://fonts.googleapis.com">\n'
        '  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
        '  <link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet">\n'
        f'  <link id="hljs-theme" rel="stylesheet" href="{HLJS_DARK}" '
        f'crossorigin="anonymous" integrity="sha384-wH75j6z1lH97ZOpMOInqhgKzFkAInZPPSPlZpYKYTOqsaizPvhQZmAtLcPKXpLyH">\n'
        '  <meta name="theme-color" media="(prefers-color-scheme: dark)"  content="#0a0a0a">\n'
        '  <meta name="theme-color" media="(prefers-color-scheme: light)" content="#fafafa">\n'
        '  <link rel="stylesheet" href="/main.css">\n'
        f'{FOUC}'
        f'{extra_head}'
        '</head>'
    )

def build_home(posts=None):
    posts = posts or []
    pinned  = [p for p in posts if p.get('pinned')]
    regular = [p for p in posts if not p.get('pinned')]

    def post_link(p):
        date_html = ''
        if p.get('date'):
            try:
                from datetime import datetime
                d = datetime.strptime(p['date'], '%Y-%m-%d')
                date_html = f'<span class="post-date">{d.strftime("%b %Y")}</span>'
            except Exception:
                pass
        return (
            f'<a class="post" href="/{esc(p["slug"])}/" '
            f'data-tags="{esc(",".join(p.get("tags",[])))}">'
            f'<span class="post-title">{esc(p["title"])}</span>{date_html}</a>'
        )

    pinned_html  = '\n'.join(post_link(p) for p in pinned)
    regular_html = '\n'.join(post_link(p) for p in regular)

    all_tags = sorted(set(t for p in regular for t in p.get('tags', [])))
    tag_btns = '<button class="tag-btn active" data-tag="all">all</button>' + ''.join(
        f'<button class="tag-btn" data-tag="{esc(t)}">{esc(t)}</button>' for t in all_tags
    )

    pinned_section = (
        f'<div id="pinned-section"><div class="pinned-header" aria-label="pinned">' +
        SVG_PIN +
        '<span class="pinned-rule"></span></div>' +
        pinned_html + '</div>'
    ) if pinned else '<div id="pinned-section" style="display:none"></div>'

    tag_filter = (
        f'<div id="tag-filter" class="tag-filter">{tag_btns}</div>'
    ) if all_tags else '<div id="tag-filter" style="display:none"></div>'

    posts_content = regular_html if regular else '<p class="posts-empty">no posts yet.</p>'

    return (
        head(SITE_NAME, SITE_DESC, 'website', SITE_URL + '/') + '\n'
        '<body>\n<div class="page">\n'
        '  <div class="topbar">\n'
        f'    {THEME_BTN}\n'
        '  </div>\n'
        '  <div class="header">\n'
        f'    <img class="avatar" src="{esc(AVATAR)}" alt="{esc(SITE_NAME)}" width="76" height="76" loading="eager" decoding="async">\n'
        f'    <p class="identity-bio">{esc(SITE_BIO)}</p>\n'
        '    <div id="socials"></div>\n'
        '  </div>\n'
        '  <hr class="divider" />\n'
        f'  {pinned_section}\n'
        f'  {tag_filter}\n'
        f'  <div id="posts">{posts_content}</div>\n'
        '</div>\n'
        '<script src="/main.js"></script>\n'
        f'{CF_ANALYTICS}\n'
        '</body>\n</html>'
    )

def build_post(meta, body_html, slug, prev_p=None, next_p=None):
    title    = meta.get('title', slug)
    desc     = meta.get('description', '')
    raw_date = meta.get('date', '')
    tags     = meta.get('tags', [])
    url      = f'{SITE_URL}/{slug}/'

    tags_html = ''
    if tags:
        tags_html = '<div class="article-tags">' + ''.join(
            f'<span class="tag">#{esc(t)}</span>' for t in tags
        ) + '</div>\n'

    share_btn = f'<button class="share-btn" aria-label="Share">{SVG_SHARE}<span class="share-label">share</span></button>'
    if raw_date:
        meta_line = (
            f'      <time datetime="{raw_date}">{fmt_date(raw_date)}</time>\n'
            f'      <span class="meta-sep">·</span>{share_btn}\n'
        )
    else:
        meta_line = f'      {share_btn}\n'

    nav = ''
    if prev_p or next_p:
        left  = (f'<a class="post-nav-link" href="/{esc(prev_p["slug"])}/">'
                 f'<span class="post-nav-label">&#8592; prev</span>{esc(prev_p["title"])}</a>') if prev_p else ''
        right = (f'<a class="post-nav-link post-nav-next" href="/{esc(next_p["slug"])}/">'
                 f'<span class="post-nav-label">next &#8594;</span>{esc(next_p["title"])}</a>') if next_p else ''
        nav   = f'<nav class="post-nav">{left}{right}</nav>'

    return (
        head(f'{title} — {SITE_NAME}', desc, 'article', url,
             extra_head=json_ld(title, desc, raw_date, url)) + '\n'
        '<body>\n<div class="page">\n'
        '  <div class="topbar">\n'
        f'    {THEME_BTN}\n'
        '  </div>\n'
        '  <div class="article-header">\n'
        f'    <a class="back-link" href="/" aria-label="Home">{SVG_BACK} back</a>\n'
        f'    <h1 class="article-title">{esc(title)}</h1>\n'
        f'    {tags_html}'
        '    <div class="article-meta">\n'
        f'{meta_line}'
        '    </div>\n'
        '  </div>\n'
        f'  <div class="article-body">{body_html}</div>\n'
        f'  {nav}\n'
        '</div>\n'
        f'<script src="{HLJS_JS}" crossorigin="anonymous" integrity="sha384-HGfztofotfshcF7+8n44JQL2oJmowVChPTg48S+jvZoztPfvwD79YC/1TGnU4R9H"></script>\n'
        '<script>hljs.highlightAll();</script>\n'
        f'{JS_THEME}\n{JS_COPY}\n{JS_POST}\n{JS_SHARE}\n'
        f'{CF_ANALYTICS}\n'
        '</body>\n</html>'
    )

def build_feed(posts):
    dated = [p for p in posts if p.get('date')]
    items = ''
    for p in dated:
        try:
            dt  = datetime.strptime(p['date'], '%Y-%m-%d').replace(tzinfo=timezone.utc)
            pub = format_datetime(dt)
        except Exception:
            continue
        items += (
            f'\n    <item>\n      <title>{esc(p["title"])}</title>\n'
            f'      <link>{SITE_URL}/{p["slug"]}/</link>\n'
            f'      <description>{esc(p.get("description",""))}</description>\n'
            f'      <pubDate>{pub}</pubDate>\n'
            f'      <guid isPermaLink="true">{SITE_URL}/{p["slug"]}/</guid>\n    </item>'
        )
    return (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n'
        f'  <channel>\n    <title>{esc(SITE_NAME)}</title>\n    <link>{SITE_URL}</link>\n'
        f'    <description>{esc(SITE_DESC)}</description>\n'
        f'    <atom:link href="{SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>\n'
        f'    <language>en</language>\n{items}\n  </channel>\n</rss>'
    )

def build_sitemap(posts):
    entries = [f'  <url><loc>{SITE_URL}/</loc></url>']
    for p in posts:
        loc = f'{SITE_URL}/{p["slug"]}/'
        if p.get('date'):
            entries.append(f'  <url><loc>{loc}</loc><lastmod>{p["date"]}</lastmod></url>')
        else:
            entries.append(f'  <url><loc>{loc}</loc></url>')
    return (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + '\n'.join(entries) +
        '\n</urlset>'
    )

def main():
    md_files = [f for f in os.listdir(POSTS_DIR) if f.endswith('.md')]
    posts    = []

    for filename in md_files:
        with open(os.path.join(POSTS_DIR, filename), encoding='utf-8') as f:
            raw = f.read()
        meta, body = parse_frontmatter(raw)
        slug = slugify(filename)
        posts.append({
            'slug':        slug,
            'title':       meta.get('title', slug),
            'description': meta.get('description', ''),
            'date':        meta.get('date', ''),
            'tags':        meta.get('tags', []),
            'pinned':      str(meta.get('pinned', '')).strip().lower() in ('true','1','yes'),
            '_meta':       meta,
            '_html':       render_markdown(body),
        })

    posts.sort(key=lambda p: (not p['pinned'], -parse_date(p['date']).timestamp()))

    for i, p in enumerate(posts):
        prev_p = {'slug': posts[i+1]['slug'], 'title': posts[i+1]['title']} if i+1 < len(posts) else None
        next_p = {'slug': posts[i-1]['slug'], 'title': posts[i-1]['title']} if i > 0      else None
        os.makedirs(os.path.join(OUT_DIR, p['slug']), exist_ok=True)
        with open(os.path.join(OUT_DIR, p['slug'], 'index.html'), 'w', encoding='utf-8') as f:
            f.write(build_post(p['_meta'], p['_html'], p['slug'], prev_p, next_p))
        print(f'  \u2713 /{p["slug"]}/')

    clean = [{k: v for k, v in p.items() if not k.startswith('_')} for p in posts]

    os.makedirs(OUT_DIR, exist_ok=True)

    with open(os.path.join(OUT_DIR, 'posts.json'), 'w', encoding='utf-8') as f:
        json.dump(clean, f, ensure_ascii=False, indent=2)
    print('  \u2713 posts.json')

    with open(os.path.join(OUT_DIR, 'feed.xml'), 'w', encoding='utf-8') as f:
        f.write(build_feed(clean))
    print('  \u2713 feed.xml')

    with open(os.path.join(OUT_DIR, 'sitemap.xml'), 'w', encoding='utf-8') as f:
        f.write(build_sitemap(clean))
    print('  \u2713 sitemap.xml')

    with open(os.path.join(OUT_DIR, 'index.html'), 'w', encoding='utf-8') as f:
        f.write(build_home(clean))
    print('  \u2713 index.html')

    with open(os.path.join(OUT_DIR, 'robots.txt'), 'w', encoding='utf-8') as f:
        f.write(f'User-agent: *\nAllow: /\nSitemap: {SITE_URL}/sitemap.xml\n')
    print('  \u2713 robots.txt')

    with open('requirements.txt', 'w', encoding='utf-8') as f:
        f.write('markdown-it-py\nmdit_py_plugins\n')
    print('  \u2713 requirements.txt')

    for static in ['main.css', 'main.js', '404.html']:
        if os.path.exists(static):
            shutil.copy2(static, os.path.join(OUT_DIR, static))
    for folder in ['assets']:
        src = folder
        dst = os.path.join(OUT_DIR, folder)
        if os.path.exists(src):
            if os.path.exists(dst):
                shutil.rmtree(dst)
            shutil.copytree(src, dst)

    print(f'\nDone \u2014 {len(posts)} post(s) | {SITE_URL}')

if __name__ == '__main__':
    main()
