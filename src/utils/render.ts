import fs from "fs-extra";
import pc from "picocolors";
import path from "node:path";
import { getEnv } from "./env";
import Spinnies from "spinnies";
import { getpath } from "./path";
import deepMerge from "./deepMerge";
import { exec } from "node:child_process";
import sortDependencies from "./sortDependencies";
import { debugError, debugInfo } from "./debug";

export default function render() {
  const noStylelint = getEnv("noStylelint");
  const coreDep = {
    devDependencies: {
      husky: "^8.0.3",
      eslint: "^8.50.0",
      prettier: "^3.0.3",
      "lint-staged": "^14.0.1",
      "@commitlint/cli": "^17.7.2",
      "@commitlint/config-conventional": "^17.7.0",
      "vue-eslint-parser": "^9.3.1",
      "eslint-plugin-vue": "^9.17.0",
      "eslint-plugin-prettier": "^5.0.0",
      "@typescript-eslint/eslint-plugin": "^6.7.4",
      "@typescript-eslint/parser": "^6.7.4",
      "@vue/eslint-config-prettier": "^8.0.0",
      "@vue/eslint-config-typescript": "^12.0.0"
    }
  };
  const stylelintDep = {
    devDependencies: {
      stylelint: "^15.10.3",
      "stylelint-config-html": "^1.1.0",
      "stylelint-config-recess-order": "^4.3.0",
      "stylelint-config-recommended": "^13.0.0",
      "stylelint-config-recommended-scss": "^13.0.0",
      "stylelint-config-recommended-vue": "^1.5.0",
      "stylelint-config-standard": "^34.0.0",
      "stylelint-config-standard-scss": "^11.0.0",
      "stylelint-order": "^6.0.3",
      "stylelint-prettier": "^4.0.2",
      "stylelint-scss": "^5.2.1"
    }
  };
  const needsDep = noStylelint ? coreDep : deepMerge(coreDep, stylelintDep);

  const scripts: Record<string, string> = {
    "lint:eslint":
      'eslint --cache --max-warnings 0  "{src,mock,build}/**/*.{vue,js,ts,tsx}" --fix',
    "lint:prettier":
      'prettier --write  "src/**/*.{js,ts,json,tsx,css,scss,vue,html,md}"',
    "lint:stylelint":
      'stylelint --cache --fix "**/*.{html,vue,css,scss}" --cache --cache-location node_modules/.cache/stylelint/',
    lint: "pnpm lint:eslint && pnpm lint:prettier && pnpm lint:stylelint",
    prepare: "husky install"
  };

  const packageJsonPath = getpath("package.json");
  const existingPkg = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

  const updatedPkg = sortDependencies(
    deepMerge(deepMerge(existingPkg, needsDep), { scripts })
  );

  // 合并package.json
  fs.writeFileSync(
    packageJsonPath,
    JSON.stringify(updatedPkg, null, 2) + "\n",
    "utf-8"
  );

  // 给.gitignore文件添加.eslintcache，忽略eslint缓存文件
  const gitignore = getpath(".gitignore");
  fs.appendFileSync(gitignore, ".eslintcache");

  // 复制相关规则文件
  fs.copySync(
    path.resolve(__dirname, "template"),
    getpath(getEnv("cwd") as string)
  );

  // 根据noStylelint判断是否需要使用stylelint
  !noStylelint &&
    fs.copySync(
      path.resolve(__dirname, "stylelint"),
      getpath(getEnv("cwd") as string)
    );

  // 下载相关依赖
  const spinner = { interval: 80, frames: ["🍇", "🍈", "🍉", "🍋"] };
  const spinnies = new Spinnies({
    color: "blue",
    succeedColor: "green",
    spinner
  });
  spinnies.add("spinner", {
    text: `正在下载 ${pc.magenta(`[pure-norm]`)} 相关依赖...`
  });

  const command = `${getEnv("packageManager")} install`;
  exec(command, error => {
    spinnies.stopAll();
    if (error) {
      debugError(`${error}`);
      return;
    }
    Reflect.ownKeys(needsDep.devDependencies).forEach(key => {
      debugInfo(`${key as string} ${needsDep.devDependencies[key]}✅`);
    });
    debugInfo(`success!`);
  });
}
