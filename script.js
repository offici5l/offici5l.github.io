document.addEventListener('DOMContentLoaded', () => {
    const { username, email, socialLinks, bitcoinAddress } = userInfo;
    document.title = username;
    document.querySelector('meta[name="description"]').content = username;
    document.querySelector('meta[name="author"]').content = username;

    const app = document.getElementById('app-container');
    const githubApiUrl = `https://api.github.com/users/${username}`;
    const githubReposApiUrl = `https://api.github.com/users/${username}/repos`;

    const template = `
        <main>
            <section id="about">
                <div class="avatar-container">
                    <img id="avatar" src="" alt="${username} Avatar" loading="lazy">
                </div>
                <p id="bio"></p>
            </section>
            <nav id="view-switcher">
                <button class="view-button" data-view="projects">Projects</button>
                <button class="view-button" data-view="donate">Donate</button>
                <button class="view-button" data-view="contact">Contact</button>
            </nav>
            <div id="content-container">
                <section id="donate" class="content-view">
                    <div class="donate-contact-card">
                        <div class="bitcoin-donate">
                            <h4>Bitcoin Donation</h4>
                            <span class="address-label">Address:</span>
                            <div class="bitcoin-address-container" id="bitcoin-address-container">
                                <span id="bitcoin-address">${bitcoinAddress}</span>
                            </div>
                            <span class="qr-code-label">QR Code:</span>
                            <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${bitcoinAddress}" alt="Bitcoin QR Code" class="bitcoin-qr-code">
                        </div>
                    </div>
                </section>
                <section id="contact" class="content-view">
                    <div class="donate-contact-card">
                        <a href="mailto:${email}" class="email-link">${email}</a>
                        <div class="social-links">
                            <a href="${socialLinks.x}" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24"><path d="M18.2 2.3h3.3L14.3 10.5l8.5 11.2H16.2l-5.2-6.8-5.9 6.8H1.7l7.7-8.8L1.3 2.3H8l4.7 6.2zm-1.2 17.5h1.8L7 4.1H5.1z"/></svg></a>
                            <a href="${socialLinks.telegram}" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24"><path d="M12 0a12 12 0 0 0-12 12 12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm4.9 7.2c.1 0 .3.1.5.2.2.1.2.3.2.5-.2 1.9-1 6.5-1.4 8.6-.2.9-.5 1.2-.8 1.2-.7.1-1.2-.5-1.9-.9-1.1-.7-1.7-1.1-2.7-1.8-1.2-.8-.4-1.2.3-1.9.2-.2 3.2-3 3.3-3.2 0 0 0-.2-.2-.2s-.2 0-.3 0c-.1 0-1.8 1.1-5.1 3.3-.5.3-.9.5-1.3.5-.4 0-1.3-.2-1.9-.4-.8-.2-1.3-.4-1.3-.8 0-.2.3-.4.9-.7 3.5-1.5 5.8-2.5 7-3 3.3-1.4 4-1.6 4.5-1.6z"/></svg></a>
                            <a href="${socialLinks.github}" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24"><path d="M12 0a12 12 0 0 0-12 12c0 5.3 3.4 9.8 8.2 11.4.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.5-1.4-1.3-1.8-1.3-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2.9-.3 2-.4 3-.4s2.1.1 3 .4c2.3-1.5 3.3-1.2 3.3-1.2.7 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.8-1.6 8.2-6.1 8.2-11.4A12 12 0 0 0 12 0z"/></svg></a>
                        </div>
                    </div>
                </section>
                <section id="projects" class="content-view">
                    <div id="projects-container"></div>
                </section>
            </div>
        </main>
    `;

    const render = () => {
        app.innerHTML = template;
        app.querySelector(':first-child').classList.add('fade-in');
        loadUserData();
        loadProjects();
        setupViewSwitcher();
        setupBitcoinCopy();
    };

    const loadUserData = async () => {
        try {
            const response = await fetch(githubApiUrl);
            const data = await response.json();
            document.getElementById('avatar').src = data.avatar_url;
            document.getElementById('bio').textContent = data.bio || 'Tech enthusiast.';
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    };

    const loadProjects = async () => {
        const container = document.getElementById('projects-container');
        try {
            const response = await fetch(githubReposApiUrl);
            const repos = await response.json();
            const projects = repos
                .filter(repo => repo.homepage === userInfo.homepage)
                .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at));

            container.innerHTML = projects.length > 0 ? 
                projects.map(project => `
                    <a href="${project.html_url}" target="_blank" rel="noopener noreferrer" class="project-card">
                        <h3>${project.name}</h3>
                        <p>${project.description || 'No description.'}</p>
                    </a>
                `).join('') + `
                <div class="view-more-projects-container">
                    <a href="${socialLinks.github}" target="_blank" rel="noopener noreferrer" class="github-projects-button">More Projects</a>
                </div>
                ` : 
                '<p>No projects found.</p>';
        } catch (error) {
            container.innerHTML = '<p>Error loading projects.</p>';
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

    const setupBitcoinCopy = () => {
        const container = document.getElementById('bitcoin-address-container');
        container.addEventListener('click', () => {
            navigator.clipboard.writeText(bitcoinAddress).then(() => {
                container.classList.add('copied');
                setTimeout(() => container.classList.remove('copied'), 1500);
            }).catch(err => console.error('Failed to copy:', err));
        });
    };

    render();
    window.addEventListener('hashchange', render);
});