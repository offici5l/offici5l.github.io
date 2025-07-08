# Unlock Xiaomi CN Devices

## Introduction
On October 20, 2024, Xiaomi implemented a new restriction for bootloader unlocking, affecting users with mismatched device and account regions. Users with a Chinese device linked to a global Xiaomi account, or a global device linked to a Chinese Xiaomi account, encounter the error:
Code 20045: "The place where the account is registered does not match the place where the phone is sold."
This creates a significant challenge, especially for users outside China with Chinese devices, as creating a Chinese Xiaomi account typically requires a Chinese phone number. 
Creating a Chinese Xiaomi account outside China is difficult due to the requirement of a Chinese phone number for registration on Xiaomi’s official website. Even when a Chinese account is created using an email (e.g., via https://cn.account.xiaomi.com/fe/service/register/email?_uRegion=CN, tested successfully on December 4, 2024), users face another hurdle during the final bootloader unlocking step:
Code 20041: "Sorry, your Mi ID is not associated with a phone number."
This error occurs because Xiaomi mandates a phone number for account verification, and non-Chinese numbers are not accepted.

# Solution:
On February 28, 2025, offici5l discovered a glitch that allows users to create a Chinese Xiaomi account using an international phone number, enabling bootloader unlocking for Chinese devices outside China. Follow the steps below to unlock your device.

## Steps:

1.  **Create a Chinese Xiaomi Account**
    You can register a Chinese Xiaomi account by following the instructions in this article: [Create a Chinese Xiaomi Account](/articles/mi-account-cn)

2.  *Note:* Skip this step for MIUI users.
     Use [MiBypassTool](https://github.com/offici5l/MiBypassTool) For HyperOS devices ( hyperos2 devices and some hyperos1 devices cannot do this )

3.  *Note:* Skip this step for HyperOS users.
     **Link the Account in Developer Options**

4.  **Run MiUnlockTool**
    run [MiUnlockTool](https://github.com/offici5l/MiUnlockTool)

## Warning

Xiaomi may patch this method at any time.

Last verified: April 22, 2025.
