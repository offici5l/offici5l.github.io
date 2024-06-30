<details markdown='1'><summary>code 10013 = This device  is not activated, please activate it and try to unlock it again</summary>

the issue is due to changing a piece of the phone's hardware, most likely the motherboard

Currently, there is no solution for this issue unfortunately

The only solution currently is to contact the Xiaomi support team.


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