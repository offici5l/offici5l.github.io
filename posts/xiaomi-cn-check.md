---
title: How to Verify That the Xiaomi You're About to Buy Isn't a Chinese Unit
description: Before you buy, run these three checks to confirm the Xiaomi you're holding isn't a Chinese unit passed off as international.
date: 2026-05-31
tags: [xiaomi, info]
---

Many Xiaomi buyers get caught out purchasing devices sold as "global versions" from unofficial shops or as second-hand units, only to find out later they're Chinese (CN) variants that have been tampered with.

If you're about to make a purchase and want to be sure before handing over money, here's a practical three-step check you can run on the device beforehand to confirm it isn't a Chinese Xiaomi.

---

### Step 1: ROM Version Code (Preliminary Check)

Check the ROM version string on the device. The two letters before the last two characters indicate the region:

```
OS3.0.10.0.WOJCNXM  — China (Destined for: China)
OS3.0.10.0.WOJMIXM  — Global (Destined for: Worldwide)
OS3.0.10.0.WOJTWXM  — Taiwan (Destined for: Taiwan)
OS3.0.10.0.WOJRUXM  — Russia (Destined for: Russia)
OS3.0.10.0.WOJIDXM  — Indonesia (Destined for: Indonesia)
OS3.0.10.0.WOJTRXM  — Turkey (Destined for: Turkey)
OS3.0.10.0.WOJEUXM  — Europe (Destined for: Europe)
OS3.0.10.0.WOJINXM  — India (Destined for: India)
```

If those two letters are **not CN**, the device is not a Chinese unit.

> This check alone won't catch Chinese devices that have had a Global ROM installed.

---

### Step 2: IMEI Verification

Dial `*#06#` to retrieve your IMEI numbers, then go to:
[https://www.mi.com/global/verify#/en/tab/imei](https://www.mi.com/global/verify#/en/tab/imei)


****

Try the first IMEI, the second IMEI, and the serial number (S/N). If the device isn't a Chinese unit, all three should return:

> This is a `<device name>` `<colour>` `<RAM/ROM>`
> **Congratulations! You can be assured the phone you have purchased is the official international version.**

> This check won't catch Chinese devices whose IMEI has been replaced with one registered on Xiaomi's servers as international.

---

### Step 3: CPU ID Verification

Dial `*#*#6484#*#*` → **Software version** → **CPU ID**

Then go to:
[https://offici5l.github.io/MiCheck](https://offici5l.github.io/MiCheck/)

Enter the CPU ID and the device codename. If the device isn't a Chinese unit, you'll get:

> **Congratulations! You can be assured the phone you have purchased is the official international version.**
