# Super Bright FlashLight
This is a documentation lists all the problems or noticeable thing during the app development.

[General Process](#general-process)

Problems encountered during development

[To run and debug the Harmony device configure the HarmonyOS runtime](#to-run-and-debug-then-harmony-device-configure-the-harmonyos-runtime)

## General Process

## To run and debug the Harmony device configure the HarmonyOS runtime

#### Background
In order to test the project on emulator we need to install Deveco Studio 5.0, since the system-image through our welink resource is `HarmonyOS` device, we can't simply deploy our OpenHarmony project on it.
Therefore, we need to change a bit of `OpenHarmony` project to make it working.

#### Solution
in `build-profile.json` file, comment on the `OpenHarmony` products configuration, replace it when `HarmonyOS` products configuration shown as follows. 
```typescript
    "products": [
      {
        "name": "default",
        "signingConfig": "default",
        "compatibleSdkVersion": "4.1.0(11)",
        "runtimeOS": "HarmonyOS",
        "buildOption": {
          "strictMode": {
            "caseSensitiveCheck": true,
          }
        }
      }
    ],
    //    "products": [
    //      {
    //        "name": "default",
    //        "signingConfig": "default",
    //        "compileSdkVersion": 11,
    //        "compatibleSdkVersion": 11,
    //        "runtimeOS": "OpenHarmony",
    //      }
    //    ],
```

#### References
https://www.cnblogs.com/changyiqiang/p/17954322


