document.addEventListener('DOMContentLoaded', () => {
    const { username, email, socialLinks } = userInfo;
    document.title = username;
    document.querySelector('meta[name="description"]').content = username;
    document.querySelector('meta[name="author"]').content = username;

    const app = document.getElementById('app-container');
    const githubApiUrl = `https://api.github.com/users/${username}`;
    const githubReposApiUrl = `https://api.github.com/users/${username}/repos`;
    const cacheKey = `userData_${username}`;
    const cacheTTL = 5 * 60 * 1000;

    const languageIcons = {
        JavaScript: 'devicon-javascript-plain',
        Python: 'devicon-python-plain',
        Java: 'devicon-java-plain',
        Ruby: 'devicon-ruby-plain',
        PHP: 'devicon-php-plain',
        C: 'devicon-c-plain',
        'C++': 'devicon-cplusplus-plain',
        'C#': 'devicon-csharp-plain',
        TypeScript: 'devicon-typescript-plain',
        Go: 'devicon-go-plain',
        Rust: 'devicon-rust-plain',
        HTML: 'devicon-html5-plain',
        CSS: 'devicon-css3-plain',
    };

    const template = `
        <main>
            <div id="loading-indicator">Loading...</div>
            <section id="about">
                <div class="avatar-container">
                    <img id="avatar" src="" alt="${username} Avatar" loading="lazy">
                </div>
                <p id="bio"></p>
            </section>
            <nav id="view-switcher">
                <button class="view-button" data-view="projects">Projects</button>
                <button class="view-button" data-view="contact-donate">Contact & Donate</button>
            </nav>
            <div id="content-container">
                <section id="contact-donate" class="content-view">
                    <div class="donate-contact-card">
                        <div class="bitcoin-donate">
                            <p class="email-label">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M48 64C21.5 64 0 85.5 0 112V400c0 26.5 21.5 48 48 48H464c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H48zm0 48H464V400H48V112zm208 208c-61.9 0-112-50.1-112-112S194.1 96 256 96s112 50.1 112 112-50.1 112-112 112zm0-48c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64z"/></svg>
                                Email (Contact/Donate):
                            </p>
                            <p class="email-address-container">
                                <a href="mailto:${email}" class="email-address">${email}</a>
                            </p>
                            <button class="guide-button" onclick="window.open('https://proton.me/support/wallet-bitcoin-via-email#how-to-send', '_blank')">Proton Wallet Donation Guide</button>
                        </div>
                        <div class="social-links">
                            <a href="${socialLinks.x}" target="_blank" rel="noopener noreferrer" title="X (Twitter)"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"/></svg></a>
                            <a href="${socialLinks.telegram}" target="_blank" rel="noopener noreferrer" title="Telegram"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-telegram" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.287 5.906q-1.168.486-4.666 2.01-.567.225-.595.442c-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.294q.39.01.868-.32 3.269-2.206 3.374-2.23c.05-.012.12-.026.166.016s.042.12.037.141c-.03.129-1.227 1.241-1.846 1.817-.193.18-.33.307-.358.336a8 8 0 0 1-.188.186c-.38.366-.664.64.015 1.088.327.216.589.393.85.571.284.194.568.387.936.629q.14.092.27.187c.331.236.63.448.997.414.214-.02.435-.22.547-.82.265-1.417.786-4.486.906-5.751a1.4 1.4 0 0 0-.013-.315.34.34 0 0 0-.114-.217.53.53 0 0 0-.31-.093c-.3.005-.763.166-2.984 1.09"/></svg></a>
                            <a href="${socialLinks.github}" target="_blank" rel="noopener noreferrer" title="GitHub"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512"><path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3.3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"/></svg></a>
                        </div>
                    </div>
                </section>
                <section id="projects" class="content-view">
                    <div id="projects-container"></div>
                </section>
            </div>
        </main>
    `;

    const getCachedData = (key) => {
        const cached = localStorage.getItem(key);
        if (cached) {
            const { data, timestamp } = JSON.parse(cached);
            if (Date.now() - timestamp < cacheTTL) {
                return data;
            }
        }
        return null;
    };

    const setCachedData = (key, data) => {
        localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
    };

    const loadUserData = async () => {
        const loadingIndicator = document.getElementById('loading-indicator');
        const main = document.querySelector('main');
        loadingIndicator.style.display = 'flex';

        try {
            let data = getCachedData(cacheKey);
            if (!data) {
                const response = await fetch(githubApiUrl, { cache: 'no-cache' });
                if (!response.ok) throw new Error('Failed to fetch user data');
                data = await response.json();
                setCachedData(cacheKey, data);
            }

            const avatar = document.getElementById('avatar');
            const bio = document.getElementById('bio');
            avatar.src = data.avatar_url || 'https://via.placeholder.com/240';

            const img = new Image();
            img.src = data.avatar_url || 'https://via.placeholder.com/240';
            img.onload = () => {
                bio.textContent = data.bio || 'Tech enthusiast';
                loadingIndicator.style.opacity = '0';
                setTimeout(() => {
                    loadingIndicator.style.display = 'none';
                    main.classList.add('loaded');
                }, 300);
            };
            img.onerror = () => {
                bio.textContent = 'Tech enthusiast';
                avatar.src = 'https://via.placeholder.com/240';
                loadingIndicator.style.opacity = '0';
                setTimeout(() => {
                    loadingIndicator.style.display = 'none';
                    main.classList.add('loaded');
                }, 300);
            };
        } catch (error) {
            console.error('Error loading user data:', error);
            document.getElementById('bio').textContent = 'Tech enthusiast';
            document.getElementById('avatar').src = 'https://via.placeholder.com/240';
            loadingIndicator.style.opacity = '0';
            setTimeout(() => {
                loadingIndicator.style.display = 'none';
                main.classList.add('loaded');
            }, 300);
        }
    };

    const loadProjects = async () => {
        const container = document.getElementById('projects-container');
        const projectsCacheKey = `projects_${username}`;
        try {
            let projects = getCachedData(projectsCacheKey);
            if (!projects) {
                const response = await fetch(githubReposApiUrl, { cache: 'no-cache' });
                if (!response.ok) throw new Error('Failed to fetch projects');
                const repos = await response.json();
                projects = repos
                    .filter(repo => repo.homepage === userInfo.homepage)
                    .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at));
                setCachedData(projectsCacheKey, projects);
            }

            container.innerHTML = projects.length > 0 ? 
                projects.map(project => `
                    <div class="project-card">
                        <h3>${project.name}</h3>
                        <p>${project.description || 'No description'}</p>
                        <div class="project-details">
                            <span>⭐ ${project.stargazers_count}</span>
                            <span>
                                ${project.language ? `<i class="${languageIcons[project.language] || 'devicon-code-plain'} language-icon"></i> ${project.language}` : 'N/A'}
                            </span>
                        </div>
                        <a href="${project.html_url}" target="_blank" rel="noopener noreferrer" class="view-project-button">View Project</a>
                    </div>
                `).join('') + `
                <div class="view-more-projects-container">
                    <a href="${socialLinks.github}" target="_blank" rel="noopener noreferrer" class="github-projects-button">More Projects</a>
                </div>
                ` : 
                '<p>No projects found</p>';
        } catch (error) {
            container.innerHTML = '<p>Error loading projects. Please try again later.</p>';
            console.error('Error loading projects:', error);
        }
    };

    const setupViewSwitcher = () => {
        document.querySelectorAll('.view-button').forEach(button => {
            button.addEventListener('click', () => {
                document.querySelectorAll('.view-button').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                document.querySelectorAll('.content-view').forEach(view => {
                    view.classList.toggle('active', view.id === button.dataset.view);
                });
            });
        });
    };

    const render = async () => {
        app.innerHTML = template;
        await Promise.all([loadUserData(), loadProjects()]);
        setupViewSwitcher();
    };

    const deviconLink = document.createElement('link');
    deviconLink.rel = 'stylesheet';
    deviconLink.href = 'https://cdn.jsdelivr.net/npm/devicon@2.15.1/devicon.min.css';
    document.head.appendChild(deviconLink);

    render();
    window.addEventListener('hashchange', render);
});