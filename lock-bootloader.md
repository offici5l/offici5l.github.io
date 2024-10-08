# How to Lock the Bootloader

## Step 1: Enter Fastboot Mode (Bootloader Mode)

To enter **Fastboot mode**, follow these steps:

1. Power off your device completely.
2. Press and hold the **Volume Down** button and the **Power** button simultaneously.
3. Keep holding until the **Fastboot** screen appears.

---

## Step 2: Ensure Partitions are Clean

Make sure that all partitions are clean:

- If you've previously rooted your device, flash the clean boot.img or if any modifications have been made to any partition, flash the clean partition-name.img 

to prevent any potential issues in the future.

---

## Step 3: Lock the Bootloader

Once you are in **Fastboot mode** and have ensured the partitions are clean, lock the bootloader by running the following command:

```bash
fastboot oem lock
```