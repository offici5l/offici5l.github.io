document.addEventListener('DOMContentLoaded', () => {
    document.title = userInfo.username;
    document.querySelector('meta[name="description"]').content = userInfo.username;
    document.querySelector('meta[name="author"]').content = userInfo.username;

    const app = document.getElementById('app-container');
    const { username, email, socialLinks } = userInfo;
    const githubApiUrl = `https://api.github.com/users/${username}`;
    const githubReposApiUrl = `https://api.github.com/users/${username}/repos`;

    let allArticles = [];

    const renderTemplate = (content) => {
        app.innerHTML = content;
        const firstChild = app.querySelector(':first-child');
        if (firstChild) {
            firstChild.classList.add('fade-in');
        }
    };

    const templates = {
        home: `
            <header>
                <div class="luxury-header">
                    <a href="#/" style="text-decoration: none; color: inherit;">
                        
                    </a>
                </div>
            </header>
            <main>
                <section id="about">
                    <div class="avatar-container">
                        <img id="avatar" src="" alt="${username} Avatar" loading="lazy">
                    </div>
                    <p id="bio"></p>
                </section>

                <nav id="view-switcher">
                    <button class="view-button active" data-view="contact-support">Contact/Support</button>
                    <button class="view-button" data-view="projects">Projects</button>
                    <button class="view-button" data-view="articles">Writings</button>
                </nav>

                <div id="content-container">
                    <section id="contact-support" class="content-view active">
                        <div id="support-container">
                            <div class="bitcoin-info">
                                <h3>Support My Work (BTC Address)</h3>
                                <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${userInfo.bitcoinAddress}" alt="Bitcoin QR Code" class="bitcoin-qr-code">
                                <div class="bitcoin-address-container">
                                    <span id="bitcoin-address">${userInfo.bitcoinAddress}</span>
                                    <button id="copy-bitcoin-address" class="copy-button">Copy Address</button>
                                </div>
                            </div>
                            <div id="contact-container">
                                <h3>Contact</h3>
                                <a href="mailto:${email}" class="email-link">${email}</a>
                                <div class="social-links">
                                    <a href="${socialLinks.x}" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>
                                    <a href="${socialLinks.telegram}" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg></a>
                                    <a href="${socialLinks.github}" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg></a>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section id="projects" class="content-view">
                        <div id="projects-container"></div>
                    </section>
                    <section id="articles" class="content-view">
                        <div id="articles-list-container"></div>
                    </section>
                </div>
            </main>
        `,
        article: `
            <main>
                <section id="article-view"></section>
            </main>
        `
    };

    const renderHomePage = () => {
        renderTemplate(templates.home);
        loadUserData();
        loadProjects();
        loadArticles();
        setupViewSwitcher();

        // Add event listener for Bitcoin address copy button
        const copyButton = document.getElementById('copy-bitcoin-address');
        if (copyButton) {
            copyButton.addEventListener('click', () => {
                const bitcoinAddress = document.getElementById('bitcoin-address').textContent;
                navigator.clipboard.writeText(bitcoinAddress).then(() => {
                    alert('Bitcoin address copied to clipboard!');
                }).catch(err => {
                    console.error('Failed to copy: ', err);
                });
            });
        }
    };

    const renderArticlePage = async (articleId) => {
        renderTemplate(templates.article);
        const articleView = document.getElementById('article-view');
        try {
            const response = await fetch(`/articles/${articleId}.md`);
            if (!response.ok) throw new Error('Article not found');
            const markdown = await response.text();

            // Fetch articles.json to find metadata
            const articlesResponse = await fetch('/articles/articles.json');
            const articlesData = await articlesResponse.json();
            const articleData = articlesData.find(a => a.file === `${articleId}.md`);

            const html = marked.parse(markdown);

            articleView.innerHTML = `
                <div class="article-content">${html}</div>
                <a href="#/" class="back-link">&larr; Back to Homepage</a>
            `;
        } catch (error) {
            articleView.innerHTML = `<p>Error: ${error.message}.</p><a href="#/" class="back-link">&larr; Go back</a>`;
        }
    };



    const loadUserData = async () => {
        try {
            const response = await fetch(githubApiUrl);
            const data = await response.json();
            document.getElementById('avatar').src = data.avatar_url;
            const bioElement = document.getElementById('bio');
            bioElement.textContent = data.bio || 'A passionate developer creating elegant and functional applications.';
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    };

    const loadProjects = async () => {
        const container = document.getElementById('projects-container');
        try {
            const response = await fetch(githubReposApiUrl);
            const repos = await response.json();
            const filteredProjects = repos
                .filter(repo => repo.homepage === userInfo.homepage)
                .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at));

            if (filteredProjects.length > 0) {
                container.innerHTML = filteredProjects.map(project => `
                    <a href="${project.html_url}" target="_blank" rel="noopener noreferrer" class="project-card">
                        <h3>${project.name}</h3>
                        <p>${project.description || 'No description available.'}</p>
                    </a>
                `).join('');
                container.innerHTML += `
                    <div class="view-more-projects-container">
                        <a href="${userInfo.socialLinks.github}" target="_blank" rel="noopener noreferrer" class="view-more-button">View More Projects on GitHub</a>
                    </div>
                `;
            } else {
                container.innerHTML = '<p>No published projects found.</p>';
            }
        } catch (error) {
            container.innerHTML = '<p>Could not load projects.</p>';
            console.error('Error loading projects:', error);
        }
    };

    const loadArticles = async () => {
        const container = document.getElementById('articles-list-container');
        try {
            const response = await fetch('/articles/articles.json');
            allArticles = await response.json();
            container.innerHTML = allArticles.map(article => `
                <a href="#/articles/${article.file.replace('.md', '')}" class="article-item" style="text-decoration: none; color: inherit;">
                    <h3>${article.title}</h3>
                    <p>${article.summary}</p>
                    <div class="card-meta">
                        <span>${new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                </a>
            `).join('');
        } catch (error) {
            container.innerHTML = '<p>Could not load articles.</p>';
            console.error('Error loading articles:', error);
        }
    };

    const setupViewSwitcher = () => {
        const viewButtons = document.querySelectorAll('.view-button');
        const contentViews = document.querySelectorAll('.content-view');

        viewButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetView = button.dataset.view;

                // Update button active state
                viewButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                // Update content view active state
                contentViews.forEach(view => {
                    if (view.id === targetView || (targetView === 'contact-support' && (view.id === 'contact' || view.id === 'support'))) {
                        view.classList.add('active');
                    } else {
                        view.classList.remove('active');
                    }
                });
            });
        });
    };

    const router = () => {
        const path = window.location.hash.slice(1) || '/';
        const parts = path.split('/');

        if (parts[1] === 'articles' && parts[2]) {
            renderArticlePage(parts[2]);
        } else {
            renderHomePage();
        }
    };

    window.addEventListener('hashchange', router);
    window.addEventListener('load', router);
});