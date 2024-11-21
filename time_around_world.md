# Time Around The World
## Introduction

`Time Around The World` shows the time of different timezone cities on `OpenHarmony` device.

This is a documentation lists all the problems or noticeable thing during the app development.
### Table of content
[Functionaility](#functionaility)  
[Convert timestamp into regular time](#convert-timestamp-into-regular-time)
[Delete certain city in time list](#delete-ertain-city-in-time-list)

## Functionaility
- two UI pages: Time Page and City Page

    1. On the main screen displayed the current timezone's time.

    2. User can click the '+' button to select a city and add it to the time page list.

    3. Time also shown in list cities.
    
    4. Click `Edit` button will pop up a `Delete icon`, click this icon will remove the selected city from the list.

## Convert timestamp into regular time
#### Project requirement
We need to implement a function which can convert timestamp of certain timezone into the format of the time.

#### Idea
To make this function, I divided into 2 parts, one part convert the timestamp into date format, the second part into daily time.

#### Code
```typescript
export function timestampToDate(timestamp: number): string {
  const date = new Date(timestamp); // 将时间戳转为 Date 对象

  // 格式化时间
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从 0 开始，需要加 1
  const day = String(date.getDate()).padStart(2, '0');

  // 拼接成需要的格式
  return `${year}-${month}-${day}`;
}

export function timestampToTime(timestamp: number): string {
  const date = new Date(timestamp); // 将时间戳转为 Date 对象

  // 格式化时间
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  // 拼接成需要的格式
  return `${hours}:${minutes}:${seconds}`;
}
```

## Delete certain city in time list

#### Description
When we click `Edit` button, there will be a `delete` button pop up, if we click it, it should remove the city from our city list.

#### Solution

The idea is to use `list.splice` function, when we define the list using `ForEach`, add `index: number` to track each list item's index from the list. So we can delete the item with this index number.

#### Code
```typescript
  List({ scroller: this.scroller }) {
    ForEach(this.cityList, (item: City, index: number) => {
      ListItem() {
        // Row(){
        //   Text(`${item.name}`)
        //   Text(`${item.offset}`)
        // }
        Row() {
          if (this.isEdit == true) {
            Image($r('app.media.app_icon'))
              .height(13)
              .onClick(()=>{
                this.cityList.splice(index, 1);
                // console.log(`item id:${index}`)
              })
          }
          Text(`${item.name}`)
          TextClock({ timeZoneOffset: item.offset, controller: this.controller })
        }
      }
    })
  }
  ```

  