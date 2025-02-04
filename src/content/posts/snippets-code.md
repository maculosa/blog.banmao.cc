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

### Postgres

如何使用 Docker 运行 Postgres 数据库。

首先，拉取 PostgreSQL 官方镜像：

```bash
docker pull postgres:latest
```

运行 PostgreSQL 容器：

```bash
docker run --name portal-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=your_password \
  -e POSTGRES_DB=portal \
  -p 5432:5432 \
  -v postgres_data:/var/lib/postgresql/data \
  -d postgres:latest

```

参数说明：
- `--name`：容器名称
- `-e POSTGRES_USER`：数据库用户名
- `-e POSTGRES_PASSWORD`：数据库密码
- `-e POSTGRES_DB`：数据库名称
- `-p`： 端口映射，宿主机端口:容器端口
- `-v`： 挂载数据卷，持久化数据，宿主机路径:容器路径
- `-d`： 后台运行

检查容器是否正常运行：

```bash
docker ps
```

如果需要进入容器执行 SQL:

```bash
docker exec -it portal-postgres psql -U postgres
```

如果想要停止容器：

```bash
docker stop portal-postgres
```

如果想要启动已停止的容器：

```bash
docker start portal-postgres
```

为了方便管理，建议使用 Docker Compose。创建 docker-compose.yml 文件，并添加以下内容：
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:latest
    container_name: portal-postgres
    environment:
        POSTGRES_USER: postgres
        POSTGRES_PASSWORD: your_password
        POSTGRES_DB: portal
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
    postgres_data:

```

使用 Docker Compose 运行 PostgreSQL 容器：

```bash
# 启动服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```
