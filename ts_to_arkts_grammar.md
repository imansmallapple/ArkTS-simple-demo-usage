## This documentation lists all incompatible issues about TS migration grammar to ArkTS

[不支持使用正则字面量](#不支持使用正则字面量)

#### 不支持使用正则字面量

`规则`：arkts-no-regexp-literals

`级别`：错误

当前ArkTS不支持正则字面量。请使用RegExp()创建正则对象。

TypeScript  
```typescript
let regex: RegExp = /bc*d/
```

ArkTS  
```typescript
let regex: RegExp = new RegExp("/bc*d/")
```