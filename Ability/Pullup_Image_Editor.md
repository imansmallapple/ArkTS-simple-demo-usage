Use case:
The API required in this case is 12

During development, there are always some operations about applications jumping.

In this case, we will concrete describe about pull up image editor and return the return the edited image back to the orignal application.

![Alt text](../images/Ability/ImageEditor/image_1.png)

## Callee Side (To be pulled up image editor snippets)

#### Image Editor like application
- Create a new directory under ets/, name "PhotoEditorExtensionAbility"  

- Create PhotoEditorAbility.ets

#### Rewrite onCreate, onForeground, onBackground, onDestory and onStartContentEditing in PhotoEditorAbility.ets


Which, we should load entry page file `pages/index.ets`, and save session, uri, instance objects into `LocalStorage` and deliver to the page.

```typescript
import { PhotoEditorExtensionAbility,UIExtensionContentSession,Want } from '@kit.AbilityKit';
import { hilog } from '@kit.PerformanceAnalysisKit';

const TAG = '[ExamplePhotoEditorAbility]';
export default class ExamplePhotoEditorAbility extends PhotoEditorExtensionAbility {
  onCreate() {
    hilog.info(0x0000, TAG, 'onCreate');
  }

  // 获取图片，加载页面并将需要的参数传递给页面
  onStartContentEditing(uri: string, want: Want, session: UIExtensionContentSession): void {
    hilog.info(0x0000, TAG, `onStartContentEditing want: ${JSON.stringify(want)}, uri: ${uri}`);

    const storage: LocalStorage = new LocalStorage({
      "session": session,
      "uri": uri
    } as Record<string, Object>);

    session.loadContent('pages/Index', storage);
  }

  onForeground() {
    hilog.info(0x0000, TAG, 'onForeground');
  }

  onBackground() {
    hilog.info(0x0000, TAG, 'onBackground');
  }

  onDestroy() {
    hilog.info(0x0000, TAG, 'onDestroy');
  }
}
```

#### Implement image editor functionailities in page

**Note :**  
>When image finished with editing call method `saveEditedContentWithImage` to save the result, and return the result back to caller application via `terminateSelfWithResult`

```typescript
import { common } from '@kit.AbilityKit';
import { UIExtensionContentSession, Want } from '@kit.AbilityKit';
import { hilog } from '@kit.PerformanceAnalysisKit';
import { fileIo } from '@kit.CoreFileKit';
import { image } from '@kit.ImageKit';

const storage = LocalStorage.getShared()
const TAG = '[ExamplePhotoEditorAbility]';

@Entry
@Component
struct Index {
  @State message: string = 'editImg';
  @State originalImage: PixelMap | null = null;
  @State editedImage: PixelMap | null = null;
  private newWant ?: Want;

  aboutToAppear(): void {
    let originalImageUri = storage?.get<string>("uri") ?? "";
    hilog.info(0x0000, TAG, `OriginalImageUri: ${originalImageUri}.`);

    this.readImageByUri(originalImageUri).then(imagePixMap => {
      this.originalImage = imagePixMap;
    })
  }

  // 根据uri读取图片内容
  async readImageByUri(uri: string): Promise < PixelMap | null > {
    hilog.info(0x0000, TAG, "uri: " + uri);
    let file: fileIo.File | undefined;
    try {
      file = await fileIo.open(uri, fileIo.OpenMode.READ_ONLY);
      hilog.info(0x0000, TAG, "Original image file id: " + file.fd);

      let imageSourceApi: image.ImageSource = image.createImageSource(file.fd);
      if(!imageSourceApi) {
        hilog.info(0x0000, TAG, "ImageSourceApi failed");
        return null;
      }
      let pixmap: image.PixelMap = await imageSourceApi.createPixelMap();
      if(!pixmap) {
        hilog.info(0x0000, TAG, "createPixelMap failed");
        return null;
      }
      this.originalImage = pixmap;
      return pixmap;
    } catch(e) {
      hilog.info(0x0000, TAG, `ReadImage failed:${e}`);
    } finally {
      fileIo.close(file);
    }
    return null;
  }

  build() {
    Row() {
      Column() {
        Text(this.message)
          .fontSize(50)
          .fontWeight(FontWeight.Bold)

        Button("RotateAndSaveImg").onClick(event => {
          hilog.info(0x0000, TAG, `Start to edit image and save.`);
          // 编辑图片功能实现
          this.originalImage?.rotate(90).then(() => {
            let packOpts: image.PackingOption = { format: "image/jpeg", quality: 98 };
            try {
              // 调用saveEditedContentWithImage保存图片
              (getContext(this) as common.PhotoEditorExtensionContext).saveEditedContentWithImage(this.originalImage as image.PixelMap,
                packOpts).then(data => {
                if (data.resultCode == 0) {
                  hilog.info(0x0000, TAG, `Save succeed.`);
                }
                hilog.info(0x0000, TAG,
                    `saveContentEditingWithImage result: ${JSON.stringify(data)}`);
                this.newWant = data.want;
                // data.want.uri存有编辑过图片的uri
                this.readImageByUri(this.newWant?.uri ?? "").then(imagePixMap => {
                  this.editedImage = imagePixMap;
                })
              })
            } catch (e) {
              hilog.error(0x0000, TAG, `saveContentEditingWithImage failed:${e}`);
              return;
            }
          })
        }).margin({ top: 10 })

        Button("terminateSelfWithResult").onClick((event => {
          hilog.info(0x0000, TAG, `Finish the current editing.`);

          let session = storage.get('session') as UIExtensionContentSession;
          // 关闭并回传修改结果给调用方
          session.terminateSelfWithResult({ resultCode: 0, want: this.newWant });

        })).margin({ top: 10 })

        Image(this.originalImage).width("100%").height(200).margin({ top: 10 }).objectFit(ImageFit.Contain)

        Image(this.editedImage).width("100%").height(200).margin({ top: 10 }).objectFit(ImageFit.Contain)
      }
      .width('100%')
    }
    .height('100%')
    .backgroundColor(Color.Pink)
    .expandSafeArea([SafeAreaType.SYSTEM], [SafeAreaEdge.BOTTOM])
  }
}
```

