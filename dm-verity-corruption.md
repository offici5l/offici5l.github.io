## Fixing DM-Verity Corruption

### Method 1: If the Bootloader is Unlocked

1. Enter **Fastboot mode**.
2. Run the following command:

    ```bash
    fastboot oem cdms
    ```
    ```bash
    fastboot oem cdms fix
    ```

---

### Method 2: If the Bootloader is Locked

**Note:** This method only works with devices that have A/B slots.

1. Enter **Fastboot mode**.
2. Check the current slot with the following command:

    ```bash
    fastboot getvar current-slot
    ```

3. If the result is **a**, run:

    ```bash
    fastboot set_active b
    ```

    If the result is **b**, run:

    ```bash
    fastboot set_active a
    ```

4. Restart the device. It should now boot into the system normally.


5. However, one of the slots will remain corrupted. To fix this:
- Add a **Xiaomi account** in Developer Options. and do the steps to unlock the bootloader ...


**After the Bootloader is Unlocked**

1. Switch back to the corrupted slot using the command:

    ```bash
    fastboot set_active "a or b" (whichever is corrupted)
    ```

2. Then, run:

    ```bash
    fastboot oem cdms
    ```
    ```bash
    fastboot oem cdms fix
    ```