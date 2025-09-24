function generateQRCode(text, size = 160) {
    const apiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}&bgcolor=ffffff&color=000000&margin=1&format=png&ecc=M`;
    return apiUrl;
}

function copyAddress(address, btn) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(address).then(() => {
            showCopySuccess(btn);
        }).catch(err => {
            fallbackCopyTextToClipboard(address, btn);
        });
    } else {
        fallbackCopyTextToClipboard(address, btn);
    }
}

function fallbackCopyTextToClipboard(text, btn) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.width = "2em";
    textArea.style.height = "2em";
    textArea.style.padding = "0";
    textArea.style.border = "none";
    textArea.style.outline = "none";
    textArea.style.boxShadow = "none";
    textArea.style.background = "transparent";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showCopySuccess(btn);
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
        showCopyError(btn);
    }
    
    document.body.removeChild(textArea);
}

function showCopySuccess(btn) {
    const originalText = btn.textContent;
    const originalBg = btn.style.background;
    btn.textContent = 'Copied!';
    btn.style.background = '#27ae60';
    btn.style.color = 'white';
    btn.style.borderColor = '#27ae60';
    
    setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = originalBg;
        btn.style.color = '';
        btn.style.borderColor = '';
    }, 2500);
}

function showCopyError(btn) {
    const originalText = btn.textContent;
    btn.textContent = 'Copy Failed';
    btn.style.background = '#e74c3c';
    btn.style.color = 'white';
    btn.style.borderColor = '#e74c3c';
    
    setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.style.color = '';
        btn.style.borderColor = '';
    }, 2500);
}

function openGitHub() {
    window.open(`https://github.com/${userInfo.username_github}`, '_blank', 'noopener,noreferrer');
}

function openProjects() {
    window.open(userInfo.projects_url, '_blank', 'noopener,noreferrer');
}

function initializePortfolio() {
    userInfo.base_url = window.location.origin;
    
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
    
    const supportList = document.getElementById('supportList');
    if (supportList && userInfo.support_buttons && Object.keys(userInfo.support_buttons).length > 0) {
        Object.entries(userInfo.support_buttons).forEach(([key, button]) => {
            const supportItem = document.createElement('div');
            supportItem.className = 'support-item';
            
            if (button.address) {
                supportItem.innerHTML = `
                    <button class="stats-icon-btn" id="statsBtn-${key}" aria-label="View wallet statistics">?</button>
                    <div class="support-content">
                        <div class="support-title">${button.name}</div>
                        <div class="support-address" role="textbox" aria-readonly="true">${button.address}</div>
                        <div class="support-actions">
                            <button class="support-btn copy-btn" onclick="copyAddress('${button.address}', this)" aria-label="Copy address to clipboard">Copy Address</button>
                        </div>
                    </div>
                    <div class="support-qr">
                        <div class="qr-code-container">
                            <img src="${generateQRCode(button.address)}" alt="QR Code for ${button.name} address" class="qr-code-image" loading="lazy">
                        </div>
                    </div>
                `;
            } else if (button.redirect) {
                supportItem.onclick = () => window.open(button.redirect, '_blank', 'noopener,noreferrer');
                supportItem.style.cursor = 'pointer';
                supportItem.innerHTML = `
                    <div class="support-icon">
                        <img src="${button.svg}" alt="${button.name} icon" loading="lazy">
                    </div>
                    <div class="support-content">${button.name}</div>
                `;
            }
            
            supportList.appendChild(supportItem);
        });
    } else if (document.getElementById('supportSection')) {
        document.getElementById('supportSection').style.display = 'none';
    }
    
    const socialLinks = document.getElementById('socialLinks');
    if (socialLinks) {
        const socialPlatforms = [
            { 
                name: 'X (Twitter)', 
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
            link.setAttribute('aria-label', `Visit ${platform.name} profile`);
            link.innerHTML = `<svg viewBox="0 0 ${platform.name === 'Telegram' ? '16 16' : '512 512'}" aria-hidden="true"><path d="${platform.icon}"/></svg>`;
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
    const head = document.head;
    if (!head) return;

    document.title = `${userInfo.username_github} | Portfolio`;

    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.name = 'description';
        head.appendChild(metaDescription);
    }
    metaDescription.content = "official website of offici5l";

    let metaAuthor = document.querySelector('meta[name="author"]');
    if (!metaAuthor) {
        metaAuthor = document.createElement('meta');
        metaAuthor.name = 'author';
        head.appendChild(metaAuthor);
    }
    metaAuthor.content = userInfo.username_github;

    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.name = 'keywords';
        head.appendChild(metaKeywords);
    }
    metaKeywords.content = "portfolio, developer, technology, creativity, offici5l, web developer, software engineer";

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
        "jobTitle": "Software Developer",
        "worksFor": {
            "@type": "Organization",
            "name": userInfo.username_github
        },
        "email": `mailto:${userInfo.email}`,
        "description": "official website of offici5l"
    }, null, 2);
}

