// Optimized content loader with improved performance and UX
// Cache for loaded content to avoid repeated requests
const contentCache = new Map();
const loadingStates = new Map();

// Utility function to load and parse markdown files with caching
async function loadMarkdownFile(filePath) {
    // Check cache first
    if (contentCache.has(filePath)) {
        return contentCache.get(filePath);
    }

    // Check if already loading to prevent duplicate requests
    if (loadingStates.has(filePath)) {
        return loadingStates.get(filePath);
    }

    try {
        const loadPromise = fetch(filePath).then(async response => {
            if (!response.ok) {
                throw new Error(`Failed to load ${filePath}: ${response.status}`);
            }
            const content = await response.text();
            contentCache.set(filePath, content);
            loadingStates.delete(filePath);
            return content;
        });

        loadingStates.set(filePath, loadPromise);
        return await loadPromise;
    } catch (error) {
        console.error("Error loading markdown file:", error);
        loadingStates.delete(filePath);
        return null;
    }
}

// Function to parse markdown content and extract title
function parseMarkdownTitle(content) {
    const lines = content.split("\n");
    for (let line of lines) {
        if (line.startsWith("# ")) {
            return line.substring(2).trim();
        }
    }
    return "Untitled";
}

// Function to parse project markdown content with improved parsing
function parseProjectMarkdown(content) {
    const lines = content.split("\n");
    let title = "";
    let description = "";
    let link = "";
    
    let currentSection = "";
    
    for (let line of lines) {
        const trimmedLine = line.trim();
        
        if (trimmedLine.startsWith("# ")) {
            // Extract title from # header
            title = trimmedLine.substring(2).trim();
            currentSection = "title";
        } else if (trimmedLine.startsWith("## ")) {
            // Start collecting description after ## header
            const descriptionHeader = trimmedLine.substring(3).trim();
            if (descriptionHeader) {
                description = descriptionHeader;
            }
            currentSection = "description";
        } else if (trimmedLine.startsWith("### ")) {
            // Extract link from ### header
            const linkContent = trimmedLine.substring(4).trim();
            if (linkContent) {
                link = linkContent;
            }
            currentSection = "link";
        } else if (trimmedLine && currentSection === "description") {
            // Continue collecting description content
            if (description) {
                description += " " + trimmedLine;
            } else {
                description = trimmedLine;
            }
        } else if (trimmedLine && currentSection === "link") {
            // Continue collecting link content
            if (link) {
                link += " " + trimmedLine;
            } else {
                link = trimmedLine;
            }
        }
    }
    
    return {
        title: title || "Untitled Project",
        description: description.trim() || "No description available",
        link: link.trim() || "#"
    };
}

// Function to convert markdown to HTML (optimized)
function markdownToHtml(markdown) {
    let html = markdown;
    
    // Convert headers
    html = html.replace(/^### (.*$)/gim, "<h3>$1</h3>");
    html = html.replace(/^## (.*$)/gim, "<h2>$1</h2>");
    html = html.replace(/^# (.*$)/gim, "<h1>$1</h1>");
    
    // Convert bold and italic
    html = html.replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>");
    html = html.replace(/\*(.*?)\*/gim, "<em>$1</em>");
    
    // Convert links
    html = html.replace(/\[([^\]]*)\]\(([^\)]*)\)/gim, "<a href=\"$2\" target=\"_blank\" rel=\"noopener noreferrer\">$1</a>");
    
    // Convert code blocks
    html = html.replace(/```([^`]*)```/gim, "<pre><code>$1</code></pre>");
    
    // Convert inline code
    html = html.replace(/`([^`]*)`/gim, "<code>$1</code>");
    
    // Convert images
    html = html.replace(/!\[([^\]]*)\]\(([^\)]*)\)/gim, "<img src=\"$2\" alt=\"$1\" loading=\"lazy\" style=\"max-width: 100%; height: auto; border-radius: 8px; margin: 20px 0;\">");
    
    // Convert line breaks
    html = html.replace(/\n/gim, "<br>");
    
    return html;
}

