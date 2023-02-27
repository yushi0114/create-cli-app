# 介绍

typescript 脚手架，用来快速生成适用于团队业务的vue或nodejs基础项目

# 使用
1.获取脚手架代码

```shell
git clone http://10.0.30.40:9191/zhangyushi/create-sjc-cli-app.git
```

2.安装依赖并build

```shell
npm install && npm run build
```

3.添加全局软连接(初次使用执行该命令即可，可全局使用sjc-cli-app命令，卸载时执行`npm unlink sjc-cli-app`即可)

```shell
npm link
```

4.创建项目(可选择创建不用模板的项目)

```shell
sjc-cli-app create projectName
```

# 扩展

脚手架内置了不错的扩展性，不论是为已有的 create 命令增加新的功能，还是新增一个命令，或者新增新的模板都很简单，方便根据自身需要进行二次开发

## 增加新的命令

从 /src/index.ts 开始，仿照 create 命令方式即可

## 给 create 命令增加新的功能

在 /src/utils/create.ts 中的 selectFeature 方法中新增一条 choice，然后在 /src/utils/installFeature.ts 中新增对应的安装方法即可

## 添加新的模板或更改模板地址

修改 /src/constant.ts 中的 gitLabConfig 配置即可

# 能力

通过该脚手架创建的项目具有以下能力

### typescript

如飘柔般丝滑的开发体验

### 本地开发服务器

执行以下命令即可启动一个本地开发服务器，支持实时编译

```shell
npm run dev
```

### 构建

执行以下命令完成构建，因为脚手架主要用于开发一些简单的 typescript 项目，所以就没有集成第三方的构建工具，直接用 typescript 自己的构建能力即可，简单易用，没有学习成本

```shell
npm run build
```

### 代码质量

ESLint + prettier 配合 husky 和 lint-staged，在代码提交时自动校验和修复代码格式

### 规范的 git 提交信息

使用 commitzen 来规范 git 提交信息，可以直接执行 `git commit -m "msg"` 提交，会提示提交信息有误，弹出一个链接，点开会告诉你有效的提交格式，或者执行 `npm run commit` 命令会弹出一个交互式的命令行，引导你填充提交信息
