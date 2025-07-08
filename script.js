document.addEventListener('DOMContentLoaded', () => {
    const { username, socialLinks, email } = userInfo;
    const githubApiUrl = `https://api.github.com/users/${username}`;
    const githubReposApiUrl = `https://api.github.com/users/${username}/repos`;

    const projectsPerPage = 6;
    let allProjects = [];
    let displayedProjectsCount = 0;
    let githubButton = null;
    let particlesInstance = null;
    let articlesExpanded = false;

    const projectsContainer = document.getElementById('projects-container');
    const loadMoreButton = document.getElementById('load-more-projects');
    const aboutSection = document.getElementById('about');
    const projectsToggle = document.getElementById('projects-toggle');
    const projectsContent = document.getElementById('projects-content');
    const articlesToggle = document.getElementById('articles-toggle');
    const articlesContent = document.getElementById('articles-content');
    const articlesListContainer = document.getElementById('articles-list-container');
    const articleFullViewContainer = document.getElementById('article-full-view-container');

    const avatarImg = aboutSection.querySelector('img');
    let avatarCenter = { x: "50%", y: "25%" };
    if (avatarImg) {
        const updateAvatarPosition = () => {
            const rect = avatarImg.getBoundingClientRect();
            const canvas = document.getElementById('tsparticles');
            const canvasRect = canvas ? canvas.getBoundingClientRect() : { left: 0, top: 0 };
            avatarCenter = {
                x: ((rect.left + rect.width / 2 - canvasRect.left) / window.innerWidth) * 100 + '%',
                y: ((rect.top + rect.height / 2 - canvasRect.top) / window.innerHeight) * 100 + '%'
            };
            if (particlesInstance) {
                particlesInstance.options.particles.move.orbit.center = avatarCenter;
                particlesInstance.options.particles.move.attract.center = avatarCenter;
                particlesInstance.refresh();
            }
        };
        updateAvatarPosition();
        window.addEventListener('resize', updateAvatarPosition);
    }

    const initParticles = () => {
        tsParticles.load("tsparticles", {
            background: {
                color: {
                    value: "transparent"
                }
            },
            fpsLimit: 60,
            interactivity: {
                events: {
                    onClick: {
                        enable: false,
                        mode: "push"
                    },
                    onHover: {
                        enable: false,
                        mode: "connect"
                    },
                    resize: true
                },
                modes: {
                    push: {
                        quantity: 3,
                        particles: {
                            position: avatarCenter
                        }
                    },
                    connect: {
                        distance: 100,
                        radius: 200,
                        links: {
                            opacity: 0.5
                        }
                    }
                }
            },
            particles: {
                color: {
                    value: ["#ffffff", "#38bdf8"]
                },
                links: {
                    color: "#38bdf8",
                    distance: 80,
                    enable: true,
                    opacity: 0.4,
                    width: 0.4,
                    blendMode: "screen"
                },
                move: {
                    direction: "none",
                    enable: true,
                    outModes: {
                        default: "bounce"
                    },
                    random: false,
                    speed: 0.5,
                    straight: false,
                    orbit: {
                        enable: true,
                        radius: { min: 60, max: 80 },
                        speed: 0.4,
                        center: avatarCenter
                    },
                    attract: {
                        enable: true,
                        rotateX: 800,
                        rotateY: 1600,
                        center: avatarCenter
                    }
                },
                number: {
                    density: {
                        enable: true,
                        area: 800
                    },
                    value: 40
                },
                opacity: {
                    value: { min: 0.2, max: 0.5 },
                    animation: {
                        enable: true,
                        speed: 0.8,
                        minimumValue: 0.2
                    }
                },
                shape: {
                    type: ["circle"]
                },
                size: {
                    value: { min: 0.8, max: 1.5 },
                    animation: {
                        enable: true,
                        speed: 1.5,
                        minimumValue: 0.8
                    }
                }
            },
            detectRetina: true
        }).then(particles => {
            particlesInstance = particles;
        });
    };

    if (!window.location.pathname.startsWith('/articles/')) {
        initParticles();
    }

    fetch(githubApiUrl)
        .then(response => response.json())
        .then(data => {
            const bioText = data.bio || 'No bio available.';
            aboutSection.innerHTML = `
                <img src="${data.avatar_url}" alt="${data.name || username}'s avatar">
                <p id="bio">${bioText.split(' ').map(word => `<span>${word}</span>`).join(' ')}</p>
            `;
            const bioElement = document.getElementById('bio');
            const spans = bioElement.querySelectorAll('span');
            spans.forEach((span, index) => {
                setTimeout(() => {
                    span.classList.add('visible');
                }, index * 80);
            });
            const contactContainer = document.getElementById('contact-container');
            contactContainer.innerHTML = `
                <div class="email-container">
                    <a href="mailto:${email}" class="email-link">
                        <svg class="email-icon" width="24" height="24" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="#ffffff"/>
                        </svg>
                        ${email}
                    </a>
                </div>
                <div class="social-links">
                    <a href="${socialLinks.x}" target="_blank" class="x-link">
                        <svg class="x-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H1.474l8.6-9.83L0 1.154h7.594l5.243 6.932L18.901 1.153zM17.61 20.644h2.039L6.486 3.24H4.298L17.61 20.644z" fill="#ffffff"/>
                        </svg>
                    </a>
                    <a href="${socialLinks.telegram}" target="_blank" class="telegram-link">
                        <svg class="telegram-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.265 2.737a1.5 1.5 0 0 0-1.627-.32L2.885 9.589a1.5 1.5 0 0 0 .05 2.818l4.854 1.937 2.473 7.785a1.5 1.5 0 0 0 2.664.606l3.224-3.765 5.104 3.765a1.5 1.5 0 0 0 2.315-.85l3.375-16.2a1.5 1.5 0 0 0-.68-1.948zM9.75 15.354l-.698 2.214-1.824-5.786 11.37-7.938-8.848 11.51z" fill="#ffffff"/>
                        </svg>
                    </a>
                    <a href="${socialLinks.github}" target="_blank" class="github-link">
                        <svg class="github-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.164 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.866-.014-1.7-2.782.602-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.607.069-.607 1.003.07 1.532 1.03 1.532 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.349-1.087.636-1.338-2.22-.252-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.03-2.683-.103-.253-.446-1.27.098-2.646 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.114 2.504.336 1.909-1.296 2.747-1.026 2.747-1.026.546 1.376.203 2.394.1 2.646.64.699 1.026 1.592 1.026 2.683 0 3.841-2.337 4.687-4.565 4.936.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.58.688.482A10.019 10.019 0 0 0 22 12c0-5.523-4.477-10-10-10z" fill="#ffffff"/>
                        </svg>
                    </a>
                </div>
            `;
        })
        .catch(error => {
            console.error('Error fetching GitHub user data:', error);
            aboutSection.innerHTML = `
                <img src="https://via.placeholder.com/150" alt="Placeholder avatar">
                <p id="bio">Error loading bio. Please try again later.</p>
            `;
        });

    const displayProjects = () => {
        const projectsToDisplay = allProjects.slice(displayedProjectsCount, displayedProjectsCount + projectsPerPage);

        if (projectsToDisplay.length === 0 && displayedProjectsCount === 0) {
            projectsContainer.innerHTML = '<p>No projects found.</p>';
            loadMoreButton.style.display = 'none';
            return;
        }

        projectsToDisplay.forEach((repo, index) => {
            const projectCard = document.createElement('div');
            projectCard.classList.add('project-card');
            projectCard.innerHTML = `
                <h3>${repo.name}</h3>
                <p>${repo.description || 'No description available.'}</p>
                <a href="${repo.html_url}" target="_blank">View Repository</a>
            `;
            projectsContainer.appendChild(projectCard);

            setTimeout(() => {
                projectCard.classList.add('show');
            }, index * 80);
        });

        displayedProjectsCount += projectsToDisplay.length;

        if (displayedProjectsCount < allProjects.length) {
            loadMoreButton.style.display = 'block';
            if (githubButton) {
                githubButton.style.display = 'none';
            }
        } else {
            loadMoreButton.style.display = 'none';
            if (!githubButton) {
                githubButton = document.createElement('a');
                githubButton.id = 'github-link-button';
                githubButton.href = `https://github.com/${username}?tab=repositories`;
                githubButton.target = '_blank';
                githubButton.textContent = 'View More on GitHub';
                projectsContainer.parentNode.insertBefore(githubButton, loadMoreButton.nextSibling);
            }
            githubButton.style.display = 'block';
        }
    };

    fetch(githubReposApiUrl)
        .then(response => response.json())
        .then(repos => {
            allProjects = repos.filter(repo => 
                repo.homepage && repo.homepage.startsWith(`https://${username}.github.io/projects`)
            );
        })
        .catch(error => {});

    projectsToggle.addEventListener('click', () => {
        const isExpanded = projectsContent.style.display === 'block';

        if (isExpanded) {
            projectsContent.style.display = 'none';
            projectsToggle.classList.remove('expanded');
            displayedProjectsCount = 0;
            projectsContainer.innerHTML = '';
            if (githubButton) {
                githubButton.style.display = 'none';
            }
        } else {
            projectsContent.style.display = 'block';
            projectsToggle.classList.add('expanded');
            
            displayedProjectsCount = 0;
            projectsContainer.innerHTML = '';

            if (allProjects.length > 0) {
                displayProjects();
            } else {
                projectsContainer.innerHTML = '<p>No projects found.</p>';
                loadMoreButton.style.display = 'none';
                if (githubButton) {
                    githubButton.style.display = 'none';
                }
            }
        }
    });

    loadMoreButton.addEventListener('click', displayProjects);

    const hideAllSections = () => {
        document.getElementById('about').style.display = 'none';
        document.getElementById('projects').style.display = 'none';
        document.getElementById('contact-container').style.display = 'none';
        document.querySelector('header').style.display = 'none';
        articlesContent.style.display = 'none';
        articleFullViewContainer.style.display = 'none';
        articlesListContainer.style.display = 'none';
        document.body.classList.remove('article-full-page');
        document.querySelector('main').classList.remove('article-full-page');
        if (particlesInstance) {
            particlesInstance.pause();
            document.getElementById('tsparticles').style.display = 'none';
        }
    };

    const showMainSections = () => {
        document.getElementById('about').style.display = 'flex';
        document.getElementById('projects').style.display = 'block';
        document.getElementById('contact-container').style.display = 'block';
        document.querySelector('header').style.display = 'block';
        if (articlesExpanded) {
            articlesContent.style.display = 'block';
            articlesToggle.classList.add('expanded');
        } else {
            articlesContent.style.display = 'none';
            articlesToggle.classList.remove('expanded');
        }
        articlesListContainer.style.display = 'grid';
        articleFullViewContainer.style.display = 'none';
        if (particlesInstance) {
            document.getElementById('tsparticles').style.display = 'block';
            particlesInstance.play();
        } else if (!window.location.pathname.startsWith('/articles/')) {
            initParticles();
        }
    };

    const displayArticlesList = (articles) => {
        while (articlesListContainer.firstChild) {
            articlesListContainer.removeChild(articlesListContainer.firstChild);
        }
        
        if (articles.length === 0) {
            articlesListContainer.innerHTML = '<p>No articles found.</p>';
            return;
        }

        articles.forEach((article, index) => {
            const articleElement = document.createElement('div');
            articleElement.classList.add('article-item');
            articleElement.innerHTML = `
                <h3>${article.title}</h3>
                <p>${article.summary}</p>
                <a href="/articles/${article.file.replace('.md', '')}">Read More</a>
            `;
            articlesListContainer.appendChild(articleElement);
        });
        articlesListContainer.style.display = 'grid';
    };

    const displayFullArticle = (articleSlug) => {
        articlesExpanded = true;
        hideAllSections();
        articlesContent.style.display = 'block';
        articleFullViewContainer.style.display = 'block';
        document.body.classList.add('article-full-page');
        document.querySelector('main').classList.add('article-full-page');

        const fileName = `${articleSlug}.md`;
        fetch(window.location.origin + `/articles/${fileName}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(markdown => {
                articleFullViewContainer.innerHTML = `
                    <div class="article-content">
                        <button id="back-to-articles">← Back to Articles</button>
                        ${marked.parse(markdown)}
                    </div>
                `;
                const articleLinks = articleFullViewContainer.querySelectorAll('a[href^="/articles/"]');
                articleLinks.forEach(link => {
                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        const articleSlug = e.target.getAttribute('href').split('/articles/')[1];
                        history.pushState({}, '', `/articles/${articleSlug}`);
                        displayFullArticle(articleSlug);
                    });
                });
            })
            .catch(error => {
                articleFullViewContainer.innerHTML = '<p>Error loading article. Please try again later.</p>';
            });
    };

    articlesToggle.addEventListener('click', () => {
        articlesExpanded = !articlesExpanded;
        if (articlesExpanded) {
            articlesToggle.classList.add('expanded');
            handleRouteChange();
        } else {
            articlesContent.style.display = 'none';
            articlesToggle.classList.remove('expanded');
        }
    });

    articlesListContainer.addEventListener('click', (e) => {
        if (e.target.tagName === 'A' && e.target.href.includes('/articles/')) {
            e.preventDefault();
            const articleSlug = e.target.href.split('/articles/')[1];
            history.pushState({}, '', `/articles/${articleSlug}`);
            displayFullArticle(articleSlug);
        }
    });

    document.body.addEventListener('click', (e) => {
        if (e.target.id === 'back-to-articles') {
            history.pushState({}, '', '/');
            handleRouteChange();
        }
    });

    window.addEventListener('popstate', handleRouteChange);


    function handleRouteChange() {
        let path = window.location.pathname;
        if (window.location.hash) {
            path = window.location.hash.substring(1); // Remove # from the path
        }
        if (path.startsWith('/articles/') || path.startsWith('articles/')) {
            const articleSlug = path.substring('/articles/'.length);
            if (articleSlug) {
                displayFullArticle(articleSlug);
            } else {
                showMainSections();
                fetch(window.location.origin + '/articles/articles.json')
                    .then(response => response.json())
                    .then(displayArticlesList)
                    .catch(error => {
                        articlesListContainer.innerHTML = '<p>Error loading articles list.</p>';
                    });
            }
        } else {
            showMainSections();
            fetch(window.location.origin + '/articles/articles.json')
                .then(response => response.json())
                .then(displayArticlesList)
                .catch(error => {
                    articlesListContainer.innerHTML = '<p>Error loading articles list.</p>';
                });
        }
    }

    handleRouteChange();
});