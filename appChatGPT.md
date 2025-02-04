#### Table of Content

[Api with Header and auth](#api-with-header-and-auth)  
[Api Post method](#api-post-method)  
[Strong console output with JSON format](#strong-console-output-with-json-format)  
[Keyboard hiding input](#keyboard-hiding-input)  
[Input image resource from user](#input-image-resource-from-user)  
#### Api with Header and Auth
Some application's api requires authenication, thus the api request format is a bit different than before.

We need do the following work which is different from pervious applications:
```typescript
// 定义请求头
class Headers {
  Authorization: string;

  constructor(authToken: string) {
    this.Authorization = `Bearer ${authToken}`;
  }
}
```
Add Header part when we make the `httpRequest`
```typescript
httpRequest.request(getModel,
    {
    method: http.RequestMethod.GET, // 请求方法
    header: new Headers("sk-wJc5pQkW0ZKz9gP1ITTSAxxNoH27Ri50lA4IaRFqL69KxOZs"), // 请求头
    expectDataType: http.HttpDataType.STRING, // 返回数据类型
    readTimeout: 30000, // 读取超时时间
    connectTimeout: 30000, // 连接超时时间
    },
    (err: BusinessError, data: http.HttpResponse) => {}
 )
```

#### API Post method
In perviously apps, we always use `Get` method, for `ChatGPT` app we are required to post some queries and get its feedback.


#### Strong console output with JSON format
Sometimes we want print Json format data but when we tried to print some detailed params, the console output will occur problem, so there is a way to print the data with JSON format

```typescript
// Replace `reply` with the data your want output
console.log('Chat Response:', JSON.stringify(reply, null, 2));
```

#### Keyboard hiding input
```typescript
// EntryAbility.ets
import { KeyboardAvoidMode } from '@ohos.arkui.UIContext';

  onWindowStageCreate(windowStage: window.WindowStage) {
    // Main window is created, set main page for this ability
    hilog.info(0x0000, 'testTag', '%{public}s', 'Ability onWindowStageCreate');

    windowStage.loadContent('pages/Index', (err, data) => {
      let keyboardAvoidMode  = windowStage.getMainWindowSync().getUIContext().getKeyboardAvoidMode();
     // 设置虚拟键盘抬起时压缩页面大小为减去键盘的高度
  windowStage.getMainWindowSync().getUIContext().setKeyboardAvoidMode(KeyboardAvoidMode.RESIZE);
      if (err.code) {
        hilog.error(0x0000, 'testTag', 'Failed to load the content. Cause: %{public}s', JSON.stringify(err) ?? '');
        return;
      }
      hilog.info(0x0000, 'testTag', 'Succeeded in loading the content. Data: %{public}s', JSON.stringify(data) ?? '');
    });
  }

// xxx.ets
// 注意如果键盘弹出的时候输入框想要结合别的组件上弹 需要放在父容器中且父容器的高度不能用百分比
@Entry
@Component
struct KeyboardAvoidExample {
    build() {
    Column() {
      Row().height("30%").width("100%").backgroundColor(Color.Gray)
      TextArea().width("100%").borderWidth(1)
      Text("I can see the bottom of the page").width("100%").textAlign(TextAlign.Center).backgroundColor(Color.Pink).layoutWeight(1)
    }.width('100%').height("100%")
  }
}
```

#### Input image resource from user
