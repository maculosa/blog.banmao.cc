---
  title: 如何使用 fnm
  pubDate: 2024-12-27 11:28:56
  categories: [fnm, Node]
  description: 'Fast Node Manager'
---

# 如何使用 fnm – 快速 Node 版本管理器

如果你已经使用 Node 一段时间，你很可能会发现你的项目——或者你正在工作的项目——是为旧版本的 Node 编写的。这意味着它们不会与最新版本的 Node 如预期那样工作。

在这种情况下，Node 版本管理器可以帮助你节省安装和切换不同 Node 版本之间的宝贵时间。

今天，我将向你介绍 `fnm`（Fast Node Manager），这是一个 Node 版本管理器，用 Rust 编写，以简单和速度为核心。`fnm` 还支持跨平台。

## 目录

- 1 Linux 系统和 `zsh`  shell 的安装
  - 1.1 shell 设置
  - 1.2 如何安装补全脚本
- 2 `fnm` 的常见用法
  - 2.1 如何列出所有远程 Node 版本
  - 2.2 如何安装多个版本的 Node
  - 2.3 如何为 Node 版本设置别名
  - 2.4 如何使用特定版本的 Node
  - 2.5 如何将 Node 版本附加到项目
  - 2.6 如何卸载 Node 版本
- 3 如何移除 `fnm`
- 4 总结

## 1 Linux 系统和 zsh shell 的安装

这里我只介绍如何在 Linux 系统和 `zsh` shell 中安装 `fnm`。查看文档以获取其他平台和shell的安装说明。

首先确保你的系统上安装了 `curl`。然后运行以下命令安装 `fnm`：

```bash
curl -fsSL https://fnm.vercel.app/install | bash -s -- --skip-shell
```

它将在 `$HOME/.fnm/` 目录中安装 `fnm`。

**更新** `fnm` 与 **安装** 它的过程相同，使用上述命令。

### 1.1 Shell 设置

还有一个重要的步骤。只需将以下内容添加到你的 `.zshrc` 文件中：

```
# fnm
export PATH=/home/$USER/.fnm:$PATH
eval "$(fnm env --use-on-cd --version-file-strategy=recursive)"
```

### 1.2 如何安装补全脚本

安装补全脚本是 **可选的**。如果你想知道这一步的作用，这里是它的功能：当你按下 TAB 键时，它会尝试自动补全你输入的与 fnm 相关的部分命令。例如，如果你输入 `fnm ls-` 并按下 TAB 键，它将自动补全为 `fnm ls-remote`。

`fnm` 随其二进制文件附带了不同 shell 的所有补全代码。你需要将该代码粘贴到 `_fnm` 文件中，该文件位于 `FPATH` 环境变量指定的目录中：

```
fnm completions --shell zsh > <a_fpath_dir>/_fnm
```

查看 `echo $FPATH` 的输出以获取所有可能的目录，并用实际目录替换 `<a_fpath_dir>`。建议使用用户本地路径。如果没有这样的路径，你可以在 `.zshrc` 中添加以下行来设置一个：

```
fpath=(/home/$USER/your/favorite/path/here $fpath)
```

## 2 `fnm` 的常见用法

### 2.1 如何列出所有远程 Node 版本

要查看你可以安装的所有不同 Node 版本，请运行：

```
fnm ls-remote
```

它将打印出如下版本：

```
.
.
.
v16.15.0 (Gallium)
v16.15.1 (Gallium)
v17.0.0
v17.0.1
v17.1.0
v17.2.0
v17.3.0
v17.3.1
v17.4.0
v17.5.0
v17.6.0
v17.7.0
v17.7.1
v17.7.2
v17.8.0
v17.9.0
v17.9.1
v18.0.0
v18.1.0
v18.2.0
v18.3.0
```

### 2.2 如何安装多个版本的 Node

让我们安装 Node 版本 `v18.3.0`：

```
fnm install v18.3.0
```

要安装最新的 LTS 版本，你可以使用 `--lts` 选项。因此，运行以下命令也安装它：

```
fnm install --lts
```

`fnm` 还支持部分版本匹配。`fnm` 会根据你的部分输入猜测最新可用的版本。例如，如果你只做：

```
fnm install 17
```

它将安装 Node 版本 `v17.9.1`，这是以 `17` 开头的最新可用版本。所以尝试上面的命令。

