# Super Bright FlashLight
## Introduction

Super Bright FlashLight shows a simple demo of controlling flashlight on `OpenHarmony` device.

This documentation also listed all the problems or noticeable thing during the app development.

### Table of content
[Functionaility](#functionaility)  

 [General Process](#general-process)

Problems encountered during development

1. [To run and debug the Harmony device configure the HarmonyOS runtime](#to-run-and-debug-the-harmony-device-configure-the-harmonyos-runtime)

2. [Change the HarmonyOS project back to OpenHarmony](#change-the-harmonyos-project-back-to-openharmony)

## General Process
This part introduces the general process of the application development  
1. [UI design and implement](#ui-design-and-implement)
2. [Logic and functionailities](#logic-and-functionailities)
3. [Check and testing](#check-and-testing)
4. [App display and acceptance](#app-display-and-acceptance)
5. [Add all necessary files](#add-all-necessary-files)
6. [Merge to applist and finish](#merge-to-applist-and-finish)

## Functionaility
    •  Provide a simple UI page with a slider. When we slide the bar to the top direction, the flashlight will goes brighter, vice versa.

    •  When we slide the bar, an `Off` button will pop up, click this button will reset the slider and turn off the flashlight.
    

### UI Design and Implement
 - Take the example of `Super Bright FlashLight`, we are aiming to design the app with user-friendly interface. Comunicate with UI/UX colleague and got the basic construction idea.

- After that, start to build the UI part, 
my idea is to construct the UI with very simple containers(Like placing columns/rows with a different color to make a general position layout)

- Then, start to replce each component with the containers
> In my case I need to place a flashlight image as background, and a `fragemented slider` to control the flashlight's brightness, so choose `Stack` as the basic container.

### Logic and functionailities
- After basic logic constrcution we can start to write the logic part.
> **Note**  
> There is some basic logic code within UI part, general it's inside the callback function of some `User-interacting Component like Button(), Slider(), TextInput() and etc.`

- The `User-interacting UI component` can control the UI variables which defined inside the struct.

```typescript
@Entry
@Component
struct Index{
@State isOn: boolean = false
  build(){
    Button('Click')
    .onClick(()=>{
    this.isOn = this.isOn ? true : false
    })
  }
}
```
>**Note**  
> We need to define the UI state variable within `struct`, and to update it in `callback` functions.  

>**Start fullfilling the callback function with some basic `console.info()` about the operation, then add the more concrete logic afterwords.**


- For most of other logic like `flashlight api calls` create another folder under `src/main/ets` maybe name it as `Api`

- Using `import and export` to pass the logic function between UI.

```typescript
// ets/Api

// Get camera manager instance
export default function getCameraManager(context: common.BaseContext): camera.CameraManager | undefined {
  let cameraManager: camera.CameraManager | undefined = undefined;
  try {
    cameraManager = camera.getCameraManager(context);
  } catch (error) {
    let err = error as BusinessError;
    console.error(`The getCameraManager call failed. error code: ${err.code}`);
  }
  return cameraManager;
}
```

```typescript
//Your UI page
import getCameraManager from './Api'

@Entry
@Component
struct index{
      private cameraManager: camera.CameraManager = getCameraManager(getContext(this)) as camera.CameraManager
      build(){
      }
}
```
> **Note**  
> In such case you can call the `GetCameraManager` function from your `Api` folder.

### Check and Testing
- I use console/hilog to check the program works fine or not. Most of the UI part can be tested in `Previewer`
, some functionailities can be tested in `Emulator` like `App Stages, Web component, http interaction`, and some functionailities can be tested only on real development board like `Camera, flashlight` which exists only on real device.

#### Problem 1: Connect OpenHarmony phone shows `no device`
After connecting `OpenHarmony` board, it shows `no device` on Deveco Studio. But in the terminal type `hdc list targets` it shows the connected device series number.

> Solution: Reinstall pervious same Deveco studio version and run the sync again.

#### Problem 2: `"current device not support flashLight"`

#### My suspection: Didn't install PERMISSION
After concrete debugging and checking, it's still the device problem.
So for this application I keep only simple demo with UI functionalities.

**Update information**
> I tested the api with HarmonyOS device and it worked, so I keep these functionailities and attached to the button.

#### After remove api testing page, the real device rendered with blank page


### App Display and Acceptance

CONTENT TO BE ADDED


## Add all necessary files
- Add LICENSE file
We can add the `LICENSE` via [here](https://raw.githubusercontent.com/eclipse-oniro4openharmony/manifest/refs/heads/OpenHarmony-4.1-Release/LICENSE).

### Merge To Applist and Finish

CONTENT TO BE ADDED






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

## Change the HarmonyOS project back to OpenHarmony

#### Background

Then after the testing is done, we want the project run under `OpenHarmony` environment again.

#### Solution

in `build-profile.json` file, uncomment the `OpenHarmony` products configuration, comment the `HarmonyOS` products configuration shown as follows.

```typescript
    // "products": [
    //   {
    //     "name": "default",
    //     "signingConfig": "default",
    //     "compatibleSdkVersion": "4.1.0(11)",
    //     "runtimeOS": "HarmonyOS",
    //     "buildOption": {
    //       "strictMode": {
    //         "caseSensitiveCheck": true,
    //       }
    //     }
    //   }
    // ],
       "products": [
         {
           "name": "default",
           "signingConfig": "default",
           "compileSdkVersion": 11,
           "compatibleSdkVersion": 11,
           "runtimeOS": "OpenHarmony",
         }
       ],
```

Then under the route `hvigor\hvigor-profile.json5`, altering
the version and dependencies back as follows

> Since it's version was too high

```typescript
  "hvigorVersion": "3.2.4",
  "dependencies": {
    "@ohos/hvigor-ohos-plugin": "3.2.4"
  },
```

After that, run the `sync` operation again, the project should be working now.

