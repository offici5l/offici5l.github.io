'use strict';

const esc = s => String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

const SVG = {
  sun:  `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,
  moon: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,
  pin:  `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M16 2H8a1 1 0 0 0-.7 1.71L11 7.41V18a1 1 0 0 0 .55.89l2 1A1 1 0 0 0 15 19V7.41l3.71-3.71A1 1 0 0 0 16 2z"/></svg>`,
  github:   `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.87-1.54-3.87-1.54-.52-1.32-1.27-1.68-1.27-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.25 3.34.95.1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.08-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.21-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.77.11 3.06.74.8 1.19 1.82 1.19 3.08 0 4.42-2.69 5.39-5.26 5.68.41.35.78 1.05.78 2.12 0 1.53-.01 2.76-.01 3.14 0 .31.21.67.8.56 4.57-1.52 7.86-5.83 7.86-10.91C23.5 5.65 18.35.5 12 .5z"/></svg>`,
  telegram: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z"/></svg>`,
  twitter:  `<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
  email:    `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>`,
};

(function () {
  const DARK  = '/assets/hljs/github-dark.min.css';
  const LIGHT = '/assets/hljs/github.min.css';
  const root  = document.documentElement;

  function apply(t) {
    root.setAttribute('data-theme', t);
    localStorage.setItem('theme', t);
    const l = document.getElementById('hljs-theme');
    if (l) l.href = t === 'light' ? LIGHT : DARK;
    const btn = document.getElementById('theme-btn');
    if (btn) btn.innerHTML = t === 'dark' ? SVG.sun : SVG.moon;
  }

  apply(localStorage.getItem('theme') || 'dark');

  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('theme-btn');
    if (btn) btn.addEventListener('click', () =>
      apply(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'));
  });
})();

document.addEventListener('DOMContentLoaded', async () => {
  const postsEl  = document.getElementById('posts');
  const filterEl = document.getElementById('tag-filter');
  if (!postsEl) return;

  let cfg = {};
  try { const r = await fetch('/config.json'); if (r.ok) cfg = await r.json(); } catch {}
  const { name='', bio='', avatar='', siteDesc='', siteUrl='',
          username_github:gh='', username_telegram:tg='',
          username_twitter:tw='', email:em='' } = cfg;

  if (name) document.title = name;
  const sm = (s,v) => { if(v) document.querySelector(s)?.setAttribute('content',v); };
  sm('meta[name="description"]',        siteDesc);
  sm('meta[property="og:title"]',       name);
  sm('meta[property="og:description"]', siteDesc);
  sm('meta[property="og:url"]',         siteUrl + '/');
  sm('meta[property="og:image"]',       avatar);
  sm('meta[name="twitter:title"]',      name);
  sm('meta[name="twitter:description"]',siteDesc);
  sm('meta[name="twitter:image"]',      avatar);

  const avatarEl = document.querySelector('.avatar');
  if (avatarEl && avatar) {
    if (!avatarEl.getAttribute('src')) avatarEl.src = avatar;
    avatarEl.alt = name;
  }

  const bioEl = document.querySelector('.identity-bio');
  if (bioEl && bio) bioEl.textContent = bio;

  const socialsEl = document.getElementById('socials');
  if (socialsEl) {
    const links = [];
    if (gh) links.push({ href: `https://github.com/${gh}`, label: 'GitHub', icon: SVG.github });
    if (tg) links.push({ href: `https://t.me/${tg}`, label: 'Telegram', icon: SVG.telegram });
    if (tw) links.push({ href: `https://twitter.com/${tw}`, label: 'Twitter / X', icon: SVG.twitter });
    if (em) links.push({ href: `mailto:${em}`, label: 'Email', icon: SVG.email });
    if (links.length) {
      socialsEl.className = 'socials';
      socialsEl.innerHTML = links.map(l =>
        `<a class="social-link" href="${esc(l.href)}" aria-label="${esc(l.label)}" rel="me noopener" target="_blank">${l.icon}</a>`
      ).join('');
    }
  }

  let posts = [];
  try { const r = await fetch('/posts.json'); if (r.ok) posts = await r.json(); } catch {}

  if (!posts.length) {
    postsEl.innerHTML = '<p class="posts-empty">no posts yet.</p>';
    return;
  }

  const pinned  = posts.filter(p => p.pinned);
  const regular = posts.filter(p => !p.pinned);
  const allTags = [...new Set(regular.flatMap(p => p.tags || []))].sort();

  const renderPost = p => {
    const d    = new Date(p.date);
    const date = p.date && !isNaN(d) ? d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '';
    return `<a class="post" href="/${esc(p.slug)}/" data-tags="${esc((p.tags||[]).join(','))}">
  <span class="post-title">${esc(p.title)}</span>
  ${date ? `<span class="post-date">${esc(date)}</span>` : ''}
</a>`;
  };

  const pinnedWrap = document.getElementById('pinned-section');
  if (pinned.length && pinnedWrap) {
    pinnedWrap.innerHTML =
      `<div class="pinned-header" aria-label="pinned">${SVG.pin}<span class="pinned-rule"></span></div>` +
      pinned.map(renderPost).join('');
  } else if (pinnedWrap) {
    pinnedWrap.style.display = 'none';
  }

  if (filterEl && allTags.length) {
    filterEl.className = 'tag-filter';
    filterEl.innerHTML =
      `<button class="tag-btn active" data-tag="all">all</button>` +
      allTags.map(t => `<button class="tag-btn" data-tag="${esc(t)}">${esc(t)}</button>`).join('');

    filterEl.addEventListener('click', e => {
      const btn = e.target.closest('.tag-btn');
      if (!btn) return;
      filterEl.querySelector('.tag-btn.active')?.classList.remove('active');
      btn.classList.add('active');
      const active = btn.dataset.tag;
      postsEl.querySelectorAll('.post').forEach(el => {
        const tags = (el.dataset.tags || '').split(',');
        el.style.display = (active === 'all' || tags.includes(active)) ? '' : 'none';
      });
    });
  } else if (filterEl) {
    filterEl.style.display = 'none';
  }

  if (regular.length) {
    postsEl.innerHTML = regular.map(renderPost).join('');
  } else if (!pinned.length) {
    postsEl.innerHTML = '<p class="posts-empty">no posts yet.</p>';
  }
});