让我们通过在终端输入 `node --version` 来检查你的 Node 版本。请注意，默认情况下使用第一个安装的版本。

在了解如何开始使用不同安装的 Node 版本之前，让我们看看如何为版本设置别名，以便你可以轻松地引用它。

### 2.3 如何为 Node 版本设置别名

默认情况下，使用 `fnm` 安装的第一个 Node 版本会接收到 `default` 别名。

为版本设置别名的语法是：

```
fnm alias <version> <name>
```

如果你想设置别名 `default`，有一个快捷方式：

```
fnm default <version>
```

你也可以为一个版本设置多个别名。

移除别名的语法是：

```
fnm unalias <name>
```

### 2.4 如何使用特定版本的 Node

你可以使用 `use` 子命令使用特定版本的 Node：

```
fnm use 16
```

要检查当前使用的 Node 版本，只需运行：

```
fnm current
```

要列出所有使用 `fnm` 安装的 Node 版本，请运行：

```
fnm ls
```

![img](https://www.freecodecamp.org/news/content/images/2022/06/fnm-ls-1.png)

请注意，你可以通过使用 `system` 绕过 `fnm` 使用系统范围内安装的 Node（如果有）：

```
fnm use system
```

### 2.5 如何将 Node 版本附加到项目

你可以在项目的根目录创建一个 `.node-version` 文件，并在其中写入该项目所需的 Node 版本，如下所示，以将 Node 版本附加到它：

```
echo 'v18.3.0' > .node-version
```

`fnm` 尊重此文件。所以如果你在该目录中，你只需使用 `fnm install` 或 `fnm use` 来安装或使用该版本。

`fnm` 也尊重 `.nvmrc` 文件（它与 `.node-version` 文件类似，但来自 `nvm` 领域）。所以如果你之前使用了 `nvm`，你将顺利过渡到 `fnm`。

`fnm` 可以使用这些点文件来检测 Node 版本，甚至在使用 `cd` 时自动开始使用它，这在大多数情况下非常方便，所以我已经在 shell设置中通过添加以下标志到 `fnm env` 命令中启用了它们：

- **`--use-on-cd`**：这个标志告诉 `fnm`，当你 `cd` 进入项目根目录时，它应该自动使用 `.node-version`（或 `.nvmrc`）中指定的 Node 版本。酷，不是吗？
- `**--version-file-strategy=recursive**`：这个标志和它的 `recursive` 值基本上告诉 `fnm`，即使当你在嵌套目录中并使用没有版本的 `use` 或 `install` 子命令时，也要使用 `.node-version`（或 `.nvmrc`）中指定的 Node 版本。它还告诉 `fnm`，当你不在任何这样的项目目录中并使用没有版本的 `use` 子命令时，使用别名为 `default` 的 Node 版本。使用这个标志和 `--use-on-cd` 允许你在深入和退出这样的项目目录时自动使用或安装相关版本的 Node（如上所述）。如果这些功能干扰了你的工作流程，你可以随时在你的 shell 设置中移除这些标志来关闭它们。

### 2.6 如何卸载 Node 版本

卸载 Node 版本与安装它非常相似。你只需要使用 `uninstall` 子命令而不是 `install` 子命令。就是这样。

## 3 如何移除 `fnm`

移除 `fnm` 就像从你的 `home` 中移除 `.fnm` 目录和移除你在 shell 配置文件中添加的特定配置一样简单。记得也要移除补全脚本。

## 4 总结

以下是我们在本文中讨论的所有命令的总结：

```
# Listing all remote versions
fnm ls-remote

# Listing all installed ones
fnm ls

# Installing
fnm install <version>

# Uninstalling
fnm uninstall <version>

# Installing node of the latest LTS version
fnm install --lts

# Setting an alias
fnm alias <version> <name>

# Shortcut for setting 'default' as an alias
fnm default <version>

# Removing an alias
fnm unalias <name>

# Using a Node of a particular version
fnm use <version>

# Displaying the version of currently used Node
fnm current

```

此外，如果你需要快速帮助，fnm 已内置帮助，你可以随时从终端获取，如下所示：

- `fnm` 帮助命令：`fnm --help`
- 任何子命令的帮助命令：`fnm <subcommand> --help`

本文转载[https://www.freecodecamp.org/news/fnm-fast-node-manager/](https://www.freecodecamp.org/news/fnm-fast-node-manager/)
