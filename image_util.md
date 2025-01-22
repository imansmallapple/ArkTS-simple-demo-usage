When using the App, we often send multimedia files such as pictures or files when chatting in some social software. This docs introduces how to use that in OpenHarmony applications

### Procedure
[Create MediaBean class](#create-mediabean-class)
[Create MediaHelper class](#create-mediahelper-class)

#### Create MediaBean class
create a folder named 'bean' under `src->main->ets`, create a file 'MediaBean.ts' under that folder

```typescript
/**
 * multi-media data attributes
 */
export class MediaBean {
  /**
   * file name
   */
  public fileName: string;
  /**
   * file size
   */
  public fileSize: number;
  /**
   * file type
   */
  public fileType: string;
  /**
   * local storage address
   */
  public localUrl: string;
}
```

#### Create MediaHelper class
```typescript
import common from '@ohos.app.ability.common';
import { MediaBean } from '../bean/MediaBean';
import { Log } from '../utils/Log';
import picker from '@ohos.file.picker';
import wantConstant from '@ohos.ability.wantConstant';
import { StringUtils } from '../utils/StringUtils';
import mediaLibrary from '@ohos.multimedia.mediaLibrary';
import photoAccessHelper from '@ohos.file.photoAccessHelper';
import dataSharePredicates from '@ohos.data.dataSharePredicates';

export class MediaHelper {
  private readonly TAG: string = 'MediaHelper';

  private mContext: common.Context;

  constructor(context: common.Context) {
    this.mContext = context;
  }

 // Select Image

  public selectPicture(): Promise<MediaBean> {

    try {
      let photoSelectOptions = new picker.PhotoSelectOptions();
      photoSelectOptions.MIMEType = picker.PhotoViewMIMETypes.IMAGE_TYPE;
      photoSelectOptions.maxSelectNumber = 1;
      let photoPicker = new picker.PhotoViewPicker();
      return photoPicker.select(photoSelectOptions)
        .then((photoSelectResult) => {
          Log.info(this.TAG, 'PhotoViewPicker.select successfully, PhotoSelectResult uri: ' + JSON.stringify(photoSelectResult));

          if (photoSelectResult && photoSelectResult.photoUris && photoSelectResult.photoUris.length > 0) {
            let filePath = photoSelectResult.photoUris[0];
            Log.info(this.TAG, 'PhotoViewPicker.select successfully, PhotoSelectResult uri: ' + filePath);
            return filePath;
          }

        }).catch((err) => {
          Log.error(this.TAG, 'PhotoViewPicker.select failed with err: ' + err);
          return err;
        }).then(async (filePath) => {
          const mediaBean = await this.buildMediaBean(filePath);
          return mediaBean;
        });
    } catch (err) {
      Log.error(this.TAG, 'PhotoViewPicker failed with err: ' + err);
      return Promise.reject(err);
    }
  }

  // Select file

  public selectFile(): Promise<MediaBean> {
    try {
      let documentSelectOptions = new picker.DocumentSelectOptions();
      let documentPicker = new picker.DocumentViewPicker();
      return documentPicker.select(documentSelectOptions)
        .then((documentSelectResult) => {
          Log.info(this.TAG, 'DocumentViewPicker.select successfully, DocumentSelectResult uri: ' + JSON.stringify(documentSelectResult));

          if (documentSelectResult && documentSelectResult.length > 0) {
            let filePath = documentSelectResult[0];
            Log.info(this.TAG, 'DocumentViewPicker.select successfully, DocumentSelectResult uri: ' + filePath);
            return filePath;
          }

        }).catch((err) => {
          Log.error(this.TAG, 'PhotoViewPicker.select failed with err: ' + err);
          return err;
        }).then(async (filePath) => {

          const mediaBean = await this.buildMediaBean(filePath);
          return mediaBean;

        });
    } catch (err) {
      Log.error(this.TAG, 'PhotoViewPicker failed with err: ' + err);
      return Promise.reject(err);
    }
  }

  // Take photo
  public async takePhoto(context: common.UIAbilityContext): Promise<MediaBean> {


    let want = {
      'uri': '',
      'action': 'ohos.want.action.imageCapture',
      'parameters': {},
    };
    return context.startAbilityForResult(want)
      .then((result) => {
        Log.info(this.TAG, `startAbility call back , ${JSON.stringify(result)}`);
        if (result.resultCode === 0 && result.want && StringUtils.isNotNullOrEmpty(result.want.uri)) {
          //拍照成功
          Log.info(this.TAG, 'takePhoto successfully, takePhotoResult uri: ' + result.want.uri);
          return result.want.uri;
        }
      }).catch((error) => {
        Log.info(this.TAG, `startAbility error , ${JSON.stringify(error)}`);
        return error;
      }).then(async (uri: string) => {
        const mediaBean = await this.buildMediaBean(uri);
        return mediaBean;
      });
  }


   // encapsulate attached entity class
   // @param uri (file path)
  private async buildMediaBean(uri: string): Promise<MediaBean> {

    if (StringUtils.isNullOrEmpty(uri)) {
      return null;
    }

    const mediaBean: MediaBean = new MediaBean();
    mediaBean.localUrl = uri;
    await this.appendFileInfoToMediaBean(mediaBean, uri);
    return mediaBean;
  }


  /**
   * Through Uri find selected file info, and insert into MediaBean
   * @param mediaBean
   * @param uri
   */
  private async appendFileInfoToMediaBean(mediaBean: MediaBean, uri: string) {

    if (StringUtils.isNullOrEmpty(uri)) {
      return;
    }
    let fileList: Array<photoAccessHelper.PhotoAsset> = [];

    const parts: string[] = uri.split('/');
    const id: string = parts.length > 0 ? parts[parts.length - 1] : '-1';

    try {

      let media = photoAccessHelper.getPhotoAccessHelper(this.mContext);
      let predicates: dataSharePredicates.DataSharePredicates = new dataSharePredicates.DataSharePredicates();
      predicates.equalTo('user_display_level', 2);
      let mediaFetchOptions: photoAccessHelper.FetchOptions = {
        fetchColumns: [],
        predicates: predicates
        // selections: mediaLibrary.FileKey.ID + '= ?',
        // selectionArgs: [id],
        // uri: uri
      };

      let fetchFileResult = await media.getAssets(mediaFetchOptions);
      Log.info(this.TAG, `fileList getFileAssetsFromType fetchFileResult.count = ${fetchFileResult.getCount()}`);
      fileList = await fetchFileResult.getAllObjects();
      fetchFileResult.close();
      await media.release();

    } catch (e) {
      Log.error(this.TAG, "query: file data  exception ");
    }

    if (fileList && fileList.length > 0) {

      let fileInfoObj = fileList[0];
      // Log.info(this.TAG, `file id = ${JSON.stringify(fileInfoObj.id)} , uri = ${JSON.stringify(fileInfoObj.uri)}`);
      // Log.info(this.TAG, `file fileList displayName = ${fileInfoObj.displayName} ,size = ${fileInfoObj.size} ,mimeType = ${fileInfoObj.mimeType}`);

      mediaBean.fileName = fileInfoObj.displayName;
      // mediaBean.fileSize = fileInfoObj.size;
      mediaBean.fileType = fileInfoObj.photoType.toString()

    }
  }
}
```

### Index sample page
```typescript
import common from '@ohos.app.ability.common';
import { MediaBean } from '../bean/MediaBean';
import { MediaHelper } from '../helper/MediaHelper';

@Entry
@Component
struct Index {
  @State mediaBean: MediaBean = new MediaBean();
  private mediaHelper: MediaHelper = new MediaHelper(getContext());

  build() {
    Row() {
      Column() {
        Text('选择图片')
          .textAlign(TextAlign.Center)
          .width(200)
          .fontSize(16)
          .padding(10)
          .margin(20)
          .border({ width: 0.5, color: '#ff38f84b', radius: 15 })
          .onClick(() => {
            this.handleClick(MediaOption.Picture)
          })

        Text('选择文件')
          .textAlign(TextAlign.Center)
          .width(200)
          .fontSize(16)
          .padding(10)
          .margin(20)
          .border({ width: 0.5, color: '#ff38f84b', radius: 15 })
          .onClick(() => {
            this.handleClick(MediaOption.File)
          })

        Text('拍照')
          .textAlign(TextAlign.Center)
          .width(200)
          .fontSize(16)
          .padding(10)
          .margin(20)
          .border({ width: 0.5, color: '#ff38f84b', radius: 15 })
          .onClick(() => {
            this.handleClick(MediaOption.TakePhoto)
          })

        Divider()
          .width('100%')
          .height(0.5)
          .color('#ff99f6a2')
          .margin({ top: 20 })
          .padding({ left: 20, right: 20 })

        Text(`文件名称: ${this.mediaBean.fileName ? this.mediaBean.fileName : ''}`)
          .textAlign(TextAlign.Center)
          .width('100%')
          .fontSize(16)
          .margin(10)

        Text(`文件大小: ${this.mediaBean.fileSize ? this.mediaBean.fileSize : ''}`)
          .textAlign(TextAlign.Center)
          .width('100%')
          .fontSize(16)
          .margin(10)

        Text(`文件类型: ${this.mediaBean.fileType ? this.mediaBean.fileType : ''}`)
          .textAlign(TextAlign.Center)
          .width('100%')
          .fontSize(16)
          .margin(10)

        Text(`文件Uri: ${this.mediaBean.localUrl ? this.mediaBean.localUrl : ''}`)
          .textAlign(TextAlign.Center)
          .width('100%')
          .fontSize(16)
          .margin(10)

        Image(this.mediaBean.localUrl)
          .width(300)
          .height(300)
          .backgroundColor(Color.Grey)

      }
      .width('100%')
      .height('100%')
    }
    .height('100%')
  }

  async handleClick(option: MediaOption) {
    let mediaBean: MediaBean;
    switch (option) {
      case MediaOption.Picture:
        mediaBean = await this.mediaHelper.selectPicture();
        break;
      case MediaOption.File:
        mediaBean = await this.mediaHelper.selectFile();
        break;
      case MediaOption.TakePhoto:
        mediaBean = await this.mediaHelper.takePhoto(getContext() as common.UIAbilityContext);
        break;
      default:
        break;
    }

    if (mediaBean) {

      this.mediaBean = mediaBean;

    }

  }
}

enum MediaOption {
  Picture = 0,
  File = 1,
  TakePhoto = 2
}
```

#### Log
```typescript
import hilog from '@ohos.hilog';

export class Log {
    private static readonly DOMAIN = 0x0230;
    private static readonly TAG: string = '[Voice]';
    public static readonly LEVEL_DEBUG = hilog.LogLevel.DEBUG;
    public static readonly LEVEL_INFO = hilog.LogLevel.INFO;
    public static readonly LEVEL_WARN = hilog.LogLevel.WARN;
    public static readonly LEVEL_ERROR = hilog.LogLevel.ERROR;
    public static readonly LEVEL_FATAL = hilog.LogLevel.FATAL;
    public static LOG_LEVEL = Log.LEVEL_DEBUG;

    public static debug(TAG: string, ...arg: Array<string | object>) {
        let message = ''
        arg.forEach(item=>{
            let msg = item
            if (typeof msg !== 'string') {
                msg = JSON.stringify(msg)
            }
            message += msg
        })
        if (this.LOG_LEVEL <= this.LEVEL_DEBUG) {
            hilog.debug(this.DOMAIN, this.TAG, "[" + TAG + "]: " + message);
        }
    }

    public static info(TAG: string, ...arg: Array<any>) {
        let message = ''
        arg.forEach(item=>{
            let msg = item
            if (typeof msg !== 'string') {
                msg = JSON.stringify(msg)
            }
            message += msg
        })
        if (this.LOG_LEVEL <= this.LEVEL_INFO) {
            hilog.info(this.DOMAIN, this.TAG, "[" + TAG + "]: " + message);
        }
    }

    public static warn(TAG: string, message: string | object) {
        if (typeof message !== 'string') {
            message = JSON.stringify(message)
        }
        if (this.LOG_LEVEL <= this.LEVEL_WARN) {
            hilog.warn(this.DOMAIN, this.TAG, "[" + TAG + "]: " + message);
        }
    }

    public static error(TAG: string, ...arg: Array<string | object>) {
        let message = ''
        arg.forEach(item=>{
            let msg = item
            if (typeof msg !== 'string') {
                msg = JSON.stringify(msg)
            }
            message += msg
        })
        if (this.LOG_LEVEL <= this.LEVEL_ERROR) {
            hilog.error(this.DOMAIN, this.TAG, "[" + TAG + "]: " + message);
        }
    }

    public static fatal(TAG: string, message: string | object) {
        if (typeof message !== 'string') {
            message = JSON.stringify(message)
        }
        if (this.LOG_LEVEL <= this.LEVEL_FATAL) {
            hilog.info(this.DOMAIN, this.TAG, "[" + TAG + "]: " + message);
        }
    }
}
```

#### StringUtils
```typescript
/**
 * String Utilities for ArkTS
 */
export class StringUtils {
  /**
   * Checks if the provided string is null, undefined, or an empty string.
   *
   * @param str - The string to check
   * @returns True if the string is null, undefined, or empty; otherwise, false
   */
  static isNullOrEmpty(str: string | undefined | null): boolean {
    return !str || str.trim().length === 0;
  }

  /**
   * Checks if the provided string is not null, undefined, or empty.
   *
   * @param str - The string to check
   * @returns True if the string is not null, undefined, or empty; otherwise, false
   */
  static isNotNullOrEmpty(str: string | undefined | null): boolean {
    return !!str && str.trim().length > 0;
  }
}
```