# Guide to creating a website like offici5l.github.io

This guide explains how to easily manage content on your GitHub Pages website.


## 📁 Website Structure (Simplified)

```
/
├── index.html
├── articles.html
├── projects.html
├── item.html
├── js/content-loader.js
├── Articles/             # Your articles (.md)
│   └── [category]/your-article.md
├── Projects/             # Your projects (.md)
│   └── [category]/your-project.md
└── picture/              # Your images (.jpg, .png)
```

## 🚀 How to Add Content

### Adding an Article or Project

1.  **Create a Markdown (.md) file** in the `Articles/` or `Projects/` folder.
    -   For categorized articles: `Articles/[category_name]/your-article.md`
    -   For categorized projects: `Projects/[category_name]/your-project.md`

2.  **Markdown Content Format**:

    **For Articles (e.g., `Articles/your-article.md`)**:
    ```markdown
    # Article Title

    Your content goes here. Use standard Markdown syntax.

    ## Subheading

    Paragraph with **bold text** and *italic text*.

    ![Image Description](picture/your-image.jpg)
    ```

    **For Projects (e.g., `Projects/your-project.md`)**:
    ```markdown
    # Project Title

    ## Detailed description of your project. (This will be visible when clicking on the project)

    ### https://link-to-your-project (This will be the clickable link)
    ```

3.  **Automatic Display**: Content will automatically appear on the `articles.html` or `projects.html` pages.

### Adding Images

1.  Place your images in the `picture/` folder.
2.  Reference them in Markdown: `![Description](picture/image-name.jpg)`.

## 🧪 How to Test Locally

To preview your website before deploying it to GitHub Pages:

1.  **Open your terminal** and navigate to your website's root folder:
    ```bash
    cd /path/to/your-website-folder
    ```

2.  **Start a local web server** (Python is usually pre-installed):
    ```bash
    python3 -m http.server 8000
    ```

3.  **Open your web browser** and visit the address:
    ```
    http://localhost:8000
    ```

## 🚀 Deployment

Once satisfied, upload all files to your GitHub Pages repository. Ensure your repository is configured for GitHub Pages, and your site will be live at `https://[username].github.io/[repository-name]`.