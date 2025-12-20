document.addEventListener('DOMContentLoaded', () => {
    if (typeof userInfo === 'undefined') return;

    const els = {
        avatar: document.getElementById('avatar'),
        user: document.getElementById('username_display'),
        bio: document.getElementById('aboutText'),
        projects: document.getElementById('projectsLink'),
        support: document.getElementById('supportLink'),
        socials: document.getElementById('socialLinks'),
        favicon: document.getElementById('favicon')
    };

    if (els.avatar) els.avatar.src = userInfo.avatar_url;
    if (els.favicon) els.favicon.href = userInfo.avatar_url;
    if (els.user) els.user.textContent = userInfo.username_github;
    if (els.bio) els.bio.textContent = userInfo.about_me;
    if (els.projects) els.projects.href = userInfo.projects_url;
    if (els.support) els.support.href = userInfo.support;

    if (els.socials) {
        const links = [
            { id: 'mail', url: `mailto:${userInfo.email}`, color: '#8B5CF6', svg: '<path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>' },
            { id: 'x', url: `https://x.com/${userInfo.username_x}`, color: '#000000', svg: '<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>' },
            { id: 'tg', url: `https://t.me/${userInfo.username_telegram}`, color: '#24A1DE', svg: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>' }
        ];

        els.socials.innerHTML = links.map(l => `
            <a href="${l.url}" target="_blank" class="social-link" aria-label="${l.id}" style="color: ${l.color}">
                <svg viewBox="0 0 24 24">${l.svg}</svg>
            </a>
        `).join('');
    }
});
