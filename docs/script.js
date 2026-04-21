document.getElementById('ava').src = INFO.avatar;
document.getElementById('ava').alt = INFO.username;
document.title = INFO.username;
document.getElementById('github-btn').href = INFO.github;

const favicon = document.createElement('link');
favicon.rel = 'icon'; favicon.href = INFO.avatar;
document.head.appendChild(favicon);

const SOCIALS = [
  { href: INFO.telegram, label: 'Telegram',
    svg: '<svg viewBox="0 0 24 24" fill="currentColor" style="color:#24a1de"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/></svg>' },
  { href: INFO.twitter, label: 'X / Twitter',
    svg: '<svg viewBox="0 0 24 24" fill="currentColor" style="color:#111"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>' },
  { href: 'mailto:' + INFO.email, label: INFO.email,
    svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" style="color:#888"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5"/></svg>' }
];

const slist = document.getElementById('slist');
SOCIALS.forEach(s => {
  const a = document.createElement('a');
  a.href = s.href; a.className = 'pill';
  if (!s.href.startsWith('mailto')) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
  a.innerHTML = s.svg + s.label;
  slist.appendChild(a);
});

const STAR = '<svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>';

function ago(d) {
  const s = Math.floor((Date.now() - new Date(d)) / 1000);
  if (s < 60)       return 'just now';
  if (s < 3600)     return Math.floor(s/60) + 'm ago';
  if (s < 86400)    return Math.floor(s/3600) + 'h ago';
  if (s < 2592000)  return Math.floor(s/86400) + 'd ago';
  if (s < 31536000) return Math.floor(s/2592000) + 'mo ago';
  return Math.floor(s/31536000) + 'y ago';
}

function esc(s) { return s.replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

function resizeThread() {
  const nodes  = document.querySelectorAll('.node');
  const last   = nodes[nodes.length - 1];
  const thread = document.getElementById('thread');
  const canvas = document.querySelector('.canvas');
  if (!last || !thread || !canvas) return;
  const cr = canvas.getBoundingClientRect();
  const lr = last.getBoundingClientRect();
  const padTop = parseFloat(getComputedStyle(canvas).paddingTop);
  thread.style.top    = padTop + 'px';
  thread.style.height = (lr.top - cr.top - padTop + lr.height / 2) + 'px';
}

const CYCLE = 9000;

function easePhase(t, start, end) {
  if (t < start) return 0;
  if (t > end) return 1;
  return (t - start) / (end - start);
}

function inPhase(t, start, end) {
  return t >= start && t < end;
}

function loop() {
  const t = (Date.now() % CYCLE) / CYCLE;
  const thread = document.getElementById('thread');
  const spark  = document.querySelector('.spark');
  if (!thread || !spark) { requestAnimationFrame(loop); return; }

  const h = thread.offsetHeight;

  const PHASES = {
    toActive:     [0.00, 0.18],
    activeCard:   [0.18, 0.38],
    toProjects:   [0.38, 0.50],
    projectCards: [0.50, 0.70],
    github:       [0.70, 0.80],
    toSocials:    [0.80, 0.88],
    socialPills:  [0.88, 1.00],
  };

  function lerp(a, b, t) { return a + (b - a) * Math.max(0, Math.min(1, t)); }

  let pos;
  if (t < 0.18)       pos = lerp(0,    0.22, t / 0.18);
  else if (t < 0.38)  pos = lerp(0.22, 0.28, (t - 0.18) / 0.20);
  else if (t < 0.50)  pos = lerp(0.28, 0.55, (t - 0.38) / 0.12);
  else if (t < 0.70)  pos = lerp(0.55, 0.68, (t - 0.50) / 0.20);
  else if (t < 0.80)  pos = lerp(0.68, 0.78, (t - 0.70) / 0.10);
  else if (t < 0.88)  pos = lerp(0.78, 0.88, (t - 0.80) / 0.08);
  else                pos = lerp(0.88, 1.00, (t - 0.88) / 0.12);

  const sparkY = -90 + pos * (h + 180);
  spark.style.top = sparkY + 'px';

  const isGreen = inPhase(t, PHASES.activeCard[0], PHASES.activeCard[1]);
  spark.style.background = isGreen
    ? 'linear-gradient(to bottom, transparent 0%, rgba(22,163,74,0.3) 20%, #16a34a 50%, rgba(22,163,74,0.3) 80%, transparent 100%)'
    : 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.15) 20%, #111 50%, rgba(0,0,0,0.15) 80%, transparent 100%)';

  const ava = document.querySelector('.ava');
  if (ava) ava.classList.toggle('pulse-green', isGreen);

  const activeDot = document.querySelector('.dot.green');
  if (activeDot) {
    activeDot.style.opacity = '1';
  }

  const activeCard = document.querySelector('.active-card');
  if (activeCard) {
    activeCard.classList.toggle('traced', inPhase(t, PHASES.activeCard[0], PHASES.activeCard[1]));
  }

  document.querySelectorAll('.gcard').forEach(c => {
    c.classList.toggle('traced', inPhase(t, PHASES.projectCards[0], PHASES.projectCards[1]));
  });

  const ghBtn = document.getElementById('github-btn');
  if (ghBtn) {
    ghBtn.classList.toggle('glowing', inPhase(t, PHASES.github[0], PHASES.github[1]));
  }

  const pills = document.querySelectorAll('.pill');
  pills.forEach((pill, i) => {
    const phaseStart = PHASES.socialPills[0] + i * (0.04);
    const phaseEnd   = PHASES.socialPills[1];
    pill.classList.toggle('glowing', inPhase(t, phaseStart, phaseEnd));
  });

  requestAnimationFrame(loop);
}

(async () => {
  try {
    const res   = await fetch(`https://api.github.com/users/${INFO.username}/repos?per_page=100&sort=pushed`);
    const repos = await res.json();
    const list  = repos
      .filter(r => !r.fork && r.description)
      .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at));

    if (!list.length) {
      document.getElementById('active-wrap').innerHTML = '<p style="color:var(--muted)">No projects found.</p>';
      resizeThread(); loop(); return;
    }

    const active = list[0];
    const rest   = list.slice(1).sort((a, b) => b.stargazers_count - a.stargazers_count);

    document.getElementById('active-wrap').innerHTML = `
      <a href="${active.html_url}" target="_blank" rel="noopener noreferrer" class="active-card">
        <div class="active-top">
          <div class="active-name">${esc(active.name)}</div>
          <span class="badge">Active</span>
        </div>
        <div class="active-desc">${esc(active.description)}</div>
        <div class="active-meta">
          ${active.stargazers_count > 0 ? `<span class="stars">${STAR}${active.stargazers_count}</span>` : ''}
          <span class="ago">Updated ${ago(active.pushed_at)}</span>
        </div>
      </a>`;

    document.getElementById('grid-wrap').innerHTML = rest.length ? `
      <div class="grid">
        ${rest.map(r => `
          <a href="${r.html_url}" target="_blank" rel="noopener noreferrer" class="gcard">
            <div class="gcard-top">
              <div class="gname">${esc(r.name)}</div>
              ${r.stargazers_count > 0 ? `<span class="stars">${STAR}${r.stargazers_count}</span>` : ''}
            </div>
            <div class="gdesc">${esc(r.description)}</div>
          </a>`).join('')}
      </div>` : '';

    resizeThread();
    window.addEventListener('resize', resizeThread);

  } catch {
    document.getElementById('active-wrap').innerHTML =
      '<p style="color:var(--muted);font-size:0.9rem">Failed to load projects.</p>';
    resizeThread();
  }

  loop();
})();

function cp(txt) {
  navigator.clipboard.writeText(txt).catch(() => {
    const t = document.createElement('textarea');
    t.value = txt; t.style.cssText = 'position:fixed;opacity:0';
    document.body.appendChild(t); t.select(); document.execCommand('copy'); t.remove();
  });
  const toast = document.getElementById('toast');
  toast.classList.add('on');
  setTimeout(() => toast.classList.remove('on'), 2000);
}
