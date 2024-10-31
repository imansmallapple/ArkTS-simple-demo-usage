# Controllers
本文档基于OpenHarmony5.0版本 但我的测试SDK为API 11 
1. [Swipper](#swipper)
2. [Search](#search)
## Swipper

### 第一步： 需要在组件中声明SwipperController

```typescript
  private swiperController: SwiperController = new SwiperController()
```

### 第二步： 在需要渲染的地方调用并且传入Controller

```typescript
@Entry
@Component
struct Index {
  private swiperController: SwiperController = new SwiperController()

  build() {
    Row() {
      Column() {
        Swiper(this.swiperController) {
          Image($r("app.media.ONIRO_Masterbrand_horizontal")).width('100%').height(150).borderRadius(15)
          Image($r("app.media.ONIRO_Masterbrand_horizontal_black")).width('100%').height(150).borderRadius(15)
          Image($r("app.media.ONIRO_Masterbrand_horizontal_Reversed_color")).width('100%').height(150).borderRadius(15)
        }
        .autoPlay(true)

      }
      .width('100%')
    }
    .height('100%')
  }
}
```

### 属性介绍

| Attributes  | loop     | autoPlay | indicator  | displayArrow   |
|:------------|:---------|:---------|:-----------|:---------------|
| **Usage**   | 循环播放 | 自动轮播 | 导航点样式 | 导航点箭头 |
| **Default** | True     | False    | -          | 不显示         |
| **Type**    | boolean  | boolean  | object     | object         |

### 具体解释
- loop
> 当loop为false时，无法从最后一页跳转或者拖拽到首页
- autoPlay
> 自动轮播时间间隔为3000ms， 可通过`.interval`属性设置
```typescript
.autoPlay(true)
.interval(1000)
```
- indicator
    - 自定义导航点样式
    ```typescript
    Swiper() {
    // ...
    }
    .indicator(
      Indicator.dot()
        .left(0)
        .itemWidth(15)
        .itemHeight(15)
        .selectedItemWidth(30)
        .selectedItemHeight(15)
        .color(Color.Red)
        .selectedColor(Color.Blue)
    )
    ```
    - displayArrow
    ```typescript
    Swiper() {
      // ...
    }
    .displayArrow(true, false)
    ```

    - 自定义箭头样式
控制导航点箭头的大小、位置、颜色，底板的大小及颜色，以及鼠标悬停时是否显示箭头
箭头显示在组件两侧，大小为18vp，导航点箭头颜色设为蓝色。
    ```typescript
    Swiper() {
      // ...
    }
    .displayArrow({ 
      showBackground: true, //箭头遮挡背景图片
      isSidebarMiddle: true, //箭头显示在组件两侧
      backgroundSize: 24,
      backgroundColor: Color.White,
      arrowSize: 18,
      arrowColor: Color.Blue
      }, false)
    ```

  - 页面切换方式： 手指滑动、点击导航点和通过控制器
    - 通过控制器切换页面​​
```typescript
Row({ space: 12 }) {
Button('showNext')
  .onClick(() => {
    this.swiperController.showNext(); // 通过controller切换到后一页
  })
Button('showPrevious')
  .onClick(() => {
    this.swiperController.showPrevious(); // 通过controller切换到前一页
  })
}.margin(5)
```

| Attributes  | vertical | displayCount |
|:------------|:---------|:-------------|
| **Usage**   | 轮播方向 | 每页显示多个子页面 |
| **Default** | False    | -        |
| **Type**    | boolean  | number      |

- 轮播方向和每页显示多子页面
```typescript
Swiper(this.swiperController) {
  ...
}
.vertical(false)
.displayCount(2)
```
### 其他常用属性
| Attributes  | cachedCount      | index        | itemSpace        |
|:------------|:-----------------|:-------------|:-----------------|
| **Usage**   | 预载到缓存的项数 | 当前项的索引 | 滑动项之间的距离 |
| **Default** | -                | 从0开始      | -                |
| **Type**    | number           | number       | -                |

```typescript
Swiper(this.swiperController) {
    ...
}
.cachedCount(3)
.index(0)
.itemSpace(20)
```

### 自定义切换动画
**API 12 专用**
Swiper支持通过**customContentTransition**设置自定义切换动画，可以在回调中对视窗内所有页面逐帧设置透明度、缩放比例、位移、渲染层级等属性实现自定义切换动画

```typescript
@Entry
@Component
struct SwiperCustomAnimationExample {
  private DISPLAY_COUNT: number = 2
  private MIN_SCALE: number = 0.75

  @State backgroundColors: Color[] = [Color.Green, Color.Blue, Color.Yellow, Color.Pink, Color.Gray, Color.Orange]
  @State opacityList: number[] = []
  @State scaleList: number[] = []
  @State translateList: number[] = []
  @State zIndexList: number[] = []

  aboutToAppear(): void {
    for (let i = 0; i < this.backgroundColors.length; i++) {
      this.opacityList.push(1.0)
      this.scaleList.push(1.0)
      this.translateList.push(0.0)
      this.zIndexList.push(0)
    }
  }

  build() {
    Column() {
      Swiper() {
        ForEach(this.backgroundColors, (backgroundColor: Color, index: number) => {
          Text(index.toString()).width('100%').height('100%').fontSize(50).textAlign(TextAlign.Center)
            .backgroundColor(backgroundColor)
            .opacity(this.opacityList[index])
            .scale({ x: this.scaleList[index], y: this.scaleList[index] })
            .translate({ x: this.translateList[index] })
            .zIndex(this.zIndexList[index])
        })
      }
      .height(300)
      .indicator(false)
      .displayCount(this.DISPLAY_COUNT, true)
      .customContentTransition({
        timeout: 1000,
        transition: (proxy: SwiperContentTransitionProxy) => {
          if (proxy.position <= proxy.index % this.DISPLAY_COUNT || proxy.position >= this.DISPLAY_COUNT + proxy.index % this.DISPLAY_COUNT) {
            // 同组页面完全滑出视窗外时，重置属性值
            this.opacityList[proxy.index] = 1.0
            this.scaleList[proxy.index] = 1.0
            this.translateList[proxy.index] = 0.0
            this.zIndexList[proxy.index] = 0
          } else {
            // 同组页面未滑出视窗外时，对同组中左右两个页面，逐帧根据position修改属性值
            if (proxy.index % this.DISPLAY_COUNT === 0) {
              this.opacityList[proxy.index] = 1 - proxy.position / this.DISPLAY_COUNT
              this.scaleList[proxy.index] = this.MIN_SCALE + (1 - this.MIN_SCALE) * (1 - proxy.position / this.DISPLAY_COUNT)
              this.translateList[proxy.index] = - proxy.position * proxy.mainAxisLength + (1 - this.scaleList[proxy.index]) * proxy.mainAxisLength / 2.0
            } else {
              this.opacityList[proxy.index] = 1 - (proxy.position - 1) / this.DISPLAY_COUNT
              this.scaleList[proxy.index] = this.MIN_SCALE + (1 - this.MIN_SCALE) * (1 - (proxy.position - 1) / this.DISPLAY_COUNT)
              this.translateList[proxy.index] = - (proxy.position - 1) * proxy.mainAxisLength - (1 - this.scaleList[proxy.index]) * proxy.mainAxisLength / 2.0
            }
            this.zIndexList[proxy.index] = -1
          }
        }
      })
    }.width('100%')
  }
}
```

## Search 
https://developer.huawei.com/consumer/cn/doc/harmonyos-references-V5/ts-basic-components-search-V5

since API Version 8
### 第一步： 需要在组件中声明SearchController和本地变量
```typescript
  @State changeValue: string = ''
  private controller: SearchController = new SearchController()
```

### 第二步： 需要在组件中调用并传入Controller
```typescript
        Search({ value: this.changeValue, placeholder: (Object)($r('app.string.app_game_search')), controller: this.controller })
          .searchButton(getContext(this).resourceManager.getStringSync($r('app.string.search')))
          .width('100%')
          .height(40)
          .backgroundColor('#F5F5F5')
          .placeholderColor(Color.Grey)
          .placeholderFont({ size: 14, weight: 400 })
          .textFont({ size: 14, weight: 400 })
          .onSubmit((value: string) => {
            promptAction.showToast({ message: $r('app.string.few_apps_no_search'), duration: ToastDuration });
          })
          .onChange((value: string) => {
          })
          .focusable(false)
```

### 接口介绍
 从API version 11开始，该接口支持在元服务中使用。
```typescript
Search(options?: { value?: string, placeholder?: ResourceStr, icon?: string, controller?: SearchController })
```


### 属性介绍

| Attributes  | searchButton | copyOption               | searchIcon       | cancelButton         | focusable |
|:------------|:-------------|:-------------------------|:-----------------|:---------------------|:----------|
| **Usage**   | 搜索按钮     | 文本在搜索框中的对齐方式 | 左侧搜索图标样式 | 设置右侧清除按钮样式 | 光标聚焦  |
| **Default** | -         | -                        | -                | -     | True      |
| **Type**    | string, Object      | enum                     | enum             | enum                 | boolean   |

### 具体解释
- searchButton(value: string, option?: SearchButtonOptions)
> API 11+
> 设置搜索框末尾搜索按钮
> 点击搜索按钮，同时触发onSubmit与onClick回调。
> option参数： 配置搜索框文本样式
```typescript
  .searchButton('Search',
    {
      fontSize: '16fp',
      fontColor: '#ff3f97e9'
    })
```
**注意： 在项目中通过资源管理器获取字符串来支持国际化**
```typescript
  .searchButton(getContext(this).resourceManager.getStringSync($r('app.string.search')))
```


- textAlign(value: TextAlign)
> API 11+
文本在搜索框中的对齐方式, 有Start, Center和End
```typescript
  .textAlign(TextAlign.Start)
```

- copyOption(value: CopyOptions)
> API 9+
> 设置CopyOptions.None时，当前Search中的文字无法被复制或剪切，仅支持粘贴  

| CopyOptions | None       | InApp          | LocalDevice    | CROSS_DEVICE   |
|:------------|:-----------|:---------------|:---------------|:---------------|
| **API**     | 11         | 11             | 11             | 11， 12中被废弃 |
| **Default** | 不支持复制 | 支持应用内复制 | 支持设备内复制 | 支持跨设备复制 |


```typescript
  .copyOption(CopyOptions.None)
```
- searchIcon(value: IconOptions | SymbolGlyphModifier)
> API 10+

```typescript
  .searchIcon({
    size: '16vp',
    color: '#99000000',
    src: ' '
  })
```

- cancelButton(value: CancelButtonOptions | CancelButtonSymbolOptions)
> API 10+
> 设置右侧清除按钮样式 

| CancelButtonStyle | CONSTANT         | INVISIBLE        | INPUT            |
|:------------------|:-----------------|:-----------------|:-----------------|
| **Default**       | 清除按钮常显样式 | 清除按钮常隐样式 | 清除按钮输入样式 |

```typescript
  .cancelButton({
    style: CancelButtonStyle.CONSTANT,
    icon: {
      size: 20,
      color: Color.Red,
      src: $r('app.media.mock_element')
    }
  })
```

