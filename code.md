<details markdown='1'><summary>code 10013 = This device  is not activated, please activate it and try to unlock it again</summary>

___

the issue is due to changing a piece of the phone's hardware, most likely the motherboard

Currently, there is no solution for this issue unfortunately

The only solution currently is to contact the Xiaomi support team.

___

### Explanation of the reason according to my analysis:

When sending a request to Xiaomi's server through developer settings "Mi Unlock status" the following information is sent to Xiaomi's server for verification:
- userId
- rom_version
- heartbeat_mode
- cloudsp_devId
- cloudsp_cpuId
- cloudsp_product
- cloudsp_userId
- cloudsp_fid
- cloudsp_nonce
- cloudp_sign
- error_code

I believe the issue is related to cloudsp_fid, which is the security DeviceId.

Therefore, Xiaomi's server, upon analyzing the security DeviceId, returns error code 10013 when attempting to unlock the bootloader.

</details>

___

<details markdown='1'><summary>code 20030 = Sorry, couldn't unlock more devices by this account this month</summary>

___

The reason is because you have already unlocked a device recently from one Mi account at once

You must wait for the beginning of next month, meaning the 1st of next month ( according to the time zone of the server region )

___

**Question:**
But I haven't unlocked any device before!

**Answer:**
Yes, but you have used a bootloader unlocking tool before (or **reason**) with the same account (whether it's official or unofficial doesn't matter).
The Xiaomi server has indeed sent the encryptedData(token) before, to unlock the bootloader. So, whether you have previously unlocked a device or failed to unlock the same device, it doesn't matter. Because new data (with the same account) For some **Reason**(explained at the end of the answer) was sent to the server that doesn't match the data sent in the initial attempt. Therefore, the Xiaomi server considers that you're attempting to unlock a new device, and it only allows unlocking one device per month.

**Reason: after the last encryptedData(token) received from the server**(
- The account has logged out on the device Then are logged in(This generates a mismatched device token)
-  An attempt was made to send the request in developer settings("add account and device")
- And other reasons

) ****Conclusion: data no longer matches > So Xiaomi's server considers it a new device****

</details>

___

<details markdown='1'><summary>code 10000 = Request parameter error</summary>

___

invalid device "token or product"

</details>

___

<details markdown='1'><summary>code 20045 = Please use the common user tool on the official website</summary>

___

invalid server region

Change server by command :

in Termux

```
miunlock global
```

in Windows Linux Macos

```
python3 Miunlocktool.py global
```

Available Servers :
global, india, russia, china, europe

</details>

___

<details markdown='1'><summary>code 20035 = Please upgrade your unlock tool</summary>

___

If you are using an official tool or other tools Download the latest version of the tool.

If you are using the MiUnlockTool, Just update "clientVersion":"Place a higher version than the previous one"

github.com/offici5l/MiUnlockTool/blob/main/MiUnlockTool.py#L331

</details>

___

<details markdown='1'><summary>code 20031 = Please add your account in Settings > Developer options > Mi Unlock status.</summary>

___

Go to Settings, click on Additional settings, then Developer options. Enable OEM unlocking and USB debugging. Bind your Xiaomi account to your phone. Tap Mi Unlock status » Agree » Add account and device. Make sure your device can connect to the internet using mobile data. Once the account is successfully bound, you should get a message Added successfully. Mi account is associated with this device now.

If you've successfully added your account in the developer options but are still encountering this issue code 20031, try changing the server region.

Example:

For Windows, Linux, or macOS:

```
python3 MiUnlockTool.py global
```

For Termux:
```
miunlock global
```

Available regions:

global

india

russia

china

europe


</details>

___

<details markdown='1'><summary>code 20033 = Your account is not authorized to unlock. Please change to another account.</summary>

___

The account has been banned or restricted from accessing the bootloader unlock service because Xiaomi's servers detected suspicious or abnormal activity or requests ... to their servers. This is due to security reasons related to Xiaomi's protection measures...


Solution: Sometimes, simply enabling "Find Device" in settings can resolve the issue.
If the problem persists, create a new account.

</details>

