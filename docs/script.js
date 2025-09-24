function generateQRCode(text, size = 120) {
    const apiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}&bgcolor=ffffff&color=000000&margin=1&format=png`;
    return apiUrl;
}

function copyAddress(address, btn) {
    navigator.clipboard.writeText(address).then(() => {
        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        btn.style.background = '#27ae60';
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
        }, 2000);
    });
}

function openGitHub() {
    window.open(`https://github.com/${userInfo.username_github}`, '_blank');
}

function openProjects() {
    window.open(userInfo.projects_url, '_blank');
}

function initializePortfolio() {
    userInfo.base_url = window.location.origin;
    document.getElementById('avatar').src = userInfo.avatar_url;
    document.getElementById('name').textContent = userInfo.username_github;
    document.getElementById('aboutText').innerHTML = userInfo.about_me.replace(/\n/g, '<br>');
    
    const emailLink = document.getElementById('emailLink');
    const emailText = document.getElementById('emailText');
    emailLink.href = `mailto:${userInfo.email}`;
    emailText.textContent = userInfo.email;
    
    const supportList = document.getElementById('supportList');
    if (userInfo.support_buttons && Object.keys(userInfo.support_buttons).length > 0) {
        Object.entries(userInfo.support_buttons).forEach(([key, button]) => {
            const supportItem = document.createElement('div');
            supportItem.className = 'support-item';
            
            if (button.address) {
                supportItem.innerHTML = `
                    <button class="stats-icon-btn" id="statsBtn-${key}">?</button>
                    <div class="support-content">
                        <div class="support-title">${button.name}</div>
                        <div class="support-address">${button.address}</div>
                        <div class="support-actions">
                            <button class="support-btn copy-btn" onclick="copyAddress('${button.address}', this)">Copy Address</button>
                        </div>
                    </div>
                    <div class="support-qr">
                        <img src="${generateQRCode(button.address)}" alt="QR Code" class="qr-code-image">
                    </div>
                `;
            } else {
                supportItem.onclick = () => window.open(button.redirect, '_blank');
                supportItem.innerHTML = `
                    <div class="support-icon">
                        <img src="${button.svg}" alt="${button.name}">
                    </div>
                    <div class="support-content">${button.name}</div>
                `;
            }
            
            supportList.appendChild(supportItem);
        });
    } else {
        document.getElementById('supportSection').style.display = 'none';
    }
    
    const socialLinks = document.getElementById('socialLinks');
    const socialPlatforms = [
        { 
            name: 'X', 
            url: `https://x.com/${userInfo.username_x}`, 
            icon: 'M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z' 
        },
        { 
            name: 'Telegram', 
            url: `https://t.me/${userInfo.username_telegram}`, 
            icon: 'M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.287 5.906q-1.168.486-4.666 2.01-.567.225-.595.442c-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.294q.39.01.868-.32 3.269-2.206 3.374-2.23c.05-.012.12-.026.166.016s.042.12.037.141c-.03.129-1.227 1.241-1.846 1.817-.193.18-.33.307-.358.336a8 8 0 0 1-.188.186c-.38.366-.664.64.015 1.088.327.216.589.393.85.571.284.194.568.387.936.629q.14.092.27.187c.331.236.63.448.997.414.214-.02.435-.22.547-.82.265-1.417.786-4.486.906-5.751a1.4 1.4 0 0 0-.013-.315.34.34 0 0 0-.114-.217.53.53 0 0 0-.31-.093c-.3.005-.763.166-2.984 1.09' 
        },
        { 
            name: 'GitHub', 
            url: `https://github.com/${userInfo.username_github}`, 
            icon: 'M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3.3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z' 
        }
    ];
    
    socialPlatforms.forEach(platform => {
        const link = document.createElement('a');
        link.className = 'social-link';
        link.href = platform.url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.title = platform.name;
        link.innerHTML = `<svg viewBox="0 0 ${platform.name === 'Telegram' ? '16 16' : '512 512'}"><path d="${platform.icon}"/></svg>`;
        socialLinks.appendChild(link);
    });
}

function hideLoadingScreen() {
    setTimeout(() => {
        document.getElementById('loadingScreen').classList.add('hidden');
    }, 500);
}

