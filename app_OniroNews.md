


#### Partial border radius

```typescript
.borderRadius({ topLeft: 10 , topRight: 10 })
```

### Implementation of RDB

关系型数据库提供以下两个基本功能：
RdbStore: 提供管理关系型数据库方法的接口，包括增，删，查，改等操作
RdbPredicates: 表示关系型数据库的谓词，用来定义护具哭的操作条件

1. Create a folder for database and basic configurations

- Define DbConfig class:
```typescript
import relationalStore from '@ohos.data.relationalStore'
export class DBConfig {

  static readonly STORE_CONFIG: relationalStore.StoreConfig = {
    name: 'database.db',
    securityLevel: relationalStore.SecurityLevel.S1
  }
}
```

