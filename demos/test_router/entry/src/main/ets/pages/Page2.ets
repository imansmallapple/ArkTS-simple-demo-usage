import router from '@ohos.router';
import {TestImpl} from './Index'
interface RouteParams {
  id: number;
  name: string;
  obj: TestImpl;
}
@Entry
@Component
struct Page2 {
  @State message: string = 'Hello World';
  @State idnum:number = 1
  objec!: TestImpl
  aboutToAppear(): void {
  const params = router.getParams() as RouteParams
    console.info(`${params.obj.name}`)
    this.idnum = params.id
    this.objec = params.obj
  }
//     params = router.getParams() as RouteParams
//     ied:number = this.params.id

  build() {
    Row() {
      Column() {
        Text(this.idnum.toString())
          .fontSize(50)
          .fontWeight(FontWeight.Bold)

        Text(this.objec.age.toString())
      }
      .width('100%')
    }
    .height('100%')
  }
}