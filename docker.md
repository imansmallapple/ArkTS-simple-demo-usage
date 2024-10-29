# Deploy project on Docker
#### 本文档教学如何将本地服务器部署到云服务器Docker上

## 第一步： 将远程库的项目克隆到本地
以Oniro应用商城为例
```typescript
git clone https://gitee.com/westinyang/f-oh-data
```
## 第二步： 在项目文件目录下编写Dockerfile文档
<div>
  <img src="docker/docker_1.png">
</div>

```typescript
# Choose an appropriate base image
FROM node:20-alpine

# Set Environment
WORKDIR /app

# Install Dependencies
COPY package*.json ./
COPY . /app

RUN npm install
RUN npm install -g serve

# Expose Ports
EXPOSE 8080

# Set Start Command
CMD ["npm", "start"]

```

## 第三步：在命令行中运行命令创建Docker的Image文件

```typescript
docker build -t f-oh-data .
```

## 第四步： 在服务器上部署容器container
```typescript
docker run -d -p 80:8080 f-oh-data
```

<div>
  <img src="docker/docker_2.png">
</div>

> **Note**: 
> 本地port number 80 如果被占用可以选择其他的port，端口号需要先在本地运行看一下具体在哪儿端口，然后输入相同
> 的端口号

## 运行云端服务器
在本地输入对应的URL即可

<div>
  <img src="docker/docker_3.png">
</div>