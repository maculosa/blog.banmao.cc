---
title: "npm run dev 启动报错：TypeError: Cannot read property 'upgrade' of undefined"
pubDate: 2024-04-15 15:30:00
categories:
  - 技术
  - 前端
tags:
  - vue2
  - npm run serve
---

Vue 项目增加本地代理后，启动项目时遇到了错误。具体错误信息为 `TypeError: Cannot read property 'upgrade' of undefined`。这个错误通常是由于代理地址配置为空导致的。


## 解决方法：
1. 检查 `vue.config.js` 文件中的 `devServer` 配置，确保 `proxy` 属性中的 `target` 值不为空。如果没有填写，需要填入正确的代理目标地址。

## 配置示例：
```javascript
module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: process.env.VUE_APP_BASE_API,
        changeOrigin: true,
        pathRewrite: {
          '^/api': 'api'
        }
      },
      '/check': {
        target: process.env.VUE_APP_BASE_API,
        changeOrigin: true,
        pathRewrite: {
          '^/check': 'check'
        }
      }
    }
  }
}
```

2. 检查 `.env.development`（开发环境）和 `.env.production`（生产环境）文件，确保 `VUE_APP_BASE_API` 环境变量的值与代理路径保持一致。

环境解释：
- 开发环境：用于开发的服务器，配置灵活，通常开启全部错误报告以便调试。
- 测试环境：克隆生产环境配置，用于测试程序是否正常工作，确保不会将有问题的程序发布到生产环境。
- 生产环境：对外提供服务的正式环境，通常关闭错误报告，开启错误日志。

系统开发的三个阶段为：开发 -> 测试 -> 上线。其中生产环境是实际运行的环境。

注意事项：
- 无论是开发环境还是生产环境，代理路径需要统一。
- `VUE_APP_BASE_API` 路径需要与代理路径保持一致，避免拼写错误。

操作后，再次启动项目应该可以解决问题。如果问题依旧存在，需要检查是否有其他配置错误或者依赖问题。
