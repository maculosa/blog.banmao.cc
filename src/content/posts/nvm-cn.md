---
title: nvm 镜像安装
description: nvm 镜像安装
tags: [nvm, nodejs, tools]
categories: [tools]
lang: zh
pubDate:  '2024-12-03 14:21:44'

---

nvm 用于解决不同版本的 node 共存问题。然而，国内网络环境下，访问 nvm 的官方地址可能会比较慢。
因此，我们可以使用镜像来加速 nvm 的安装和使用。

## 镜像地址仓库

https://gitee.com/RubyMetric/nvm-cn

## 安装

```bash
# 执行
bash -c "$(curl -fsSL https://gitee.com/RubyMetric/nvm-cn/raw/main/install.sh)"

# 安装完成后执行
source ~/.nvm/nvm.sh

# 查到版本信息则表示安装成功
nvm -v
```

## 卸载

```bash
bash -c "$(curl -fsSL https://gitee.com/RubyMetric/nvm-cn/raw/main/uninstall.sh)"
```

## 使用

```bash
nvm ls

# 列出所有可安装版本
nvm ls-remote

# 安装某个版本Node
nvm install lts/fermium
nvm install v12.20.1
nvm install v15.5.1

# 切换Node版本
nvm use system
nvm use 14.15    # 不用全部打出版本号

# 更新nvm
nvm-update
```