#### Register `PhotoEditorExtensionAbility` under project corresponding `module.json5` cofiguration file

> `Type` label required to be configured as `photoEditor`, srcEntry required to be configured as path of `PhotoEditorExtensionAbility` component

```typescript
//module.json5
{
  "module": {
    "extensionAbilities": [
      {
        "name": "ExamplePhotoEditorAbility",
        "icon": "$media:icon",
        "description": "ExamplePhotoEditorAbility",
        "type": "photoEditor",
        "exported": true,
        "srcEntry": "./ets/PhotoEditorExtensionAbility/PhotoEditorAbility.ets",
        "label": "$string:EntryAbility_label",
        "extensionProcessMode": "bundle"
      },
    ]
  }
}
```

***Finished callee side of image edit operation***

## Caller Side (Applicaion which pull up image editor)

Developer can pullup `image editing` related applications tablet under `UIAbility` or `UIExtensionAbility` pages.
System will auto find and display the applications which based on `PhotoEditorExtensionAbility` realized image editing applications.  

After user selected application, edited result will be returned to the caller.

#### Import modules

```typescript
import { common, wantConstant } from '@kit.AbilityKit';
import { fileUri, picker } from '@kit.CoreFileKit';
```

#### (Optional) Select images from Gallery

```typescript
async photoPickerGetUri(): Promise < string > {
  try {
    let PhotoSelectOptions = new picker.PhotoSelectOptions();
    PhotoSelectOptions.MIMEType = picker.PhotoViewMIMETypes.IMAGE_TYPE;
    PhotoSelectOptions.maxSelectNumber = 1;
    let photoPicker = new picker.PhotoViewPicker();
    let photoSelectResult: picker.PhotoSelectResult = await photoPicker.select(PhotoSelectOptions);
    return photoSelectResult.photoUris[0];
  } catch(error) {
    let err: BusinessError = error as BusinessError;
    hilog.info(0x0000, TAG, 'PhotoViewPicker failed with err: ' + JSON.stringify(err));
  }
  return "";
}
```

