function openProjects() {
    window.location.href = 'projects.html';
}

function openDonate() {
    window.location.href = 'support.html';
}

function initializePortfolio() {
    const avatar = document.getElementById('avatar');
    const name = document.getElementById('name');
    const aboutText = document.getElementById('aboutText');
    
    if (avatar) avatar.src = userInfo.avatar_url;
    if (name) name.textContent = userInfo.username_github;
    if (aboutText) aboutText.innerHTML = userInfo.about_me.replace(/\n/g, '<br>');
    
    const emailLink = document.getElementById('emailLink');
    const emailText = document.getElementById('emailText');
    if (emailLink && emailText) {
        emailLink.href = `mailto:${userInfo.email}`;
        emailText.textContent = userInfo.email;
    }
    
    const socialLinks = document.getElementById('socialLinks');
    if (socialLinks) {
        socialLinks.innerHTML = '';
        const socialPlatforms = [
            { 
                name: 'GitHub', 
                url: `https://github.com/${userInfo.username_github}`, 
                icon_url: 'https://cdn.simpleicons.org/github/495057'
            },
            { 
                name: 'X (Twitter)', 
                url: `https://x.com/${userInfo.username_x}`, 
                icon_url: 'https://cdn.simpleicons.org/x/495057'
            },
            { 
                name: 'Telegram', 
                url: `https://t.me/${userInfo.username_telegram}`,
                icon_url: 'https://cdn.simpleicons.org/telegram/495057'
            }
        ];
        
        socialPlatforms.forEach(platform => {
            const link = document.createElement('a');
            link.className = 'social-link';
            link.href = platform.url;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.title = platform.name;
            link.setAttribute('aria-label', `Visit ${platform.name} profile`);
            link.innerHTML = `<img src="${platform.icon_url}" alt="${platform.name} icon" class="social-icon-img">`;
            socialLinks.appendChild(link);
        });
    }
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
        }, 500);
    }
}

function initializeSEO() {
    if (!userInfo.seo) return;

    const head = document.head;
    const baseUrl = window.location.origin + window.location.pathname.split('/').slice(0, -1).join('/') + '/';

    document.title = userInfo.seo.title;

    let favicon = document.querySelector('link[rel="icon"]');
    if (!favicon) {
        favicon = document.createElement('link');
        favicon.rel = 'icon';
        head.appendChild(favicon);
    }
    favicon.href = userInfo.avatar_url;

    const metaTags = {
        'description': userInfo.seo.description,
        'keywords': userInfo.seo.keywords,
        'author': userInfo.username_github
    };

    for (const name in metaTags) {
        let tag = document.querySelector(`meta[name="${name}"]`);
        if (!tag) {
            tag = document.createElement('meta');
            tag.name = name;
            head.appendChild(tag);
        }
        tag.content = metaTags[name];
    }

    const ogTags = {
        'og:title': userInfo.seo.title,
        'og:description': userInfo.seo.description,
        'og:type': 'website',
        'og:url': baseUrl,
        'og:image': userInfo.avatar_url
    };

    for (const property in ogTags) {
        let tag = document.querySelector(`meta[property="${property}"]`);
        if (!tag) {
            tag = document.createElement('meta');
            tag.setAttribute('property', property);
            head.appendChild(tag);
        }
        tag.content = ogTags[property];
    }

    const twitterTags = {
        'twitter:card': 'summary_large_image',
        'twitter:title': userInfo.seo.title,
        'twitter:description': userInfo.seo.description,
        'twitter:image': userInfo.avatar_url,
        'twitter:creator': `@${userInfo.username_x}`
    };

    for (const name in twitterTags) {
        let tag = document.querySelector(`meta[name="${name}"]`);
        if (!tag) {
            tag = document.createElement('meta');
            tag.name = name;
            head.appendChild(tag);
        }
        tag.content = twitterTags[name];
    }
}

document.addEventListener('DOMContentLoaded', function() {
    if (typeof userInfo === 'undefined') {
        console.error('userInfo not loaded. Make sure info.js is included before script.js');
        return;
    }
    
    try {
        initializePortfolio();
        initializeSEO();
    } catch (error) {
        console.error('Error initializing portfolio:', error);
    }
    
    const avatar = document.getElementById('avatar');
    if (avatar) {
        avatar.onload = hideLoadingScreen;
        avatar.onerror = function() {
            console.warn('Avatar failed to load');
            hideLoadingScreen();
        };
        
        if (avatar.complete) {
            hideLoadingScreen();
        }
    } else {
        hideLoadingScreen();
    }
});
