# Ngrok内网穿透工具

#### 使用方法如下
首先要有安装工具 `choco`:  
 https://chocolatey.org/install

第一步： 安装 `ngrok`:
```bash
choco install ngrok
```

如果要检查 `ngrok` 是否安装成功可以直接在terminal上打 ngrok 检查

第二步： 添加 `authtoken`:
注意 本文档是参考如下网站：   
https://dashboard.ngrok.com/get-started/setup/windows

这个authtoken需要你先注册账号然后会自动生成 下面的code只是例子

```bash
ngrok config add-authtoken 2ocfZ9lKuL1CrDZYv16fscBKnI5_rHG7FZoiLWj5cArd1Lci
```

第三步： 部署api
先运行你的本地api 然后获取端口号 替换掉下面的端口号
```bash
ngrok http http://localhost:8080
```

当你运行了上面代码 你的本地端口会被映射到如下地址:
https://dashboard.ngrok.com/endpoints?sortBy=createdAt&orderBy=desc

如果有任何不清楚的地方请联系我