This docs help user to custize app style according to their preference
```typescript
  onWindowStageCreate(windowStage: window.WindowStage): void {
    //获取Preferences实例。
    let options: preferences.Options = {
      name: 'myStore'
    };
    dataPreferences = preferences.getPreferencesSync(this.context, options);

    if (dataPreferences.hasSync('startup')) {
      console.info("The key 'startup' is contained.");
    } else {
      console.info("The key 'startup' does not contain.");
      // 此处以此键值对不存在时写入数据为例
      dataPreferences.putSync('startup', 'auto');
      // 当字符串有特殊字符时，需要将字符串转为Uint8Array类型再存储，长度均不超过16 * 1024 * 1024个字节。
      let uInt8Array1 = new util.TextEncoder().encodeInto("~！@#￥%……&*（）——+？");
      dataPreferences.putSync('uInt8', uInt8Array1);
    }
  }
```

To get `Preference` instance, using the following code inside `aboutToAppear`

```typescript
    let options: preferences.Options = {
        name: 'myStore'
    }
    let dataPreferences = preferences.getPreferencesSync(this.context, options) as preferences.Preferences
```

Define the following code to make `this.context` work
```typescript
  private context: common.UIAbilityContext = getContext(this) as common.UIAbilityContext;
```


我在此项目中封装了 `Storage` 这样所有的用户自定义数据将很方便地操作

```typescript
import preferences from '@ohos.data.preferences';
import common from '@ohos.app.ability.common';
import hilog from '@ohos.hilog';
import { BusinessError } from '@ohos.base';


class Storage {
  private context: common.UIAbilityContext = getContext(this) as common.UIAbilityContext;

  constructor() {
  }

  private async getPreferences() {
    let options: preferences.Options = {
      name: 'myStore'
    }
    let dataPreferences = preferences.getPreferencesSync(this.context, options) as preferences.Preferences
    return dataPreferences
  }

  private async checkPreference(key: string) {
    if ((await this.getPreferences()).hasSync(key)) {
      hilog.info(0x00, 'checkPreferenceResult', `The key ${key} is contained.`)
      return true
    } else {
      hilog.info(0x00, 'checkPreferenceResult', `The key ${key} does not contain.`)
      return false
    }
  }

  public async getValue(key: string) {
    if (await this.checkPreference(key)) {
      let value = (await this.getPreferences()).getSync(key, 'default')
      hilog.info(0x00, 'checkPreferenceResult', `The key ${key} value is ` + value);

      // todo: Need Implement 当获取的值为带有特殊字符的字符串时，需要将获取到的Uint8Array转换为字符串
      // let uInt8Array2: preferences.ValueType = dataPreferences.getSync('uInt8', new Uint8Array(0));
      // let textDecoder = util.TextDecoder.create('utf-8');
      // val = textDecoder.decodeWithStream(uInt8Array2 as Uint8Array);
      // hilog.info(0x00, 'contextTest7', "The 'uInt8' value is " + val);

      return value as string
    } else {
      hilog.info(0x00, 'checkPreferenceResult', `The key ${key} does not contain.`)
      return null
    }
  }

  public async putValue(key: string, value: string) {
    //Put data
    (await this.getPreferences()).put(key, value, (err: BusinessError) => {
      if (err) {
        hilog.error(0x00, 'checkValueResult', `Failed to put value of ${key}. code =` + err.code + ", message =" + err.message)
        return
      }
      hilog.info(0x00, 'checkValueResult', `Succeeded in putting value of ${key}.`)
    })
  }

  public async getAllPair() {
    //getAll
    (await this.getPreferences()).getAll((err: BusinessError, value: Object) => {
      if (err) {
        console.error("Failed to get all key-values. code =" + err.code + ", message =" + err.message)
        return
      }
      let allKeys = this.getObjKeys(value)
      console.info("getAll keys = " + allKeys)
      console.info("getAll object = " + JSON.stringify(value))
    })
  }

  public async flushAllData() {
    (await this.getPreferences()).flush((err: BusinessError) => {
      if (err) {
        hilog.error(0x00, 'checkFlushResult', "Failed to flush. code =" + err.code + ", message =" + err.message);
        return;
      }
      hilog.info(0x00, 'checkFlushResult', "Succeeded in flushing.");
    })
  }

  private getObjKeys(obj: Object): string[] {
    let keys = Object.keys(obj)
    return keys
  }
}

export default Storage
```

简单例子更改应用的默认背景颜色如下
```typescript
import Storage from '../utils/localStorage'
import hilog from '@ohos.hilog';


// 应当获取应用首选项进行个性化设置
@Entry
@Component
struct Index {
  @State message: string = 'Hello World';
  // Get context
  private localStorage = new Storage()
  @State bgColor: string = '#ffffffff'

  async aboutToAppear(): Promise<void> {
    this.bgColor = (await this.localStorage.getValue('bgColor')) as string
    hilog.info(0x00, 'bgColor', `${this.bgColor}`)
  }

  build() {
    Row() {
      Column({space: 50}) {
        Text('Black')
          .fontSize(30)
          .onClick(() => {
            this.bgColor = '#ff000000'
            this.localStorage.putValue('bgColor', this.bgColor)
            this.localStorage.flushAllData()
          })
        Text('Pink')
          .fontSize(30)
          .onClick(() => {
            this.bgColor = '#fff18888'
            this.localStorage.putValue('bgColor', this.bgColor)
            this.localStorage.flushAllData()
          })
      }
      .width('100%')
    }
    .height('100%')
    .backgroundColor(this.bgColor)
  }
}
```

```typescript

```