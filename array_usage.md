** Filter
filter()方法用于把Array中的某些元素过滤掉，然后返回符合条件的元素。示例代码供参考：
```typescript
export interface DragTableInfo {
  st1: string
  st2: string
  success:boolean
}

@Entry
@Component
export struct DragTableTest {
  @State datas: Array<DragTableInfo> = [{ st1: "测试1", st2: '测试2',success:true }, { st1: "测试3", st2: '测试4' ,success:true}, { st1: "测试5", st2: '测试6' ,success:false}]
  @State nums: Array<number> = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

  build() {
    Column() {
      ForEach(this.datas.filter((data)=>{
        return data.success == true
      }),(item:DragTableInfo) =>{
        Text(item.st1).width('100%').height(50).textAlign(TextAlign.Center).fontSize(18).fontColor(Color.Red)
      })
      Divider()
      ForEach(this.nums.filter((item)=>{
        return item % 2 === 0
      }),(item:Array<number>) =>{
        Text(item.toString()).width('100%').height(50).textAlign(TextAlign.Center).fontSize(18).fontColor(Color.Orange)
      })
    }.width('100%').height('100%')
  }
}
```