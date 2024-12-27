---
  title: Create a Component Library Fast with Vite
  pubDate: 2024-12-27 16:35:19
  categories: ['vite', 'Component', 'Component Library']
  description: '使用 vite 快速创建组件库'
  draft: true
  ---

如果你正在管理多个 React 应用程序并且希望用户界面保持一致性，迟早你会发现自己需要一套组件库。

当我第一次想要创建一个 React 组件库时，我花费了很多时间寻找一个满足所有要求且不太复杂的设置。

这样的指南本可以节省我大量与这些事物搏斗的精力。我希望它对你有所帮助，就像它曾经对我有帮助一样。

这篇帖子涵盖了设置和发布一个 React 组件库，包括配置你的构建过程并将你的包发布到 npm，以便你或其他人可以使用它。

我已尽力使所有配置简单明了，尽可能使用默认设置。

安装完成后，你可以将你的库像其他 npm 包一样安装：

```bash
npm install @username/my-component-library
```

并且想这样使用：

```ts
import { Button } from '@username/my-component-library'

function MyComponent() {
  return <Button>Click Me</Button>
}
```

## 开始之前

在深入实现细节之前，我想详细说明一些关于库设置的技术细节。

### Fully tree shakeable

对我来说，确保只有必要的代码最终出现在应用程序中尤为重要。当你导入一个组件时，它只包含必要的 JS 和 CSS 样式。很酷，对吧？

### 编译 CSS 模块

