# pure-norm

一个自动生成 [pure-admin](https://github.com/pure-admin/vue-pure-admin) 规范的工具

## 🦄 功能

- eslint + prettier校验
- 提交代码前自动格式化
- commit提交规范校验

## 📦 安装

> 在使用前确保你的项目已经使用了 `git`，否则 `husky` 会失效。
> 未使用 `git`，可使用 `git init` 初始化你的项目

```bash
# npm
npm install pure-norm -D
# pnpm
pnpm install/add pure-norm -D
# yarn
yarn add pure-norm -D
```

## 🚗 用法

在 **package.json** 中添加

```json
"scripts": {
  "pure-norm": "pure-norm"
}
```

```bash
# npm
npm run pure-norm
# pnpm
pnpm run pure-norm
# yarn
yarn run pure-norm
```

## ⚠️ 注意

- 只适用于 **vue3** + **ts** 项目
