## Support Projects Configuration

The `support_buttons` object in `info.js` controls the visibility of the "Support Projects" section and its buttons.

- If `support_buttons` is set to `false` (boolean), the entire "Support Projects" section will be hidden.

- If `support_buttons` is an object, each key within `support_buttons` represents a support option. A button will be rendered for each option that has a `name` and `redirect` property.

**Example `info.js` configuration:**

```javascript
const userInfo = {
    // ... other user info ...
    support_buttons: {
        oxapay: {
            name: 'Support with OxaPay',
            redirect: 'https://pay.oxapay.com/19904987',
            svg: 'https://oxapay.com/_next/static/media/wallet.dbfb0bff.svg'
        },
        proton_wallet: {
            name: 'Support with Proton Wallet',
            redirect: 'https://proton.me/support/wallet-bitcoin-via-email#how-to-send',
            svg: 'https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/proton-wallet.svg'
        }
    }
};
```

To hide the entire section:

```javascript
const userInfo = {
    // ... other user info ...
    support_buttons: false
};
```