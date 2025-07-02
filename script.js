// Configuration
const CONFIG = {
    GITHUB_USERNAME: 'offici5l',
    GITHUB_API_BASE: 'https://api.github.com',
    HOMEPAGE_FILTER: 'https://offici5l.github.io/',
    ARTICLES_BASE_URL: 'https://offici5l.github.io/articles/'
};

// Global state
let userData = null;
let reposData = null;
let articlesData = null;

// DOM Elements
const loadingOverlay = document.getElementById('loading-overlay');

// Get current page
function getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('projects')) return 'projects';
    if (path.includes('articles')) return 'articles';
    return 'home';
}

// Initialize the application
document.addEventListener('DOMContentLoaded', async () => {
    try {
        initializeNavigation();
        
        const currentPage = getCurrentPage();
        
        if (currentPage === 'home') {
            await loadGitHubUserData();
        } else if (currentPage === 'projects') {
            await loadGitHubProjects();
        } else if (currentPage === 'articles') {
            await loadArticles();
        }
        
        initializeAnimations();
        hideLoadingOverlay();
    } catch (error) {
        console.error('Error initializing application:', error);
        hideLoadingOverlay();
        showErrorMessage('Failed to load data. Please try again later.');
    }
});

// Load GitHub user data (for home page)
async function loadGitHubUserData() {
    try {
        const userResponse = await fetch(`${CONFIG.GITHUB_API_BASE}/users/${CONFIG.GITHUB_USERNAME}`);
        if (!userResponse.ok) throw new Error('Failed to fetch user data');
        userData = await userResponse.json();

        updateUserProfile();
    } catch (error) {
        console.error('Error loading GitHub user data:', error);
        showFallbackProfile();
        throw error;
    }
}

// Load GitHub projects (for projects page)
async function loadGitHubProjects() {
    try {
        const reposResponse = await fetch(`${CONFIG.GITHUB_API_BASE}/users/${CONFIG.GITHUB_USERNAME}/repos?per_page=100&sort=updated`);
        if (!reposResponse.ok) throw new Error('Failed to fetch repositories');
        reposData = await reposResponse.json();

        updateProjects();
    } catch (error) {
        console.error('Error loading GitHub projects:', error);
        throw error;
    }
}

// Update user profile information (home page)
function updateUserProfile() {
    if (!userData) return;

    // Update profile image
    const profileImage = document.getElementById('profile-image');
    if (profileImage && userData.avatar_url) {
        profileImage.src = userData.avatar_url;
        profileImage.alt = userData.name || userData.login;
    }

    // Update profile name
    const profileName = document.getElementById('profile-name');
    if (profileName) {
        profileName.textContent = userData.name || userData.login;
    }

    // Update profile bio
    const profileBio = document.getElementById('profile-bio');
    if (profileBio) {
        if (userData.bio) {
            profileBio.innerHTML = `<p>${userData.bio}</p>`;
        } else {
            profileBio.innerHTML = `<p>Passionate developer focused on creating innovative solutions and sharing knowledge through code.</p>`;
        }
    }
}

// Show fallback profile data
function showFallbackProfile() {
    const profileImage = document.getElementById('profile-image');
    const profileName = document.getElementById('profile-name');
    const profileBio = document.getElementById('profile-bio');

    if (profileImage) {
        profileImage.src = 'https://github.com/offici5l.png';
        profileImage.alt = 'Offici5l';
    }

    if (profileName) {
        profileName.textContent = 'Offici5l';
    }

    if (profileBio) {
        profileBio.innerHTML = `<p>Passionate developer focused on creating innovative solutions and sharing knowledge through code.</p>`;
    }
}

// Update projects section (projects page)
function updateProjects() {
    if (!reposData) return;

    // Filter repositories with homepage starting with the specified URL
    const filteredRepos = reposData.filter(repo => 
        repo.homepage && repo.homepage.startsWith(CONFIG.HOMEPAGE_FILTER)
    );

    const projectsGrid = document.getElementById('projects-grid');
    if (!projectsGrid) return;

    // Clear loading state
    projectsGrid.innerHTML = '';

    if (filteredRepos.length === 0) {
        projectsGrid.innerHTML = `
            <div class="no-projects">
                <p>No projects with live demos found.</p>
            </div>
        `;
        return;
    }

    // Create project cards
    filteredRepos.forEach((repo, index) => {
        const projectCard = createProjectCard(repo, index);
        projectsGrid.appendChild(projectCard);
    });
}

// Create a project card element
function createProjectCard(repo, index) {
    const card = document.createElement('div');
    card.className = 'project-card fade-in';
    card.style.animationDelay = `${index * 0.1}s`;

    card.innerHTML = `
        <h3 class="project-title">${repo.name}</h3>
        <p class="project-description">${repo.description || 'No description available'}</p>
        <a href="${repo.html_url}" class="project-link" target="_blank">
            <i class="fas fa-external-link-alt"></i>
            <span>View Project</span>
        </a>
    `;

    return card;
}

