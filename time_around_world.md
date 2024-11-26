# Time Around The World

## Introduction

`Time Around The World` shows the time of different timezone cities on `OpenHarmony` device.

This is a documentation lists all the problems or noticeable thing during the app development.

### Table of content

[Functionaility](#functionaility)  
[Convert timestamp into regular time](#convert-timestamp-into-regular-time)  
[Delete certain city in time list](#delete-certain-city-in-time-list)

Problem faced during development

1. [main time rendered with delay](#main-time-rendered-with-delay)

2. [Use list's onSelect method to trigger select event](#use-lists-onselect-method-to-trigger-select-event)

3. [Replace router into navigation](#replace-router-into-navigation)

4. [How to filter required item by input part of the keyword](#how-to-filter-required-item-by-input-part-of-the-keyword)

5. [Replace database with real world time api calls](#replace-database-with-real-world-time-api-calls)

Problems faced after testing

1. [No default timezone setting instruction](#no-default-timezone-setting-instruction)

2. [Lists of Timezones should be sorted by Alphabet](#lists-of-timezones-should-be-sorted-by-alphabet)

3. [Can not add the same city many times](#can-not-add-the-same-city-many-times)

4. [Selected city should be marked](#selected-city-should-be-marked)

5. [Use persistentStorage-to-keep-selected-lists-info](#use-persistentstorage-to-keep-selected-lists-info)

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
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份从 0 开始，需要加 1
  const day = String(date.getDate()).padStart(2, "0");

  // 拼接成需要的格式
  return `${year}-${month}-${day}`;
}

export function timestampToTime(timestamp: number): string {
  const date = new Date(timestamp); // 将时间戳转为 Date 对象

  // 格式化时间
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

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

## main time rendered with delay

#### Problem background

When I add a city to the time list, the main time and date(Current devices' timezone time and date) was rendered with some delay.

#### Related code

```typescript
Column() {
Text(`${this.convertedTime}`)
  .fontSize(25)
  .fontWeight(FontWeight.Bolder)
// TextClock({ timeZoneOffset: , controller: this.controller })

Text(`${this.timeZone}: ${this.convertedDate}`)
  .fontSize(18)
  .fontWeight(FontWeight.Lighter)
}
```

#### Reason Analyze

Since I used self-defined functions `convertedTime` and `convertedData`, so there might be a recalculation during the page changing.

About `date`, my initial idea is to put the date into a variable within `AppStorage` scope, since date update is quite slow.

Also, for the time in time list, I used the component with `Textclock`, which we have to provide timeZone's offset and a controller.

```typescript
TextClock({ timeZoneOffset: item.offset, controller: this.controller });
```

If we want to use `TextClock`, consider how to implement a function which can convert given `TimeZone`(This is simple, since we have an Api function called `GetTimeZone`) into its timeZoneOffset value.

#### Solution

- Put `convertedDate` into a variable using `AppStorage`
- Instead implement a function which convert city's timezone string into it's offset value, just use `map` to find the offset which stored in our datesource.
- Beside, since the `systemDateTime`'s `GetTimeZone` return timezone format is like `Asia/Shanghai`, we need to extract the city name using `split` method, another function was defined as follows.

```typescript
this.currentTimeZoneOffset = (this.getTimezoneOffsetByName(this.timeZone) as number) * -1


  getTimezoneOffsetByName(systemTimeZone: string): number | null {
    // Find the matching city based on the name
    let name = this.extractRegion(systemTimeZone)
    const city = supportedSystemTimezone.find(city => city.name === name);

    // Return the offset if found, or null if not found
    return city ? city.offset : null;
  }

    private extractRegion(timezone: string): string | null {
    if (timezone.includes('/')) {
      return timezone.split('/')[1]; // Return the part before the '/'
    }
    return null; // Return null if the format is invalid
  }
```

## Use list's onSelect(()=>{}) method to trigger select event

## Replace router into navigation

#### Problem description

In order to have a formal way of developement, we need to use `Navigation` rather than `router`.

#### Solution

本例子中有两个页面带有参数传递

Index 页面

```typescript
@Entry
@Component
struct Index {
  pathStack: NavPathStack = new NavPathStack()

  @Builder
  PagesMap(name: string) {
    if (name == 'Index') {
      Index()
    } else if (name == 'ListPage') {
      ListPage()
    }
  }

  build(){
    Navigation(this.pathStack) {
    Button('+')
      .zIndex(1)
      .onClick(() => {
        let tmp!: City
        //We need to define onPop callback function for receiving data
        this.pathStack.pushPathByName('ListPage', tmp, (popInfo) => {
          let city = popInfo.result as City
          this.message = city.name
          this.cityList.push(city)
        }); // Push the navigation destination page specified by name, with the data specified by param, to the navigation stack. Use the onPop callback to receive the page processing result.
      })
    }
    .mode(NavigationMode.Stack)
    .titleMode(NavigationTitleMode.Mini)
    .title('Clock')
    .navDestination(this.PagesMap)
    .hideBackButton(true)
  }
}
```

```typescript
@Entry
@Component
export struct ListPage {
  pathStack: NavPathStack = new NavPathStack()

  build() {
    NavDestination() {
      Scroll() {
        Column() {
          ListItem() {
            Row() {
              Text(item.timezone)
                .margin(10)
                .fontSize(20)

              Text(item.name)
                .margin(10)
                .fontSize(20)

              Text(item.offset.toString())
                .margin(10)
                .fontSize(20)
            }
            .margin(5)
            .width('95%')
            .height('20%')
            .borderRadius(20)
            .backgroundColor('#f6f6f6')
          }
          .onClick(() => {
            this.pathStack.pop(item); // Return to the previous page and pass in the processing result to the onPop callback of push.
          })
        }
        .layoutWeight(1)
      }
    }
    .title('ListPage')
    .onReady((context: NavDestinationContext) => {
      this.pathStack = context.pathStack
    })
  }
}
```

## How to filter required item by input part of the keyword

#### Problem background

After the search bar implementation, we need to filter the search result according to the database.

#### Solution

The idea is using array's filter method, the city have such interface:

```typescript
interface City {
  name: string;
  timezone: string;
  offset: number;
}
```

```typescript
const filteredCity = supportedSystemTimezone.filter((city: City) => {
  return (
    city.name.toLowerCase().includes(value.toLowerCase()) ||
    city.timezone.toLowerCase().includes(value.toLowerCase())
  );
});
```

As a result, we can return the searched result by the city's name or timezone.

## Replace database with real world time api calls

#### Problem background

We need to make more sensible applications, so there should be enough city for user to select rather than fixed a few cities listed in the database.

#### Solution

For the solution I take a reference of F-OH project's idea.

- Found world time api's url: `http://worldtimeapi.org/api/`

## No default timezone setting instruction

## Lists of Timezones should be sorted by Alphabet

#### Reference material

ArkUI（TS）声明式开发：列表字母索引导航:  
https://ost.51cto.com/posts/11020

## Can not add the same city many times

## Selected city should be marked

## Use persistentStorage-to-keep-selected-lists-info

#### Reference material

construct your app with @PersistentStorage:  
https://blog.csdn.net/u013032788/article/details/138561443
