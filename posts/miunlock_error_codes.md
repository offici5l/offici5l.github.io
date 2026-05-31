---
title: Mi Unlock — Error Codes
description: A reference for Mi Unlock error codes, their causes, and solutions.
tags: [xiaomi, bootloader]
---

A reference for error codes returned by the Mi Unlock Tools, with descriptions and solutions.

( info in this article is updated regularly )

---

---

## 10000

<details>
<summary><span class="label-message">Message</span> Request parameter error</summary>

<span class="label-description">Description</span>

Invalid device token or product.

<span class="label-solution">Solution</span>

Restart the tool. Always make sure you are using the latest version of the tool.

</details>

---

## 10013

<details>
<summary><span class="label-message">Message</span> This device is not activated, please activate it and try to unlock it again</summary>

<span class="label-description">Description</span>

The issue may occur for several reasons, including: the motherboard has been replaced, the device's IMEI has been changed, the phone was purchased on installment, or a custom DNS was used.

<span class="label-solution">Solution</span>

- In some cases, switch the SIM card to the other slot and rebind the account in Developer Options (also disable and re-enable "Find my device").
- In other cases, disable custom DNS and rebind the account in Developer Options (also disable and re-enable "Find my device").
- In some cases, go to Xiaomi Account > Xiaomi Cloud > Enable Call History and Messages using mobile data (not WiFi), then go to Settings > Xiaomi Account > Devices > Current Device; the SIM card should appear activated. (Also disable and re-enable "Find my device".)
- If you still get the same error after trying these solutions, wait about 24 hours or more and try again. If the issue persists, contact Xiaomi.

</details>

<details>
<summary><span class="label-message">Message</span> This device has been activated for less than 7 days. Please activate it for 7 days before trying to unlock it again</summary>

<span class="label-description">Description</span>

There is no precise description for this message currently. It may be due to the SIM card not being activated.

<span class="label-solution">Solution</span>

See the solutions listed under the previous Code 10013 entry above.

</details>

<details>
<summary><span class="label-message">Message</span> Your device's activation time is too short, please try again in ** hours</summary>

<span class="label-description">Description</span>

There is no precise description for this message currently. It may be due to the phone purchase or activation period not yet exceeding 7 days.

<span class="label-solution">Solution</span>

Wait for the time to expire and run the unlock tool again.

</details>

---

## 10023

<details>
<summary><span class="label-message">Message</span> Sorry, couldn't unlock more devices</summary>

<span class="label-description">Description</span>

You are trying to unlock another device with the same account. Starting in 2025, only one device per year is allowed to be unlocked with the same account.

<span class="label-solution">Solution</span>

Use a new account or wait a year.

</details>

---

## 20030

<details>
<summary><span class="label-message">Message</span> Sorry, couldn't unlock more devices by this account this month</summary>

<span class="label-description">Description</span>

You are trying to retrieve new encryptData (token) in the same month.

<span class="label-solution">Solution</span>

Wait for the beginning of the next month (the 1st).

</details>

---

## 20031

<details>
<summary><span class="label-message">Message</span> Please add your account in Settings > Developer options > Mi Unlock status</summary>

<span class="label-description">Description</span>

You did not bind the account in "Mi Unlock Status".

<span class="label-solution">Solution</span>

Go to Developer options → Mi Unlock status → Agree → Add account and device.

> Note: If you have already linked the account but are still encountering the same code, please manually select the `dataCenterZone` in the tool.

</details>

---

## 20033

<details>
<summary><span class="label-message">Message</span> Your account is not authorized to unlock. Please change to another account</summary>

<span class="label-description">Description</span>

The account has been restricted from accessing the bootloader unlock service because Xiaomi's servers detected suspicious activity.

<span class="label-solution">Solution</span>

Sometimes, enabling "Find Device" in settings can resolve the issue. If the problem persists, create a new account.

</details>

---

## 20035

<details>
<summary><span class="label-message">Message</span> Please upgrade your unlock tool</summary>

<span class="label-description">Description</span>

The tool is using an old `clientVersion`.

<span class="label-solution">Solution</span>

If you are using the official tool, download the latest version. If using MiUnlockTool, update `clientVersion` to a higher value.

</details>

---

## 20036

<details>
<summary><span class="label-message">Message</span> Please unlock *** hours later. And do not add your account in MIUI again, otherwise you will wait from scratch</summary>

<span class="label-description">Description</span>

This is normal; please wait. The duration of the waiting period may vary depending on the device type.

<span class="label-solution">Solution</span>

Wait until the waiting period is over, then restart the unlock tool.

> Note: If the waiting time does not decrease or resets to 144 hours, your account has been suspended. You will need to use a different Xiaomi account.

</details>

---

## 20038

<details>
<summary><span class="label-message">Message</span> 该手机已被账号 **** 通过查找手机锁定，无法解锁</summary>

<span class="label-description">Description</span>

The device is locked by account ****.

<span class="label-solution">Solution</span>

Log in to account **** at [i.mi.com/mobile/find](https://i.mi.com/mobile/find), select the device, then disable Locate Device.

</details>

---

## 20039

<details>
<summary><span class="label-message">Message</span> Device basic data verification failed. This device couldn't be unlocked</summary>

<span class="label-description">Description</span>

The device token does not contain the full set of data — the token is incomplete.

<span class="label-solution">Solution</span>

No confirmed solution at this time.

</details>

---

## 20041

<details>
<summary><span class="label-message">Message</span> sorry, your mi id is not associated with a phone number</summary>

<span class="label-description">Description</span>

The Xiaomi account is not linked to a phone number.

<span class="label-solution">Solution</span>

Add a phone number to your account. If the option is not available in-app, it can be added via:
[account.xiaomi.com/pass/serviceLogin?checkSafePhone=true](https://account.xiaomi.com/pass/serviceLogin?checkSafePhone=true)

</details>

---

## 20045

<details>
<summary><span class="label-message">Message</span> Please use the common user tool on the official website</summary>

<span class="label-description">Description</span>

Invalid server region.

<span class="label-solution">Solution</span>

Change `dataCenterZone` in the tool.

</details>

<details>
<summary><span class="label-message">Message</span> The place where the account is registered does not match the place where the phone is sold</summary>

<span class="label-description">Description</span>

The error occurs because you used a Xiaomi account region that does not match the region your device is intended for. For example, using a global Xiaomi account to unlock a Chinese device, or vice versa.

<span class="label-solution">Solution</span>

Use a Xiaomi account from the same region as the device. If the device is Chinese, use a Chinese Xiaomi account.

</details>

---

## 30002

<details>
<summary><span class="label-message">Message</span> Couldn't unlock. Please go to Mi Community to apply for authorization and try again</summary>

<span class="label-description">Description</span>

You did not bind the account in "Mi Unlock Status".

<span class="label-solution">Solution</span>

Go to Developer options → Mi Unlock status → Agree → Add account and device.

> Note: If you have already linked the account but are still encountering the same code, please manually select the `dataCenterZone` in the tool.

</details>
