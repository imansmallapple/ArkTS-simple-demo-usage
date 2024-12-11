## Workout Logbook application


Problem faced during development
1. [Implement the use of DatePicker](#implement-the-use-of-datepicker)



## Implement the use of datePicker

#### Background
For the index page of the program we need to add a calender icon, once user click it, it should pop out a dialog for user to select the date for the exercise.

#### Way of implementation
##### Step 1
Construct the frame of the calender page
```typescript
@CustomDialog
struct CalenderDialog {
  controller: CustomDialogController = new CustomDialogController({
    builder: CalenderDialog()
  })
  build() {
    column(){
        Text("Calender information pop up")
    }
  }
}
```

##### Step 2 
Add controller to the index page and link it to the calender icon  

```typescript
  dateSelectionController: CustomDialogController = new CustomDialogController({
    builder: DateDialog({
      date: new Date(this.date)
    })
  })
  calenderDialogController: CustomDialogController = new CustomDialogController({
    builder: CalenderDialog({})
  })
```