#### Copy image into local sandbox path
```typescript
 let context = getContext(this) as common.UIAbilityContext;
 let file: fileIo.File | undefined;
 try {
   file = fileIo.openSync(uri, fileIo.OpenMode.READ_ONLY);
   hilog.info(0x0000, TAG, "file: " + file.fd);

   let timeStamp = Date.now();
   // 将用户图片拷贝到应用沙箱路径
   fileIo.copyFileSync(file.fd, context.filesDir + `/original-${timeStamp}.jpg`);

   this.filePath = context.filesDir + `/original-${timeStamp}.jpg`;
   this.originalImage = fileUri.getUriFromPath(this.filePath);
 } catch (e) {
   hilog.info(0x0000, TAG, `readImage failed:${e}`);
 } finally {
   fileIo.close(file);
 }
```
#### In callback function from `StartAbilityByType`, get edited image uri from `want.uri`

```typescript
  let context = getContext(this) as common.UIAbilityContext;
  let abilityStartCallback: common.AbilityStartCallback = {
    onError: (code, name, message) => {
      const tip: string = `code:` + code + ` name:` + name + ` message:` + message;
      hilog.error(0x0000, TAG, "startAbilityByType:", tip);
    },
    onResult: (result) => {
      // 获取到回调结果中编辑后的图片uri并做对应的处理
      let uri = result.want?.uri ?? "";
      hilog.info(0x0000, TAG, "PhotoEditorCaller result: " + JSON.stringify(result));
      this.readImage(uri).then(imagePixMap => {
        this.editedImage = imagePixMap;
      });
    }
  }
```

#### convert image into image uri, and call image editor under tablet
```typescript
 let uri = fileUri.getUriFromPath(this.filePath);
 context.startAbilityByType("photoEditor", {
   "ability.params.stream": [uri], // 原始图片的uri,只支持传入一个uri
   "ability.want.params.uriPermissionFlag": wantConstant.Flags.FLAG_AUTH_READ_URI_PERMISSION // 至少需要分享读权限给到图片编辑面板
 } as Record<string, Object>, abilityStartCallback, (err) => {
   let tip: string;
   if (err) {
     tip = `Start error: ${JSON.stringify(err)}`;
     hilog.error(0x0000, TAG, `startAbilityByType: fail, err: ${JSON.stringify(err)}`);
   } else {
     tip = `Start success`;
     hilog.info(0x0000, TAG, "startAbilityByType: ", `success`);
   }
 });
```