function initializeSEO() {
    const head = document.head;

    // Update Title
    document.title = `${userInfo.username_github} | Portfolio`;

    // Update Meta Description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.name = 'description';
        head.appendChild(metaDescription);
    }
    metaDescription.content = "official website of offici5l"; // User's preferred description

    // Update Meta Author
    let metaAuthor = document.querySelector('meta[name="author"]');
    if (!metaAuthor) {
        metaAuthor = document.createElement('meta');
        metaAuthor.name = 'author';
        head.appendChild(metaAuthor);
    }
    metaAuthor.content = userInfo.username_github;

    // Add Keywords (if not already present)
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.name = 'keywords';
        head.appendChild(metaKeywords);
    }
    metaKeywords.content = "portfolio, developer, technology, creativity, offici5l, web developer, software engineer";


    // Open Graph / Facebook
    const ogTags = [
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: userInfo.base_url },
        { property: 'og:title', content: `${userInfo.username_github} | Portfolio` },
        { property: 'og:description', content: "official website of offici5l" },
        { property: 'og:image', content: userInfo.avatar_url }
    ];
    ogTags.forEach(tagData => {
        let tag = document.querySelector(`meta[property="${tagData.property}"]`);
        if (!tag) {
            tag = document.createElement('meta');
            tag.property = tagData.property;
            head.appendChild(tag);
        }
        tag.content = tagData.content;
    });

    // Twitter
    const twitterTags = [
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:url', content: userInfo.base_url },
        { name: 'twitter:title', content: `${userInfo.username_github} | Portfolio` },
        { name: 'twitter:description', content: "official website of offici5l" },
        { name: 'twitter:image', content: userInfo.avatar_url }
    ];
    twitterTags.forEach(tagData => {
        let tag = document.querySelector(`meta[name="${tagData.name}"]`);
        if (!tag) {
            tag = document.createElement('meta');
            tag.name = tagData.name;
            head.appendChild(tag);
        }
        tag.content = tagData.content;
    });

    // Structured Data (JSON-LD)
    let jsonLdScript = document.querySelector('script[type="application/ld+json"]');
    if (!jsonLdScript) {
        jsonLdScript = document.createElement('script');
        jsonLdScript.type = 'application/ld+json';
        head.appendChild(jsonLdScript);
    }
    jsonLdScript.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Person",
        "name": userInfo.username_github,
        "url": userInfo.base_url,
        "image": userInfo.avatar_url,
        "sameAs": [
            `https://github.com/${userInfo.username_github}`,
            `https://x.com/${userInfo.username_x}`,
            `https://t.me/${userInfo.username_telegram}`
        ],
        "jobTitle": "Software Developer", // Assuming a default job title
        "worksFor": {
            "@type": "Organization",
            "name": userInfo.username_github
        },
        "email": `mailto:${userInfo.email}`,
        "description": "official website of offici5l" // User's preferred description
    }, null, 2);
}

document.addEventListener('DOMContentLoaded', () => {
    initializePortfolio();
    initializeSEO();
    
    const avatar = document.getElementById('avatar');
    avatar.onload = hideLoadingScreen;
    avatar.onerror = hideLoadingScreen;
    
    if (avatar.complete) {
        hideLoadingScreen();
    }

    // Modal functionality using Event Delegation
    const statsModal = document.getElementById('statsModal');
    const closeBtn = document.getElementById('closeBtn');
    const supportList = document.getElementById('supportList');

    if(supportList) {
        supportList.addEventListener('click', function(event) {
            if (event.target && event.target.matches('.stats-icon-btn')) {
                statsModal.style.display = 'block';
                showStats();
            }
        });
    }

    closeBtn.onclick = function() {
        statsModal.style.display = 'none';
    }

    window.onclick = function(event) {
        if (event.target == statsModal) {
            statsModal.style.display = 'none';
        }
    }
});



// --- TODO: Replace this with your actual API call ---
function fetchWalletStats() {
    const address = userInfo.support_buttons.bitcoin.address;
    const url = `https://blockstream.info/api/address/${address}`;

    return fetch(url)
        .then(response => response.json());
}

function showStats() {
    const statsContent = document.getElementById('statsContent');
    statsContent.innerHTML = '<p>Loading...</p>';
    fetchWalletStats().then(data => {
        const chain_stats = data.chain_stats;
        const mempool_stats = data.mempool_stats;

        statsContent.innerHTML = `
            <h4>Chain Stats</h4>
            <p><strong>Funded TXO Count:</strong> ${chain_stats.funded_txo_count}</p>
            <p><strong>Funded TXO Sum:</strong> ${(chain_stats.funded_txo_sum / 100000000).toFixed(8)} BTC</p>
            <p><strong>Spent TXO Count:</strong> ${chain_stats.spent_txo_count}</p>
            <p><strong>Spent TXO Sum:</strong> ${(chain_stats.spent_txo_sum / 100000000).toFixed(8)} BTC</p>
            <p><strong>Transaction Count:</strong> ${chain_stats.tx_count}</p>
            <hr>
            <h4>Mempool Stats</h4>
            <p><strong>Funded TXO Count:</strong> ${mempool_stats.funded_txo_count}</p>
            <p><strong>Funded TXO Sum:</strong> ${(mempool_stats.funded_txo_sum / 100000000).toFixed(8)} BTC</p>
            <p><strong>Spent TXO Count:</strong> ${mempool_stats.spent_txo_count}</p>
            <p><strong>Spent TXO Sum:</strong> ${(mempool_stats.spent_txo_sum / 100000000).toFixed(8)} BTC</p>
            <p><strong>Transaction Count:</strong> ${mempool_stats.tx_count}</p>
        `;
    });
}