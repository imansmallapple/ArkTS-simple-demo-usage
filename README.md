# ArkTS-simple-demo-usage

1. [AlertDialog Window](##alertdialog-window)
2. [Topbar template](##topbar-template)
3. [Logger template](##logger-template)
4. [Topbar template](##topbar-template)
   

## AlertDialog Window
```typescript
        Button('Show alertDialog Window')
          .onClick(() => {
            AlertDialog.show(
              {
                title: 'AlertDialog title',
                message: 'Message to be shown',
                primaryButton: {
                  value: 'Confirm',
                  action: () => {
                    // todo: callback function when first button clicked
                    // router.pushUrl({
                    //   url: this.url,
                    // })
                  }
                },
                secondaryButton: {
                  value: 'Cancel',
                  action: () => {
                    // todo: callback function when second button clicked
                    // console.log('cancel click')
                  }
                },
                cancel: () => {
                  // todo: callback function when window close
                }
              })
          })
```
### Effect:
<div>
        <img src="screenshots/alertDialogWindow.png">
</div>

## Topbar template
```typescript
  build() {
    Row() {
      Row() {
        Row() {
          Image($r('app.media.left'))
            .objectFit(ImageFit.Contain)
            .width('10%')
          Text("back")
            .fontSize(18)
            .textAlign(TextAlign.End)
            .fontColor(Color.White)
        }
        .id('back')
        .layoutWeight(1)


        Text('title')
          .fontSize(18)
          .fontColor(Color.White)
          .textAlign(TextAlign.Start)
          .margin({ right: '5%' })
      }
      .height('8%')
      .width('100%')
      .padding({ left: 15 })
      .backgroundColor('#0D9FFB')
      .constraintSize({ minHeight: 50 })
    }
  }
```
### Used Icons:
[left.png](icons/left.png)
### Effect:
<div>
        <img src="screenshots/topbar_classic_template.png">
</div>

## Logger Template
首先要创建一个文件 `ets/model/Logger.ets`
```typescript
/*
 * Copyright (c) 2022 Huawei Device Co., Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import hilog from '@ohos.hilog'

class Logger {
  private domain: number
  private prefix: string
  private format: string = '%{public}s, %{public}s'

  constructor(prefix: string) {
    this.prefix = prefix
    this.domain = 0xFF00
  }

  debug(...args: any[]) {
    hilog.debug(this.domain, this.prefix, this.format, args)
  }

  info(...args: any[]) {
    hilog.info(this.domain, this.prefix, this.format, args)
  }

  warn(...args: any[]) {
    hilog.warn(this.domain, this.prefix, this.format, args)
  }

  error(...args: any[]) {
    hilog.error(this.domain, this.prefix, this.format, args)
  }
}

export default new Logger('[Sample_AppAccountManager]')
```
#### Usage
在想要使用的地方**import**并创建合适的Tag常数
```typescript
import Logger from '../model/Logger'

const TAG: string = '[NavigationBar]'
```

```typescript
Logger.info(TAG, `Logger Debug information`)
Logger.info(TAG, `Logger info information`)
Logger.info(TAG, `Logger error information`)
Logger.info(TAG, `Logger warning information`)
```
<div>
        <img src="screenshots/logger_usage.png">
</div>