组件使用 [CSS 模块](https://github.com/css-modules/css-modules)进行样式化。在构建库时，这些样式将被转换为正常的 CSS 样式表。这意味着消费应用甚至不需要支持 CSS 模块。

作为额外的好处，编译 CSS 模块可以避免[兼容性问题](https://stackoverflow.com/questions/71294870/how-to-publish-a-react-component-with-css-modules-that-can-be-consumed-by-both)，并且该包可以在支持 CSS 模块命名的导入的环境以及不支持的环境中使用。

（在未来，我想将这个教程扩展到使用 [vanilla-extract](https://vanilla-extract.style/)。）

### Typescript

虽然这个库是用 Typescript 编写的，但它也可以在任何“正常”的JavaScript 项目中使用。如果你之前从未是用过 TypeScript，不妨试一试。它不仅迫使你编写更干净的代码，还有助于你的 AI 编码助手提出更好的建议。

那么现在我们就开始吧！

## 创建一个新的 Vite 项目

如果你从未是用过 vite，将其视为 Create React App 的替代品。只需几个命令，你就可以开始是用了。

```bash
npm create vite@latest
? Project name: > my-component-library
? Select a framework: > React
? Select a variant: > TypeScript
cd my-component-library
pnpm install
```

这样，你的新 Vite/React 项目就创建好了。

[这里有两个我推荐您在安装 Vite 后立即执行的事情。](https://dev.to/receter/two-things-i-do-every-time-i-set-up-a-new-node-project-1mg3)

## 基本构建配置

你现在可以运行 `pnpm run dev` 并浏览 Vite 提供的 URL。在你的工作库时，这是一个你可以轻松导入你的库并真正看到你的组件的地方。将 `src` 文件夹内的所有代码视为你的演示页面。

实际库代码将存放在另一个文件夹中。让我们创建这个文件夹，并将其命名为 `lib`。你也可以取不同的名字，但 `lib` 也是一个不错的选择。

你的库的主要入口点将是一个位于 `lib` 中的名为 `main.ts` 的文件。当安装库时，你可以导入这个文件导出的所有内容。

```text
my-component-library
├── lib
│   └── main.ts
├── public
├── src
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.lib.json
├── tsconfig.node.json
└── vite.config.ts
```

## Vite 库模式

在这个时候，如果你使用 `pnpm run build` 构建项目，Vite 会将 `src` 内的代码转译到 `dist` 文件夹。这是 Vite 的默认行为。

目前你只能将演示页面用于开发目的。因此，目前无需编译此项目部分。相反，你希望编译并发布 `lib` 内部的代码。

这是 Vite 的库模式发挥作用的地方。它专门设计用于构建/转换库。要激活此模式，只需在 `vite.config.ts` 中指定您的库入口点即可。

如下：

```diff
import { defineConfig } from 'vite'
+ import { resolve } from 'path'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
+  build: {
+    lib: {
+      entry: resolve(__dirname, 'lib/main.ts'),
+      formats: ['es']
+     }
+  }
})

```

> 默认格式为 'es' 和 'umd'。对于你的组件库 `es` 就足够了。这也消除了添加 `name` 属性的必要性。
>
> 如果你的 TypeScript 代码检查器对 `path` 和 `__dirname` 提出警告，只需安装 node 的类型：`pnpm add @types/node -D`

- Library mode [docs](https://vitejs.dev/guide/build.html#library-mode)
- `lib` mode [docs](https://vitejs.dev/config/build-options.html#build-lib)

## TypeScript 和 库模式

Vite 创建的 `tsconfig.json` 仅包含文件夹 `src`。要为新创建的 `lib` 文件夹启用 TypeScript，你需要将其添加到 TypeScript 配置文件中，如下所示：

```diff
-   "include": ["src"],
+   "include": ["src", "lib"],
```

尽管 TypeScript 需要在 `src` 和 `lib` 文件夹中启用，但在构建库时最好不包括 `src` 文件夹。

为确保在构建过程中仅包含 `lib` 目录，你可以创建一个专门的 TypeScript 配置文件用于构建。

> 实施此独立配置有助于避免在演示页面上直接从 `dist` 文件夹导入组件时出现的 TypeScript 错误，因为这些组件尚未构建。
> 
<!-- > 对于 Vite 5，请阅读我对新的 TypeScript 配置结构的评论。 -->

```text
my-component-library
├── ...
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.lib.json
├── tsconfig.node.json
└── vite.config.ts
```

唯一的不同之处在于，构建配置仅包含 `lib` 文件夹。而默认配置包含 `lib` 和 `src` 文件夹。

`tsconfig.lib.json`
```json
{
  "extends": "./tsconfig.app.json",
  "include": ["lib"]
}
```

要是用 `tsconfig.lib.json` 进行构建，你需要将配置文件传递给你的 package.json 中的构建脚本中的 `tsc`：

```diff
"scripts": {
    …
-   "build": "tsc && vite build",
+   "build": "tsc --p ./tsconfig-build.json && vite build",
```

最后，您还需要将文件 `vite-env.d.ts` 从 `src` 复制到 `lib` 。没有这个文件，在构建时 TypeScript 将缺少 Vite 提供的某些类型定义（因为我们不再包含 `src` ）。

您现在可以再次执行 `npm run build` ，这是您在 `dist` 文件夹中看到的内容：

```txt
 dist
  ┣ my-component-library.js
  ┗ vite.svg
```

> 默认情况下，输出文件的名称与您的 package.json 中的 `name` 属性相同。这可以在 Vite 配置（ `build.lib.fileName` ）中更改，但我们稍后会对此做些其他处理。

文件 vite.svg 位于您的 dist 文件夹中，因为 Vite 会将 public 目录下的所有文件复制到输出文件夹。让我们禁用此行为：

```diff
build: {
+  copyPublicDir: false,
…
}
```

> 您可以在这里阅读更详细的解释：[为什么 dist 文件夹中有 vite.svg 文件？](https://stackoverflow.com/questions/75276160/why-is-the-file-vite-svg-in-the-dist-folder-when-building-with-vite-library)

## 构建类型

由于这是一个 TypeScript 库，你也希望将类型定义与你的包一起分发。幸运的是，有一个 Vite 插件可以做到这一点：`vite-plugin-dts`。

```bash
pnpm add vite-plugin-dts -D
```

默认情况下， `dts` 将为 `src` 和 `lib` 生成类型，因为这两个文件夹都包含在项目的 `.tsconfig` 中。这就是为什么我们需要传递一个配置参数： `include: ['lib']` 。

```diff
// vite.config.ts
+import dts from 'vite-plugin-dts'
…
  plugins: [
    react(),
+   dts({ include: ['lib'] })
  ],
…
```

> 也可以使用 `exclude: ['src']` 或使用不同的 TypeScript 配置文件进行构建。

为了测试一下，让我们在你的库中添加一些实际的代码。打开 `lib/main.ts` 并导出一些内容，例如：

```ts
lib/main.ts
export function helloAnything(thing: string): string {
  return `Hello ${thing}!`
}
```

然后运行 `npm run build` 来转译你的代码。如果你的 dist 文件夹内容如下，你应该已经设置好了 🥳：

```text
dist
  ┣ main.d.ts
  ┗ my-component-library.js
```

## 没有组件的 React 组件库是什么？

我们并不是为了导出一个 helloAnything 函数才做所有这些的。所以让我们给我们的库添加一些内容🍖（或者豆腐🌱，或者两者都有）。