// Optimized directory scanning with better error handling
async function scanDirectoryForMarkdown(directory, basePath = "") {
    try {
        const response = await fetch("content_index.json");
        if (!response.ok) {
            throw new Error(`Failed to load content_index.json: ${response.status}`);
        }
        const contentIndex = await response.json();
        
        let files = [];
        if (directory.includes("Articles")) {
            files = contentIndex.articles;
        } else if (directory.includes("Projects")) {
            files = contentIndex.projects;
        }

        return files.map(file => {
            const parts = file.path.split("/");
            const fileName = parts[parts.length - 1].replace(".md", "");
            const category = parts.length > 2 ? parts[parts.length - 2] : "root";
            return {
                path: file.path,
                relativePath: file.path,
                fileName: fileName,
                category: category
            };
        });

    } catch (error) {
        console.error(`Error loading content_index.json:`, error);
        return [];
    }
}

// Enhanced loading function with better UX
function showLoadingState(container, message = "Loading...") {
    container.innerHTML = `
        <div class="loading">
            <div class="loading-spinner"></div>
            ${message}
        </div>
    `;
}

// Function to update statistics
function updateStats(type, totalItems, categories) {
    const totalElement = document.getElementById(`total-${type}`);
    const categoriesElement = document.getElementById('total-categories');
    const latestElement = document.getElementById('latest-update');
    
    if (totalElement) totalElement.textContent = totalItems;
    if (categoriesElement) categoriesElement.textContent = Object.keys(categories).length;
    if (latestElement) latestElement.textContent = new Date().toLocaleDateString();
}

