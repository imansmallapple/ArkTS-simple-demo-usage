# Difference between board and Previewer

1. [ResourceToString](#resourcetostring)
2. [windowStage](#windowstage)

## ResourceToString
调用资源管理器只能在实机上预览到

下面例子在预览器看不到"search"文本，在实机上可以
```typescript
.searchButton(this.ResourceToString($r('app.string.search')))
```

```typescript
ResourceToString(resource: Resource): string {
    return getContext(this).resourceManager.getStringSync(resource)
  }
```

## windowStage
清理缓存的功能在预览器无法实现(报错)
```typescript
  clearCache() {
    // 从 AppStorage 获取 windowStage 实例
    const filesDir = AppStorage.get<string>("filesDir");

    try {
      promptAction.showDialog({
        title: $r('app.string.confirm_clear_cache'),
        message: $r('app.string.clear_cache_warning'),
        buttons: [
          { text: $r('app.string.cancel'), color: '#000000', },
          { text:$r('app.string.confirm'), color: '#3478f6', }
        ],
      }).then(data => {
        console.info('showDialog success, click button: ' + data.index);

        if (data.index == 1) {
          // 下载路径 /data/storage/el2/base/haps/entry/files
          // let dirPath = globalThis.abilityContext.filesDir;
          let dirPath = filesDir;
          fs.rmdir(dirPath, (err) => {
            if (err) {
              console.info("rmdir failed with error message: " + err.message + ", error code: " + err.code);
              promptAction.showToast({ message: getContext(this).resourceManager.getStringSync($r('app.string.clear_cache_failed'))
                + err.code, duration: ToastDuration });
            } else {
              console.info("rmdir succeed");
              promptAction.showToast({ message: $r('app.string.clear_cache_done'), duration: ToastDuration });
            }
          });
        }
      }).catch((err: BusinessError<void>) => {
        console.info('showDialog error: ' + err);
      })
    } catch (error) {
      console.error(`showDialog args error code is ${error.code}, message is ${error.message}`);
    }
  }
```