function fetchWalletStats() {
    if (!userInfo.support_buttons || !userInfo.support_buttons.bitcoin) {
        return Promise.reject('Bitcoin address not found');
    }
    
    const address = userInfo.support_buttons.bitcoin.address;
    const url = `https://blockstream.info/api/address/${address}`;

    return fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
        },
        cache: 'no-cache'
    }).then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    });
}

function showStats() {
    const statsContent = document.getElementById('statsContent');
    if (!statsContent) return;
    
    statsContent.innerHTML = '<div style="text-align: center;"><p>Loading statistics...</p></div>';
    
    fetchWalletStats()
        .then(data => {
            const chain_stats = data.chain_stats || {};
            const mempool_stats = data.mempool_stats || {};

            statsContent.innerHTML = `
                <h4>Confirmed Transactions</h4>
                <p><strong>Total Received:</strong> <span>${(chain_stats.funded_txo_sum / 100000000 || 0).toFixed(8)} BTC</span></p>
                <p><strong>Total Sent:</strong> <span>${(chain_stats.spent_txo_sum / 100000000 || 0).toFixed(8)} BTC</span></p>
                <p><strong>Current Balance:</strong> <span>${((chain_stats.funded_txo_sum - chain_stats.spent_txo_sum) / 100000000 || 0).toFixed(8)} BTC</span></p>
                <p><strong>Transaction Count:</strong> <span>${chain_stats.tx_count || 0}</span></p>
                <hr>
                <h4>Unconfirmed Transactions</h4>
                <p><strong>Pending Received:</strong> <span>${(mempool_stats.funded_txo_sum / 100000000 || 0).toFixed(8)} BTC</span></p>
                <p><strong>Pending Sent:</strong> <span>${(mempool_stats.spent_txo_sum / 100000000 || 0).toFixed(8)} BTC</span></p>
                <p><strong>Pending Count:</strong> <span>${mempool_stats.tx_count || 0}</span></p>
            `;
        })
        .catch(error => {
            console.error('Error fetching wallet stats:', error);
            statsContent.innerHTML = `
                <div style="text-align: center; color: var(--text-secondary);">
                    <p>Unable to load statistics at this time.</p>
                    <p style="font-size: 0.9rem; margin-top: 1rem;">Please try again later.</p>
                </div>
            `;
        });
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

    const statsModal = document.getElementById('statsModal');
    const closeBtn = document.getElementById('closeBtn');
    const supportList = document.getElementById('supportList');

    if (supportList) {
        supportList.addEventListener('click', function(event) {
            if (event.target && event.target.matches('.stats-icon-btn')) {
                if (statsModal) {
                    statsModal.style.display = 'block';
                    document.body.style.overflow = 'hidden';
                    showStats();
                }
            }
        });
    }

    if (closeBtn) {
        closeBtn.onclick = function() {
            if (statsModal) {
                statsModal.style.display = 'none';
                document.body.style.overflow = '';
            }
        };
    }

    window.onclick = function(event) {
        if (event.target === statsModal) {
            statsModal.style.display = 'none';
            document.body.style.overflow = '';
        }
    };

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && statsModal && statsModal.style.display === 'block') {
            statsModal.style.display = 'none';
            document.body.style.overflow = '';
        }
    });
});