// Enhanced articles loading with better performance
async function loadArticles() {
    const articlesContainer = document.getElementById("articles-container");
    if (!articlesContainer) return;
    
    showLoadingState(articlesContainer, "Loading articles...");
    
    try {
        const articleFiles = await scanDirectoryForMarkdown("Articles/");
        
        if (articleFiles.length === 0) {
            articlesContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📄</div>
                    <h3>No articles found</h3>
                    <p>Add .md files to the Articles folder to see them here.</p>
                </div>
            `;
            return;
        }
        
        // Load article metadata in parallel
        const articlePromises = articleFiles.map(async (fileInfo) => {
            const content = await loadMarkdownFile(fileInfo.path);
            if (content) {
                const title = parseMarkdownTitle(content);
                return {
                    title,
                    fileName: fileInfo.fileName,
                    relativePath: fileInfo.relativePath,
                    category: fileInfo.category,
                    path: fileInfo.path
                };
            }
            return null;
        });
        
        const articles = (await Promise.all(articlePromises)).filter(Boolean);
        
        // Group articles by category
        const groupedArticles = {};
        articles.forEach(article => {
            if (!groupedArticles[article.category]) {
                groupedArticles[article.category] = [];
            }
            groupedArticles[article.category].push(article);
        });
        
        updateStats('articles', articles.length, groupedArticles);
        
        let articlesHtml = "";
        
        Object.keys(groupedArticles).forEach((category, index) => {
            const categoryTitle = category === "root" ? "General" : category.charAt(0).toUpperCase() + category.slice(1);
            
            articlesHtml += `
                <div class="category-section" style="animation-delay: ${index * 0.1}s">
                    <h2 class="category-title">${categoryTitle}</h2>
                    <div class="articles-grid">
            `;
            
            groupedArticles[category].forEach((article, articleIndex) => {
                const encodedPath = encodeURIComponent(article.relativePath.replace(".md", ""));
                articlesHtml += `
                    <div class="article-card" style="animation-delay: ${(index * 0.1) + (articleIndex * 0.05)}s">
                        <div class="article-header">
                            <h3 class="article-title">
                                <a href="item.html?type=article&file=${encodedPath}">${article.title}</a>
                            </h3>
                        </div>
                        <p class="article-description">Click to read the full article</p>
                        <div class="article-footer">
                            <a href="item.html?type=article&file=${encodedPath}" class="article-link">
                                Read Article
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M7 17L17 7"/>
                                    <path d="M7 7h10v10"/>
                                </svg>
                            </a>
                            <div class="article-meta">
                                <span class="article-tag">${categoryTitle}</span>
                            </div>
                        </div>
                    </div>
                `;
            });
            
            articlesHtml += "</div></div>";
        });
        
        articlesContainer.innerHTML = articlesHtml;
    } catch (error) {
        console.error("Error loading articles:", error);
        articlesContainer.innerHTML = `
            <div class="empty-state">
                <h3>Error loading articles</h3>
                <p>Please try refreshing the page.</p>
            </div>
        `;
    }
}

// Enhanced projects loading with better performance
async function loadProjects() {
    const projectsContainer = document.getElementById("projects-container");
    if (!projectsContainer) return;
    
    showLoadingState(projectsContainer, "Loading projects...");
    
    try {
        const projectFiles = await scanDirectoryForMarkdown("Projects/");
        
        if (projectFiles.length === 0) {
            projectsContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">🚀</div>
                    <h3>No projects found</h3>
                    <p>Add .md files to the Projects folder to see them here.</p>
                </div>
            `;
            return;
        }
        
        // Load project metadata in parallel
        const projectPromises = projectFiles.map(async (fileInfo) => {
            const content = await loadMarkdownFile(fileInfo.path);
            if (content) {
                const projectData = parseProjectMarkdown(content);
                return {
                    ...projectData,
                    fileName: fileInfo.fileName,
                    relativePath: fileInfo.relativePath,
                    category: fileInfo.category,
                    path: fileInfo.path
                };
            }
            return null;
        });
        
        const projects = (await Promise.all(projectPromises)).filter(Boolean);
        
        // Group projects by category
        const groupedProjects = {};
        projects.forEach(project => {
            if (!groupedProjects[project.category]) {
                groupedProjects[project.category] = [];
            }
            groupedProjects[project.category].push(project);
        });
        
        updateStats('projects', projects.length, groupedProjects);
        
        let projectsHtml = "";
        
        Object.keys(groupedProjects).forEach((category, index) => {
            const categoryTitle = category === "root" ? "General" : category.charAt(0).toUpperCase() + category.slice(1);
            
            projectsHtml += `
                <div class="category-section" style="animation-delay: ${index * 0.1}s">
                    <h2 class="category-title">${categoryTitle}</h2>
                    <div class="projects-grid">
            `;
            
            groupedProjects[category].forEach((project, projectIndex) => {
                const encodedPath = encodeURIComponent(project.relativePath.replace(".md", ""));
                projectsHtml += `
                    <div class="project-card" style="animation-delay: ${(index * 0.1) + (projectIndex * 0.05)}s">
                        <div class="project-header">
                            <h3 class="project-title">
                                <a href="item.html?type=project&file=${encodedPath}">${project.title}</a>
                            </h3>
                        </div>
                        <p class="project-description">${project.description}</p>
                        <div class="project-footer">
                            <a href="${project.link}" target="_blank" rel="noopener noreferrer" class="project-link">
                                View Project
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M7 17L17 7"/>
                                    <path d="M7 7h10v10"/>
                                </svg>
                            </a>
                            <div class="project-meta">
                                <span class="project-tag">${categoryTitle}</span>
                            </div>
                        </div>
                    </div>
                `;
            });
            
            projectsHtml += "</div></div>";
        });
        
        projectsContainer.innerHTML = projectsHtml;
    } catch (error) {
        console.error("Error loading projects:", error);
        projectsContainer.innerHTML = `
            <div class="empty-state">
                <h3>Error loading projects</h3>
                <p>Please try refreshing the page.</p>
            </    // Enhanced single item loading
async function loadSingleItem() {
    const urlParams = new URLSearchParams(window.location.search);
    const encodedFilePath = urlParams.get("file");
    const type = urlParams.get("type");
    
    if (!encodedFilePath || !type) {
        document.getElementById("item-content").innerHTML = `
            <div class="empty-state">
                <h3>No item specified</h3>
                <p>Please select an item to view.</p>
            </div>
        `;
        return;
    }

    const filePath = decodeURIComponent(encodedFilePath);

    // Determine the base directory and back link
    let backLink, backText;
    if (type === "article") {
        backLink = "articles.html";
        backText = "← Back to Articles";
    } else if (type === "project") {
        backLink = "projects.html";
        backText = "← Back to Projects";
    } else {
        document.getElementById("item-content").innerHTML = `
            <div class="empty-state">
                <h3>Invalid item type</h3>
                <p>The requested item type is not supported.</p>
            </div>
        `;
        return;
    }

    const itemContentContainer = document.getElementById("item-content");
    showLoadingState(itemContentContainer, `Loading ${type}...`);

    try {
        const content = await loadMarkdownFile(filePath);
        if (!content) {
            itemContentContainer.innerHTML = `
                <div class="empty-state">
                    <h3>Item not found</h3>
                    <p>The requested ${type} could not be found at ${filePath}.</p>
                    <a href="${backLink}" class="back-link">${backText}</a>
                </div>
            `;
            return;
        }

        let htmlContent;
        if (type === "project") {
            const projectData = parseProjectMarkdown(content);
            htmlContent = `
                <h1>${projectData.title}</h1>
                <p>${projectData.description}</p>
                <p><a href="${projectData.link}" target="_blank" rel="noopener noreferrer">View Project</a></p>
            `;
        } else {
            htmlContent = markdownToHtml(content);
        }

        itemContentContainer.innerHTML = `
            <div class="item-header">
                <a href="${backLink}" class="back-link">${backText}</a>
            </div>
            <div class="item-body">
                ${htmlContent}
            </div>
        `;

    } catch (error) {
        console.error(`Error loading single ${type}:`, error);
        itemContentContainer.innerHTML = `
            <div class="empty-state">
                <h3>Error loading ${type}</h3>
                <p>An error occurred while trying to load the ${type}.</p>
                <a href="${backLink}" class="back-link">${backText}</a>
            </div>
        `;
    }
};
    }
    
    // Set back button
    const backButton = document.getElementById("back-link");
    if (backButton) {
        backButton.href = backLink;
        backButton.textContent = backText;
    }
    
    const filePath = `${baseDir}/${fileName}.md`;
    
    try {
        const content = await loadMarkdownFile(filePath);
        
        if (!content) {
            document.getElementById("item-content").innerHTML = `
                <div class="empty-state">
                    <h3>Item not found</h3>
                    <p>The requested ${type} could not be found.</p>
                </div>
            `;
            return;
        }
        
        const title = parseMarkdownTitle(content);
        document.title = `${title} - Tech Odyssey`;
        const titleElement = document.getElementById("item-title");
        if (titleElement) {
            titleElement.textContent = title;
        }
        
        if (type === "project") {
            // For projects, parse and display with special formatting
            const projectData = parseProjectMarkdown(content);
            const projectHtml = `
                <div class="project-detail">
                    <h1>${projectData.title}</h1>
                    <div class="project-description">
                        <h2>Description</h2>
                        <p>${projectData.description}</p>
                    </div>
                    ${projectData.link !== "#" ? `
                        <div class="project-actions">
                            <a href="${projectData.link}" target="_blank" rel="noopener noreferrer" class="project-link">
                                View Project
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M7 17L17 7"/>
                                    <path d="M7 7h10v10"/>
                                </svg>
                            </a>
                        </div>
                    ` : ''}
                </div>
            `;
            document.getElementById("item-content").innerHTML = projectHtml;
        } else {
            // For articles, convert markdown to HTML
            const htmlContent = markdownToHtml(content);
            document.getElementById("item-content").innerHTML = `<div class="article-content">${htmlContent}</div>`;
        }
    } catch (error) {
        console.error("Error loading item:", error);
        document.getElementById("item-content").innerHTML = `
            <div class="empty-state">
                <h3>Error loading ${type}</h3>
                <p>Please try refreshing the page.</p>
            </div>
        `;
    }
}

// Optimized initialization with better performance
document.addEventListener("DOMContentLoaded", function() {
    const currentPage = window.location.pathname.split("/").pop();
    
    // Use requestAnimationFrame for smoother initialization
    requestAnimationFrame(() => {
        if (currentPage === "articles.html") {
            loadArticles();
        } else if (currentPage === "projects.html") {
            loadProjects();
        } else if (currentPage === "item.html") {
            loadSingleItem();
        }
    });
});

// Add performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log(`Page load time: ${perfData.loadEventEnd - perfData.loadEventStart}ms`);
        }, 0);
    });
}

