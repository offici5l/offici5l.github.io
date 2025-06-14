# offici5l Portfolio Website

A modern, minimalist Jekyll-based portfolio website designed for showcasing projects and articles with a focus on simplicity and elegance.

## Features

- **Clean, Luxurious Design**: Minimalist aesthetic with sophisticated typography and subtle interactions
- **Responsive Layout**: Optimized for all devices and screen sizes
- **Dynamic Profile Image**: Automatically fetches profile image from GitHub
- **Project Showcase**: Dedicated section for displaying development projects
- **Article Publishing**: Blog-style articles with full Markdown support
- **Image Support**: Full support for images in project and article content
- **SEO Optimized**: Proper meta tags and structured data
- **Fast Loading**: Optimized CSS and JavaScript for performance

## Quick Start

### Prerequisites

- Ruby 2.7 or higher
- Bundler gem
- Git

### Installation

1. **Clone or extract the website files**
   ```bash
   cd offici5l-website-v2
   ```

2. **Install dependencies**
   ```bash
   bundle install
   ```

3. **Start the development server**
   ```bash
   bundle exec jekyll serve
   ```

4. **View the website**
   Open your browser and navigate to `http://localhost:4000`

## Content Management

### Adding a New Project

1. Create a new Markdown file in the `_projects` directory
2. Use the following front matter template:

```yaml
---
title: "Your Project Title"
description: "Brief description of your project"
category: "Project Category"
github_url: "https://github.com/username/repository" # Optional
layout: project
---

Your project content goes here. You can use Markdown formatting and include images:

![Project Screenshot](assets/images/your-image.png)
```

### Adding a New Article

1. Create a new Markdown file in the `_articles` directory
2. Use the following front matter template:

```yaml
---
title: "Your Article Title"
excerpt: "Brief excerpt or summary of the article"
category: "Article Category"
layout: article
---

Your article content goes here with full Markdown support.
```

### Adding Images

1. Place image files in the `assets/images` directory
2. Reference them in your content using Markdown syntax:
   ```markdown
   ![Alt text](assets/images/your-image.png)
   ```

## Customization

### Site Configuration

Edit `_config.yml` to customize site settings:

```yaml
title: "Your Name"
email: your.email@example.com
github_username: yourusername
twitter_username: yourusername  # Optional
telegram_username: yourusername  # Optional
```

### Styling

The main stylesheet is located at `assets/css/main.css`. The design uses CSS custom properties (variables) for easy customization:

```css
:root {
  --primary-color: #212121;
  --secondary-color: #ffffff;
  --accent-color: #0056b3;
  --text-color: #333333;
  --light-gray: #f5f5f5;
  --border-color: #e0e0e0;
}
```

### JavaScript Functionality

Interactive features are handled by `assets/js/main.js`, including:
- Email copy functionality
- Smooth scrolling
- Image loading animations

## Deployment

### GitHub Pages

1. Push your code to a GitHub repository
2. Enable GitHub Pages in repository settings
3. Select the main branch as the source
4. Your site will be available at `https://username.github.io`

### Manual Deployment

1. Build the site locally:
   ```bash
   bundle exec jekyll build
   ```

2. Upload the contents of the `_site` directory to your web server

## File Structure

```
offici5l-website-v2/
├── _articles/              # Article content files
├── _projects/              # Project content files
├── _layouts/               # Page templates
├── assets/
│   ├── css/               # Stylesheets
│   ├── js/                # JavaScript files
│   └── images/            # Image assets
├── _config.yml            # Jekyll configuration
├── Gemfile                # Ruby dependencies
├── index.md               # Homepage
├── projects.md            # Projects listing page
├── articles.md            # Articles listing page
└── README.md              # This file
```

## Browser Compatibility

This website is tested and compatible with:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

The website is optimized for performance with:
- Minimal CSS and JavaScript
- Optimized images
- Efficient font loading
- Clean HTML structure

## Support

For questions or issues:
1. Check the Jekyll documentation: https://jekyllrb.com/docs/
2. Review the GitHub repository for updates
3. Contact the developer through the provided email

## License

This project is open source and available under the MIT License.