#### Sample code under pages/Index.ets
```typescript
import { common, wantConstant } from '@kit.AbilityKit';
import { fileUri, picker } from '@kit.CoreFileKit';
import { hilog } from '@kit.PerformanceAnalysisKit';
import { fileIo } from '@kit.CoreFileKit';
import { image } from '@kit.ImageKit';
import { BusinessError } from '@kit.BasicServicesKit';
import { JSON } from '@kit.ArkTS';

const TAG = 'PhotoEditorCaller';

@Entry
@Component
struct Index {
  @State message: string = 'selectImg';
  @State originalImage: ResourceStr = "";
  @State editedImage: PixelMap | null = null;
  private filePath: string = "";

  // 根据uri读取图片内容
  async readImage(uri: string): Promise < PixelMap | null > {
    hilog.info(0x0000, TAG, "image uri: " + uri);
    let file: fileIo.File | undefined;
    try {
      file = await fileIo.open(uri, fileIo.OpenMode.READ_ONLY);
      hilog.info(0x0000, TAG, "file: " + file.fd);

      let imageSourceApi: image.ImageSource = image.createImageSource(file.fd);
      if(!imageSourceApi) {
        hilog.info(0x0000, TAG, "imageSourceApi failed");
        return null;
      }
      let pixmap: image.PixelMap = await imageSourceApi.createPixelMap();
      if(!pixmap) {
        hilog.info(0x0000, TAG, "createPixelMap failed");
        return null;
      }
      this.editedImage = pixmap;
      return pixmap;
    } catch(e) {
      hilog.info(0x0000, TAG, `readImage failed:${e}`);
    } finally {
      fileIo.close(file);
    }
    return null;
  }

  // 图库中选取图片
  async photoPickerGetUri(): Promise < string > {
    try {
      let PhotoSelectOptions = new picker.PhotoSelectOptions();
      PhotoSelectOptions.MIMEType = picker.PhotoViewMIMETypes.IMAGE_TYPE;
      PhotoSelectOptions.maxSelectNumber = 1;
      let photoPicker = new picker.PhotoViewPicker();
      let photoSelectResult: picker.PhotoSelectResult = await photoPicker.select(PhotoSelectOptions);
      hilog.info(0x0000, TAG,
        'PhotoViewPicker.select successfully, PhotoSelectResult uri: ' + JSON.stringify(photoSelectResult));
      return photoSelectResult.photoUris[0];
    } catch(error) {
      let err: BusinessError = error as BusinessError;
      hilog.info(0x0000, TAG, 'PhotoViewPicker failed with err: ' + JSON.stringify(err));
    }
    return "";
  }

  build() {
    Row() {
      Column() {
        Text(this.message)
          .fontSize(50)
          .fontWeight(FontWeight.Bold)

        Button("selectImg").onClick(event => {
          // 图库中选取图片
          this.photoPickerGetUri().then(uri => {
            hilog.info(0x0000, TAG, "uri: " + uri);

            let context = getContext(this) as common.UIAbilityContext;
            let file: fileIo.File | undefined;
            try {
              file = fileIo.openSync(uri, fileIo.OpenMode.READ_ONLY);
              hilog.info(0x0000, TAG, "file: " + file.fd);

              let timeStamp = Date.now();
              // 将用户图片拷贝到应用沙箱路径
              fileIo.copyFileSync(file.fd, context.filesDir + `/original-${timeStamp}.jpg`);

              this.filePath = context.filesDir + `/original-${timeStamp}.jpg`;
              this.originalImage = fileUri.getUriFromPath(this.filePath);
            } catch (e) {
              hilog.info(0x0000, TAG, `readImage failed:${e}`);
            } finally {
              fileIo.close(file);
            }
          })

        }).width('200').margin({ top: 20 })

        Button("editImg").onClick(event => {
          let context = getContext(this) as common.UIAbilityContext;
          let abilityStartCallback: common.AbilityStartCallback = {
            onError: (code, name, message) => {
              const tip: string = `code:` + code + ` name:` + name + ` message:` + message;
              hilog.error(0x0000, TAG, "startAbilityByType:", tip);
            },
            onResult: (result) => {
              // 获取到回调结果中编辑后的图片uri并做对应的处理
              let uri = result.want?.uri ?? "";
              hilog.info(0x0000, TAG, "PhotoEditorCaller result: " + JSON.stringify(result));
              this.readImage(uri).then(imagePixMap => {
                this.editedImage = imagePixMap;
              });
            }
          }
          // 将图片转换为图片uri，并调用startAbilityByType拉起图片编辑应用面板
          let uri = fileUri.getUriFromPath(this.filePath);
          context.startAbilityByType("photoEditor", {
            "ability.params.stream": [uri], // 原始图片的uri,只支持传入一个uri
            "ability.want.params.uriPermissionFlag": wantConstant.Flags.FLAG_AUTH_READ_URI_PERMISSION // 至少需要分享读权限给到图片编辑面板
          } as Record<string, Object>, abilityStartCallback, (err) => {
            let tip: string;
            if (err) {
              tip = `Start error: ${JSON.stringify(err)}`;
              hilog.error(0x0000, TAG, `startAbilityByType: fail, err: ${JSON.stringify(err)}`);
            } else {
              tip = `Start success`;
              hilog.info(0x0000, TAG, "startAbilityByType: ", `success`);
            }
          });

        }).width('200').margin({ top: 20 })

        Image(this.originalImage).width("100%").height(200).margin({ top: 20 }).objectFit(ImageFit.Contain)

        Image(this.editedImage).width("100%").height(200).margin({ top: 20 }).objectFit(ImageFit.Contain)
      }
      .width('100%')
    }
    .height('100%')
    .backgroundColor(Color.Orange)
    .expandSafeArea([SafeAreaType.SYSTEM], [SafeAreaEdge.BOTTOM])
  }
}
```

### Reference material
[Official OpenHarmony Docs](https://docs.openharmony.cn/pages/v5.0/zh-cn/application-dev/application-models/photoEditorExtensionAbility.md)


