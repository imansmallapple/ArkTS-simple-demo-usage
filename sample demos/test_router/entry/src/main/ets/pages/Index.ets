import router from '@ohos.router';
interface test{
  name:string
  id:number
  age:number
}
export class TestImpl implements test {
  name: string;
  id: number;
  age: number;

  constructor(name: string, id: number, age: number) {
    this.name = name;
    this.id = id;
    this.age = age;
  }
}

@Entry
@Component
struct Index {
  @State message: string = 'Hello World';
   tes = new TestImpl("John Doe", 2, 25)
  build() {
    Row() {
      Column() {
        Text(this.message)
          .fontSize(50)
          .fontWeight(FontWeight.Bold)
        Button('next')
          .onClick(()=>{
            router.pushUrl({
              url: 'pages/Page2',
              params:{
                obj:this.tes,
                id: this.tes.id,
                name: 'Sample Item',
              }
            })
          })
      }
      .width('100%')
    }
    .height('100%')
  }
}