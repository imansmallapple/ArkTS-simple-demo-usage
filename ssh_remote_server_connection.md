# 本文档介绍如何使用ssh命令连接远程服务器

#### 第一步
```typescript
ssh chen@80.158.63.151
```

#### 第二步

```typescript
docker run -d -p 5000:5000 gowokegobroke/oniro-data:latest
```

#### 后续更新
在 **Top Apps Analysis** 项目中，在thinkpad上重新生成了新的SSH key
然后接触服务器通过新的ip：
```ts
ssh chen@10.255.0.195
```

#### Use sudo
```bash
# Enter server as admin
sudo su
```

#### Check Server situation
```bash
# Check server situation
btop
```

#### 服务器之间传文件使用scp
```bash
scp file_path_to_be_sent  name@ip:/path
```

### 根据文件后缀名查找当前文件夹下文件个数
```bash
## 以 .apk 后缀的文件名为例
find . -type f -name "*.apk" | wc -l
```