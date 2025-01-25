---
title: Snippets Code
pubDate: 2025-01-25 14:30:11
categories: ["snippets"]
description: ''
---
  
## Docker 

### Mysql

```bash
docker search mysql # 查看是否存在 mysql image

docker pull mysql # 拉取 mysql docker image

# 运行 mysql 镜像并对外暴露 3306 端口
docker run -d --name=mysql -p 3306:3306 -v mysql-data:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=your_password mysql
```
