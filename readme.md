# Dynamic Portfolio ex: https://offici5l.github.io

This is a dynamic portfolio designed to showcase your projects, email, social media, and support/donation options.

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