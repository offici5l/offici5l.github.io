(function () {
  'use strict';

  var RAW = 'https://raw.githubusercontent.com/' + CONFIG.github + '/';

  var FETCH_TIMEOUT  = 10000;
  var MD_CACHE_LIMIT = 15;
  var CACHE_KEY      = 'gh_repos_v2';
  var CACHE_TIME_KEY = 'gh_repos_v2_time';
  var CACHE_MAX_AGE  = 60 * 60 * 1000;
  var MAX_PAGES      = 5;
  var README_VARIANTS = ['README.md', 'readme.md', 'Readme.md', 'README.MD'];

  var root       = document.documentElement;
  var aw         = document.getElementById('avatar-wrap');
  var list       = document.getElementById('projects-list');
  var backdrop   = document.getElementById('modal-backdrop');
  var modal      = document.getElementById('modal');
  var modalTitle = document.getElementById('modal-title');
  var modalBody  = document.getElementById('modal-readme');
  var backBtn    = document.getElementById('modal-back');
  var repoBtn    = document.getElementById('modal-repo-btn');
  var starsCount = document.getElementById('modal-stars-count');
  var srAlert    = document.getElementById('sr-alert');
  var modalClose = document.getElementById('modal-close');

  function esc(s) {
    return String(s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function setText(el, t) { el.textContent = t; }
  function announce(msg) {
    srAlert.textContent = '';
    setTimeout(function () { srAlert.textContent = msg; }, 50);
  }
  function dirOf(path) {
    if (!path) return '';
    var p = path.split('/'); p.pop(); return p.join('/');
  }
  function resolveUrl(repo, dir, href) {
    if (/^https?:\/\//.test(href)) return href;
    if (href.charAt(0) === '/') return RAW + repo + '/HEAD' + href;
    return RAW + repo + '/HEAD/' + (dir ? dir + '/' : '') + href;
  }
  function fetchWithTimeout(url, ms) {
    var ctrl = new AbortController();
    var tid  = setTimeout(function () { ctrl.abort(); }, ms);
    return fetch(url, { signal: ctrl.signal }).then(
      function (r) { clearTimeout(tid); return r; },
      function (e) { clearTimeout(tid); throw e; }
    );
  }
  function whenMarkedReady(fn) {
    if (window._markedReady) fn();
    else window._markedQueue.push(fn);
  }

  function applyTheme(t) {
    root.setAttribute('data-theme', t);
    localStorage.setItem('theme', t);
    aw.setAttribute('aria-label', t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    document.getElementById('meta-theme-color').setAttribute('content', t === 'dark' ? '#0c0c0c' : '#f9f9f9');
  }
  applyTheme(
    localStorage.getItem('theme') ||
    (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark')
  );
  aw.addEventListener('click', function () {
    applyTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });
  aw.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); aw.click(); }
  });

  function fetchPage(page) {
    return fetchWithTimeout(
      'https://api.github.com/users/' + CONFIG.github + '/repos?per_page=100&sort=pushed&page=' + page,
      FETCH_TIMEOUT
    ).then(function (r) {
      if (r.status === 403 || r.status === 429) throw new Error('rate_limit');
      if (!r.ok) throw new Error(r.status);
      return r.json();
    });
  }
  function fetchAllRepos() {
    var acc = [];
    function next(page) {
      if (page > MAX_PAGES) return Promise.resolve(acc);
      return fetchPage(page).then(function (repos) {
        if (!repos.length) return acc;
        acc = acc.concat(repos);
        return next(page + 1);
      });
    }
    return next(1);
  }

  var repoMap = {};

  list.addEventListener('click', function (e) {
    var card = e.target.closest('.project-card');
    if (!card) return;
    var repo = repoMap[card.dataset.repo];
    if (repo) whenMarkedReady(function () {
      openMd(repo.name, null, repo.name, repo.stargazers_count, repo.html_url);
    });
  });
  list.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    var card = e.target.closest('.project-card');
    if (!card) return;
    e.preventDefault(); card.click();
  });

  function renderProjects(repos) {
    var filtered = repos.filter(function (r) {
      return !r.fork && r.description && r.description.trim();
    });
    if (!filtered.length) {
      list.innerHTML = '<div class="state" style="grid-column:1/-1" role="status">No projects found.</div>';
      return;
    }
    repoMap = {};
    var frag = document.createDocumentFragment();
    filtered.forEach(function (repo) {
      repoMap[repo.name] = repo;
      var el = document.createElement('div');
      el.className = 'project-card';
      el.setAttribute('role', 'listitem');
      el.setAttribute('tabindex', '0');
      el.setAttribute('aria-label', repo.name + ': ' + repo.description);
      el.dataset.repo = repo.name;

      var nameEl = document.createElement('div');
      nameEl.className = 'card-name';
      nameEl.setAttribute('aria-hidden', 'true');
      setText(nameEl, repo.name);

      var descEl = document.createElement('div');
      descEl.className = 'card-desc';
      descEl.setAttribute('aria-hidden', 'true');
      setText(descEl, repo.description);

      el.appendChild(nameEl);
      el.appendChild(descEl);
      frag.appendChild(el);
    });
    list.innerHTML = '';
    list.appendChild(frag);
  }

  var cachedData = null, cachedTime = null;
  try {
    cachedData = localStorage.getItem(CACHE_KEY);
    cachedTime = localStorage.getItem(CACHE_TIME_KEY);
  } catch (_) {}

  var cacheValid = cachedData && cachedTime && (Date.now() - Number(cachedTime) < CACHE_MAX_AGE);

  if (cacheValid) {
    renderProjects(JSON.parse(cachedData));
  } else {
    if (cachedData) {
      try {
        var staleCount = Math.min(
          JSON.parse(cachedData).filter(function (r) {
            return !r.fork && r.description && r.description.trim();
          }).length, 8
        );
        if (staleCount !== 4)
          list.innerHTML = Array(staleCount).fill('<div class="skeleton-card" aria-hidden="true"></div>').join('');
      } catch (_) {}
    }
    fetchAllRepos()
      .then(function (repos) {
        var toCache = repos.filter(function (r) {
          return !r.fork && r.description && r.description.trim();
        });
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(toCache));
          localStorage.setItem(CACHE_TIME_KEY, String(Date.now()));
        } catch (_) {}
        renderProjects(toCache);
      })
      .catch(function (err) {
        if (cachedData) { renderProjects(JSON.parse(cachedData)); return; }
        var msg = err.message === 'rate_limit'
          ? 'GitHub rate limit reached, try again later.'
          : 'Could not load projects.';
        list.innerHTML = '<div class="state" style="grid-column:1/-1" role="alert">' + msg + '</div>';
        announce(msg);
      });
  }

  var FOCUSABLE   = 'a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])';
  var lastFocused = null;

  function trapFocus(e) {
    var els   = Array.prototype.slice.call(modal.querySelectorAll(FOCUSABLE));
    if (!els.length) return;
    var first = els[0], last = els[els.length - 1];
    if (e.shiftKey) { if (document.activeElement === first) { e.preventDefault(); last.focus(); } }
    else            { if (document.activeElement === last)  { e.preventDefault(); first.focus(); } }
  }

  var historyModalOpen = false;
  window.addEventListener('popstate', function () {
    if (historyModalOpen) closeModal(true);
  });

  var mdCache = {}, mdKeys = [];
  function setCached(key, html) {
    if (mdKeys.indexOf(key) === -1) {
      if (mdKeys.length >= MD_CACHE_LIMIT) delete mdCache[mdKeys.shift()];
      mdKeys.push(key);
    }
    mdCache[key] = html;
  }

  function renderMd(md, repo, filePath) {
    var dir      = dirOf(filePath);
    var renderer = new marked.Renderer();

    renderer.image = function (href, title, text) {
      var src = resolveUrl(repo, dir, href);
      return '<img src="' + esc(src) + '" alt="' + esc(text || '') + '"' +
        (title ? ' title="' + esc(title) + '"' : '') +
        ' loading="lazy" onerror="this.classList.add(\'img-error\')">';
    };
    renderer.link = function (href, title, text) {
      if (/\.md$/i.test(href) && !/^https?:\/\//.test(href)) {
        var resolved = href.charAt(0) === '/' ? href.slice(1) : (dir ? dir + '/' : '') + href;
        return '<a class="md-link" data-md="' + esc(resolved) + '" href="#">' + text + '</a>';
      }
      return '<a href="' + esc(resolveUrl(repo, dir, href)) + '" target="_blank" rel="noopener noreferrer"' +
        (title ? ' title="' + esc(title) + '"' : '') + '>' + text + '</a>';
    };

    var html = marked.parse(md, { renderer: renderer });
    html = html
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/\s+on\w+="[^"]*"/gi, '')
      .replace(/\s+on\w+='[^']*'/gi, '');

    var base = RAW + repo + '/HEAD/' + (dir ? dir + '/' : '');
    html = html.replace(
      /(<img[^>]+src=["'])(?!https?:\/\/|data:)([^"']+)(["'])/gi,
      function (m, pre, src, post) {
        return pre + (src.charAt(0) === '/' ? RAW + repo + '/HEAD' + src : base + src) + post;
      }
    );
    return html;
  }

  function attachLinks(repo, isRoot) {
    backBtn.classList.toggle('visible', !isRoot);
    modalBody.querySelectorAll('a[data-md]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        repoBtn.style.display = 'none';
        whenMarkedReady(function () {
          openMd(repo, a.getAttribute('data-md'), a.textContent.trim() || a.getAttribute('data-md'));
        });
      });
    });
  }

  function fetchReadme(repo) {
    var variants = README_VARIANTS.slice();
    function tryNext() {
      if (!variants.length) return Promise.reject(new Error('not found'));
      var name = variants.shift();
      return fetchWithTimeout(RAW + repo + '/HEAD/' + name, FETCH_TIMEOUT)
        .then(function (r) { return r.ok ? r.text() : tryNext(); }, tryNext);
    }
    return tryNext();
  }

  var currentRepo = null, rootEntry = null;

  function openMd(repo, filePath, title, stars, repoUrl) {
    currentRepo = repo;
    setText(modalTitle, title);

    if (!filePath && repoUrl) {
      repoBtn.href = repoUrl;
      setText(starsCount, stars || 0);
      repoBtn.style.display = 'inline-flex';
    } else {
      repoBtn.style.display = 'none';
    }

    modalBody.innerHTML = '<div class="state"><div class="spinner" role="status" aria-label="Loading"></div></div>';
    modalBody.scrollTop = 0;

    if (!backdrop.classList.contains('open')) {
      lastFocused = document.activeElement;
      backdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', onModalKeydown);
      history.pushState({ modal: true }, '');
      historyModalOpen = true;
      setTimeout(function () { modalClose.focus(); }, 280);
    }

    var key = repo + ':' + (filePath || 'README');
    if (mdCache[key]) { modalBody.innerHTML = mdCache[key]; attachLinks(repo, !filePath); return; }

    var p = filePath
      ? fetchWithTimeout(RAW + repo + '/HEAD/' + filePath, FETCH_TIMEOUT)
          .then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); })
      : fetchReadme(repo);

    p.then(function (md) {
      var html = renderMd(md, repo, filePath);
      setCached(key, html);
      if (!filePath) rootEntry = { title: title, html: html, stars: stars, repoUrl: repoUrl };
      modalBody.innerHTML = html;
      attachLinks(repo, !filePath);
    }).catch(function () {
      var msg = 'File not found.';
      modalBody.innerHTML = '<div class="state" role="alert">' + msg + '</div>';
      announce(msg);
    });
  }

  backBtn.addEventListener('click', function () {
    if (!rootEntry) return;
    setText(modalTitle, rootEntry.title);
    modalBody.innerHTML = rootEntry.html;
    modalBody.scrollTop = 0;
    repoBtn.href = rootEntry.repoUrl;
    setText(starsCount, rootEntry.stars || 0);
    repoBtn.style.display = 'inline-flex';
    attachLinks(currentRepo, true);
  });

  function onModalKeydown(e) {
    if (e.key === 'Escape') { closeModal(false); return; }
    if (e.key === 'Tab')    { trapFocus(e); }
  }

  function closeModal(fromPopstate) {
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onModalKeydown);
    if (lastFocused) { lastFocused.focus(); lastFocused = null; }
    if (!fromPopstate && historyModalOpen) history.back();
    historyModalOpen = false;
    setTimeout(function () { rootEntry = null; backBtn.classList.remove('visible'); }, 280);
  }

  modalClose.addEventListener('click', function () { closeModal(false); });
  backdrop.addEventListener('click', function (e) { if (e.target === backdrop) closeModal(false); });

}());
