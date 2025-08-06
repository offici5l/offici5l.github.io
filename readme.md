# Dynamic Portfolio

**Live Demo:** [https://offici5l.github.io](https://offici5l.github.io)

This project provides a dynamic and easily customizable personal portfolio website, showcasing your projects, contact information, social media links, and support options.

## Features

*   **Dynamic GitHub Integration:** Automatically fetches your avatar, bio, and projects from your GitHub profile.
*   **Configurable Links:** Easily set up email, Telegram, and X (Twitter) links.
*   **Customizable Support Buttons:** Add various buttons for user support.
*   **Project Filtering:** Displays GitHub repositories based on a matching homepage URL.
*   **Interactive Background:** Uses `tsparticles` for visual engagement.

## Setup

Configure your information in the `info.js` file. This includes your GitHub username, Telegram channel username, X (formerly Twitter) username, and email address.

## Project Display Logic

Projects from your repositories will be displayed on this website if their `homepage` URL (as defined in their respective repository settings) matches the `userInfo.homepage` URL specified in your main `info.js` file.

## Adding a Support (Donation) Button

To add a support button, edit `info.js`:
1.  In the `support_buttons` object, add a new entry with a unique key.
2.  Define three properties for this entry:
    *   `name`: The display text for the button (e.g., "Buy Me a Coffee").
    *   `redirect`: The full URL where users will be redirected for the donation.
    *   `svg`: The URL of the SVG icon to be displayed next to the button.

**Example:**

```javascript
// ...
support_buttons: {
    // ... existing entries
    buymeacoffee: {
        name: 'Buy Me a Coffee',
        redirect: 'https://www.buymeacoffee.com/yourusername',
        svg: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/buymeacoffee.svg'
    }
}
// ...
```