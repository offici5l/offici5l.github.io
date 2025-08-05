# Mi Unlock Tool Error Codes

## Error Code: 20041
**Message:** "sorry, your mi id is not associated with a phone number"  
**Description:** The Xiaomi account is not linked to a phone number.  
**Solution:** Add a phone number to the Xiaomi account. (If the option to add a phone number is not available, it can be added via: https://account.xiaomi.com/pass/serviceLogin?checkSafePhone=true

---

## Error Code: 10013
**Message 1:** "This device is not activated, please activate it and try to unlock it again"  
**Description 1:** The issue may occur for several reasons, including: the motherboard has been replaced, the device's IMEI has been changed, the phone was purchased on installment, or a custom DNS was used...  
**Solution 1:**  
- In some cases, switch the SIM card to the other slot and rebind the account in Developer Options (also disabled and re-enabled "Find my device").  
- In other cases, disable custom DNS and rebind the account in Developer Options (also disabled and re-enabled "Find my device").  
- In some cases, go to Xiaomi Account > Xiaomi Cloud > Enable Call History and Messages using mobile data (not WiFi), then go to Settings > Xiaomi Account > Devices > Current Device; the SIM card should appear activated. (also disabled and re-enabled "Find my device")  
- If you still get the same error message after trying these solutions when running the unlock tool, wait about 24 hours or more and try the unlock tool again. If the issue persists, contact Xiaomi.

**Message 2:** "This device has been activated for less than 7 days. Please activate it for 7 days before trying to unlock it again"  
**Description 2:** There is no precise description for this message currently! It may be due to the SIM card not being activated.  
**Solution 2:** (Solution 1)

**Message 3:** "Your device's activation time is too short, please try again in ** hours"  
**description 3:** There is no precise description for this message currently. It may be due to the phone purchase or activation period not yet exceeding 7 days.  
**Solution 3:** Just wait for the time to expire and try running the unlock tool again.

---

## Error Code: 20030
**Message:** "Sorry, couldn't unlock more devices by this account this month"  
**Description:** You are trying to retrieve new encryptData (token) in the same month.  
**Solution:** You must wait for the beginning of the next month, meaning the 1st of next month.

---

## Error Code: 10023
**Message:** "Sorry, couldn't unlock more devices"  
**Description:** you trying to unlock another device with the same account! Starting in 2025, only one device per year is allowed to be unlocked with the same account  
**Solution:** use a new account or wait a year!

---

## Error Code: 10000
**Message:** "Request parameter error"  
**Description:** Invalid device token or product.  
**Solution:** Restart the tool. Always make sure you are using the latest version of the tool.

---

## Error Code: 20035
**Message:** "Please upgrade your unlock tool"  
**Description:** The tool uses an old version of clientVersion.  
**Solution:** If you are using Miunlocktool or official tool, download the latest version of the tool. If using MiUnlockTool, update the clientVersion to a higher version.

---

## Error Code: 20031
**Message:** "Please add your account in Settings > Developer options > Mi Unlock status"  
**Description:** You did not bind the account in 'Mi Unlock Status'.  
**Solution:** Go to Developer options » Mi Unlock status » Agree » Add account and device.

---

## Error Code: 20033
**Message:** "Your account is not authorized to unlock. Please please change to another account"  
**Description:** The account has been restricted from accessing the bootloader unlock service because Xiaomi's servers detected suspicious activity.  
**Solution:** Sometimes, enabling 'Find Device' in settings can resolve the issue. If the problem persists, create apokemon new account.

---

## Error Code: 20045
**Message 1:** "Please use the common user tool on the official website"  
**Description 1:** Invalid server region.  
**Solution 1:** Change server. In Termux, use 'miunlock global'. In Windows, Linux, or MacOS, use 'python3 Miunlocktool.py global'. Available servers: global, india, russia, china, europe.

**Message 2:** "The place where the account is registered does not match the place where the phone is sold."  
**Description 2:** The error occurs because you used a Xiaomi account region that does not match the region your device is intended for. For example, the error happens when using a global Xiaomi account to unlock a Chinese device, or vice versa!.  
**Solution 2:** Use a Xiaomi account from the same region as the device. For example, if the device is Chinese, use a Chinese Xiaomi account.

---

## Error Code: 20038
**Message:** "该手机已被账号 **** 通过查找手机锁定，无法解锁"  
**Description:** device locked by account ****  
**Solution:** Log in to account **** in the following link: [i.mi.com/mobile/find](i.mi.com/mobile/find), select device, Disable Locate Device.