// Load articles (for articles page)
async function loadArticles() {
    try {
        const response = await fetch('articles.md');
        if (!response.ok) {
            throw new Error('Failed to load articles metadata');
        }
        
        const content = await response.text();
        const articles = parseArticlesMetadata(content);
        
        articlesData = articles;
        updateArticles();
    } catch (error) {
        console.error('Error loading articles:', error);
        // Fallback to hardcoded articles
        const articles = [
            {
                title: "Mi Account CN - Xiaomi Account Management",
                description: "Comprehensive guide for managing Xiaomi accounts in China region, including account creation, verification, and troubleshooting common issues.",
                filename: "mi-account-cn"
            },
            {
                title: "Mi CN Unlock - Bootloader Unlocking Guide",
                description: "Step-by-step instructions for unlocking Xiaomi device bootloaders in China region, including prerequisites and safety considerations.",
                filename: "mi-cn-unlock"
            },
            {
                title: "Mi Error Codes - Troubleshooting Reference",
                description: "Complete reference guide for Xiaomi device error codes, their meanings, and solutions to resolve common issues.",
                filename: "mi-error-codes"
            },
            {
                title: "Mi Unlock with Termux - Advanced Method",
                description: "Advanced guide for unlocking Xiaomi devices using Termux on Android, including command-line tools and automation scripts.",
                filename: "mi-unlock-with-termux"
            }
        ];
        
        articlesData = articles;
        updateArticles();
    }
}

// Parse articles metadata from markdown file
function parseArticlesMetadata(content) {
    const articles = [];
    const lines = content.split('\n');
    let currentArticle = {};
    
    for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('title:')) {
            if (Object.keys(currentArticle).length > 0) {
                articles.push(currentArticle);
            }
            currentArticle = { title: trimmed.replace('title:', '').trim() };
        } else if (trimmed.startsWith('description:')) {
            currentArticle.description = trimmed.replace('description:', '').trim();
        } else if (trimmed.startsWith('category:')) {
            currentArticle.category = trimmed.replace('category:', '').trim();
        } else if (trimmed.startsWith('filename:')) {
            currentArticle.filename = trimmed.replace('filename:', '').trim();
        }
    }
    
    if (Object.keys(currentArticle).length > 0) {
        articles.push(currentArticle);
    }
    
    return articles;
}

// Update articles section (articles page)
function updateArticles() {
    if (!articlesData) return;

    const articlesGrid = document.getElementById('articles-grid');
    if (!articlesGrid) return;

    // Clear loading state
    articlesGrid.innerHTML = '';

    if (articlesData.length === 0) {
        articlesGrid.innerHTML = `
            <div class="no-articles">
                <p>No articles found.</p>
            </div>
        `;
        return;
    }

    // Create article cards
    articlesData.forEach((article, index) => {
        const articleCard = createArticleCard(article, index);
        articlesGrid.appendChild(articleCard);
    });
}

// Create an article card element
function createArticleCard(article, index) {
    const card = document.createElement('div');
    card.className = 'article-card fade-in';
    card.style.animationDelay = `${index * 0.1}s`;

    // Create corrected article URL
    const articleUrl = `${CONFIG.ARTICLES_BASE_URL}${article.filename}`;

    card.innerHTML = `
        <h3 class="article-title">${article.title}</h3>
        <p class="article-description">${article.description}</p>
        <a href="${articleUrl}" class="article-link" target="_blank">
            <i class="fas fa-book-open"></i>
            <span>Read Full Article</span>
        </a>
    `;

    return card;
}

// Initialize navigation functionality
function initializeNavigation() {
    // Set active navigation link based on current page
    setActiveNavLink();
}

// Set active navigation link
function setActiveNavLink() {
    const currentPage = getCurrentPage();
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        
        const href = link.getAttribute('href');
        if (
            (currentPage === 'home' && href === 'index.html') ||
            (currentPage === 'projects' && href === 'projects.html') ||
            (currentPage === 'articles' && href === 'articles.html')
        ) {
            link.classList.add('active');
        }
    });
}

// Initialize animations and scroll effects
function initializeAnimations() {
    // Navbar background on scroll
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 100) {
                navbar.style.background = 'rgba(26, 26, 26, 0.98)';
            } else {
                navbar.style.background = 'rgba(26, 26, 26, 0.95)';
            }
        }
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    setTimeout(() => {
        const animateElements = document.querySelectorAll('.fade-in');
        animateElements.forEach(el => {
            observer.observe(el);
        });
    }, 500);
}

// Hide loading overlay
function hideLoadingOverlay() {
    if (loadingOverlay) {
        loadingOverlay.classList.add('hidden');
        setTimeout(() => {
            loadingOverlay.style.display = 'none';
        }, 500);
    }
}

// Show error message
function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ff4444;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
    `;
    errorDiv.textContent = message;
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

