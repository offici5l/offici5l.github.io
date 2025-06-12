# Xiaomi Unlock Tool Error Codes Reference

This document provides a reference for common error codes encountered with the Xiaomi Unlock Tool, along with their descriptions and solutions.

---

## Error Code: 20041

**Message:** "sorry, your mi id is not associated with a phone number"

**Description:** The Xiaomi account is not linked to a phone number.

**Solution:** Add a phone number to the Xiaomi account. (If the option to add a phone number is not available, it can be added via: [https://account.xiaomi.com/pass/serviceLogin?checkSafePhone=true](https://account.xiaomi.com/pass/serviceLogin?checkSafePhone=true))

---

## Error Code: 10013

**Message:** "This device is not activated, please activate it and try to unlock it again"

**Description:** The issue is often due to a part (most likely the motherboard) being replaced in the device.

**Solution:** Contact the Xiaomi support team.

---

## Error Code: 20030

**Message:** "Sorry, couldn't unlock more devices by this account this month"

**Description:** You are trying to retrieve new encryptData (token) in the same month.

**Solution:** You must wait for the beginning of the next month, meaning the 1st of next month.

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

**Message:** "Your account is not authorized to unlock. Please change to another account"

**Description:** The account has been restricted from accessing the bootloader unlock service because Xiaomi's servers detected suspicious activity.

**Solution:** Sometimes, enabling 'Find Device' in settings can resolve the issue. If the problem persists, create a new account.

---

## Error Code: 20045

**Message 1:** "Please use the common user tool on the official website"

**Description 1:** Invalid server region.

**Solution 1:** Change server. In Termux, use 'miunlock global'. In Windows, Linux, or MacOS, use 'python3 Miunlocktool.py global'. Available servers: global, india, russia, china, europe.

**Message 2:** "The place where the account is registered does not match the place where the phone is sold."

**Description 2:** The device is from China, and you are using a global Xiaomi account.

**Solution 2:** Use a China account.

---

## Error Code: 20038

**Message:** "该手机已被账号 **** 通过查找手机锁定，无法解锁"

**Description:** device locked by account ****

**Solution:** Log in to account **** in the following link: [i.mi.com/mobile/find](i.mi.com/mobile/find), select device, Disable Locate Device.


