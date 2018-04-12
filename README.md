# 简介
Node 本地简单静态服务器

## 如何使用

1. 安装 `node`
2. 建立文件夹 static 用来存放静态资源文件 css\html\js\images
3. 执行命令行 `npm run start`
4. 浏览器输入地址 'localhost:8000/test.html'

## 便捷
除了安装node，无需依赖安装配置其它。


## 进阶-pm2守护进程

当输入的地址404时，进程报错终止，所以使用pm2来守护进程。只需将命令改为如下：
``` shell
npm run pm2-start
```

