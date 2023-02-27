/**
 * 实现各个功能的安装方法
 */
import * as shell from 'shelljs';
import { writeFileSync, existsSync } from 'fs';
import { PackageJSON, printMsg, readJsonFile, writeJsonFile } from './common';
import { red } from 'chalk';
import { FEATURE_ENUMS } from '../constant';

/**
 * 安装 ESLint
 */
export function installESLint(feature: Array<string>): void {
  const eslintFilePath = './.eslintrc.js';
  if (existsSync(eslintFilePath)) {
    printMsg(red(`${eslintFilePath} 已经存在`));
  }
  let eslintrc = '';
  if (feature.includes(FEATURE_ENUMS.TypeScript)) {
    shell.exec(
      'npm i eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin -D',
    );
    // 添加 .eslintrc.js
    eslintrc = `module.exports = {
    "env": {
      "es2021": true,
      "node": true
    },
    "extends": [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
      "ecmaVersion": 12,
      "sourceType": "module"
    },
    "plugins": [
      "@typescript-eslint"
    ],
    "rules": {
    }
  };
    `;
  } else {
    const installPrettier = feature.includes(FEATURE_ENUMS.Prettier);

    shell.exec(
      `npm i eslint @babel/core @babel/eslint-parser @vue/cli-plugin-babel @vue/cli-plugin-eslint @vue/cli-service eslint-plugin-vue ${
        installPrettier ? 'eslint-plugin-prettier eslint-config-prettier' : ''
      } -D`,
    );
    // 添加 .eslintrc.js
    eslintrc = `module.exports = {
    "env": {
      "es2021": true,
      "node": true
    },
    "extends": [
      'plugin:vue/essential',
      'eslint:recommended',
      ${installPrettier ? "'plugin:prettier/recommended'" : ''}
    ],
    "parserOptions": {
      "ecmaVersion": 12,
      "sourceType": "module",
      "parser": "@babel/eslint-parser",
    },
    "rules": {
      'no-useless-escape': 'off',
      'no-unsafe-negation': 'off',
      'no-prototype-builtins': 'off',
      'no-unused-vars': 'off',
      'vue/multi-word-component-names': 'off',
    }
  };
    `;
  }
  try {
    writeFileSync(eslintFilePath, eslintrc, { encoding: 'utf-8' });
  } catch (err) {
    printMsg(`${red('Failed to write .eslintrc.js file content')}`);
    printMsg(`${red('Please add the following content in .eslintrc.js')}`);
    printMsg(`${red(eslintrc)}`);
  }

  // 改写 package.json
  const packageJson = readJsonFile<PackageJSON>('./package.json');
  packageJson.scripts['eslint:comment'] =
    '使用 ESLint 检查并自动修复 src 目录下所有文件';
  packageJson.scripts['eslint'] = 'eslint --fix src --max-warnings=0';
  writeJsonFile<PackageJSON>('./package.json', packageJson);
}

/**
 * 安装 Prettier
 */
export function installPrettier(): void {
  const prettierrcFilePath = './.prettierrc.js';
  if (existsSync(prettierrcFilePath)) {
    printMsg(red(`${prettierrcFilePath} 已经存在`));
  }
  shell.exec('npm i prettier -D');
  // 添加 .prettierrc.js
  const prettierrc = `module.exports = {
  // 一行最多 80 字符
  printWidth: 80,
  // 使用 2 个空格缩进
  tabWidth: 2,
  // 不使用 tab 缩进，而使用空格
  useTabs: false,
  // 行尾需要有分号
  semi: true,
  // 使用单引号代替双引号
  singleQuote: true,
  // 对象的 key 仅在必要时用引号
  quoteProps: 'as-needed',
  // jsx 不使用单引号，而使用双引号
  jsxSingleQuote: false,
  // 末尾使用逗号
  trailingComma: 'all',
  // 大括号内的首尾需要空格 { foo: bar }
  bracketSpacing: true,
  // jsx 标签的反尖括号需要换行
  jsxBracketSameLine: false,
  // 箭头函数，只有一个参数的时候，也需要括号
  arrowParens: 'always',
  // 每个文件格式化的范围是文件的全部内容
  rangeStart: 0,
  rangeEnd: Infinity,
  // 不需要写文件开头的 @prettier
  requirePragma: false,
  // 不需要自动在文件开头插入 @prettier
  insertPragma: false,
  // 使用默认的折行标准
  proseWrap: 'preserve',
  // 根据显示样式决定 html 要不要折行
  htmlWhitespaceSensitivity: 'css',
  // 换行符使用 crlf
  endOfLine: 'crlf'
};
  `;
  try {
    writeFileSync(prettierrcFilePath, prettierrc, { encoding: 'utf-8' });
  } catch (err) {
    printMsg(`${red('Failed to write .prettierrc.js file content')}`);
    printMsg(`${red('Please add the following content in .prettierrc.js')}`);
    printMsg(`${red(prettierrc)}`);
  }
  // 改写 package.json
  const packageJson = readJsonFile<PackageJSON>('./package.json');
  packageJson.scripts['prettier:comment'] = '自动格式化 src 目录下的所有文件';
  packageJson.scripts['prettier'] = 'prettier --write src';
  writeJsonFile<PackageJSON>('./package.json', packageJson);
}

/**
 * 安装 CZ，规范 git 提交信息
 */
export function installCZ(): void {
  installReleaseIt();
  shell.exec(
    'npx commitizen init cz-conventional-changelog --save --save-exact',
  );
  shell.exec('npm i @commitlint/cli @commitlint/config-conventional -D');
  // 添加 commitlint.config.js
  const commitlint = `module.exports = {
  extends: ['@commitlint/config-conventional']
};
  `;
  try {
    writeFileSync('./commitlint.config.js', commitlint, { encoding: 'utf-8' });
  } catch (err) {
    printMsg(`${red('Failed to write commitlint.config.js file content')}`);
    printMsg(
      `${red('Please add the following content in commitlint.config.js')}`,
    );
    printMsg(`${red(commitlint)}`);
  }
  // 改写 package.json
  const packageJson = readJsonFile<PackageJSON>('./package.json');
  packageJson.scripts['commit:comment'] = '引导设置规范化的提交信息';
  packageJson.scripts['commit'] = 'git add . && cz';
  packageJson['config'].commitizen.types = {
    feat: {
      description: '一个新功能',
      title: 'Features',
    },
    fix: {
      description: '一个bug',
      title: 'Bug Fixes',
    },
    docs: {
      description: '文档增删改',
      title: 'Documentation',
    },
    style: {
      description: '样式修改(空白、格式、缺少分号等)',
      title: 'Styles',
    },
    refactor: {
      description: '既不修复bug也不添加新功能的更改',
      title: 'Code Refactoring',
    },
    perf: {
      description: '性能优化',
      title: 'Performance Improvements',
    },
    test: {
      description: '增加测试',
      title: 'Tests',
    },
    build: {
      description:
        '影响构建系统或外部依赖项的更改(示例范围:gulp、broccoli、npm)',
      title: 'Builds',
    },
    ci: {
      description:
        '对CI配置文件和脚本的更改(示例范围:Travis, Circle, BrowserStack, SauceLabs)',
      title: 'Continuous Integrations',
    },
    chore: {
      description: '除src目录或测试文件以外的修改',
      title: 'Chores',
    },
    revert: {
      description: '回退历史版本',
      title: 'Reverts',
    },
    conflict: {
      description: '修改冲突',
      title: 'Conflict',
    },
    font: {
      description: '字体文件更新',
      title: 'Fonts',
    },
    delete: {
      description: '删除文件',
      title: 'Delete Files',
    },
    stash: {
      description: '暂存文件',
      title: 'Stash Files',
    },
  };
  writeJsonFile<PackageJSON>('./package.json', packageJson);
}

/**
 * 安装 release-it，自动生成changelog
 */
export function installReleaseIt(): void {
  shell.exec(
    'npm i release-it@14.14.2 @release-it/conventional-changelog@4.3.0 -D',
  );

  const releaseIt = `{
    "npm": {
      "publish": false
    },
    "git": {
      "commitMessage": "chore: release v\${version}"
    },
    "hooks": {
      "after:bump": "echo 更新版本成功"
    },
    "plugins": {
      "@release-it/conventional-changelog": {
        "preset": {
          "name": "conventionalcommits",
          "types": [
            {
              "type": "feat",
              "section": "Features",
              "description": "一个新功能"
            },
            {
              "type": "fix",
              "section": "Bug Fixes",
              "description": "一个bug"
            },
            {
              "type": "docs",
              "section": "Documentation",
              "description": "文档增删改",
              "hidden": true
            },
            {
              "type": "style",
              "section": "Styles",
              "description": "样式修改(空白、格式、缺少分号等)"
            },
            {
              "type": "refactor",
              "section": "Code Refactoring",
              "description": "既不修复bug也不添加新功能的更改"
            },
            {
              "type": "perf",
              "section": "Performance Improvements",
              "description": "性能优化"
            },
            {
              "type": "test",
              "section": "Tests",
              "description": "增加测试",
              "hidden": true
            },
            {
              "type": "build",
              "section": "Builds",
              "description": "影响构建系统或外部依赖项的更改(示例范围:gulp、broccoli、npm)",
              "hidden": true
            },
            {
              "type": "ci",
              "section": "Continuous Integrations",
              "description": "对CI配置文件和脚本的更改(示例范围:Travis, Circle, BrowserStack, SauceLabs)"
            },
            {
              "type": "chore",
              "section": "Chores",
              "description": "除src目录或测试文件以外的修改"
            },
            {
              "type": "revert",
              "section": "Reverts",
              "description": "回退历史版本"
            },
            {
              "type": "conflict",
              "section": "Conflict",
              "description": "修改冲突"
            },
            {
              "type": "font",
              "section": "Fonts",
              "description": "字体文件更新"
            },
            {
              "type": "delete",
              "section": "Delete Files",
              "description": "删除文件"
            },
            {
              "type": "stash",
              "section": "Stash Files",
              "description": "暂存文件"
            }
          ]
        },
        "header": "# Changelog",
        "infile": "CHANGELOG.md"
      }
    }
  }
  `;
  try {
    writeFileSync('./.release-it.json', releaseIt, { encoding: 'utf-8' });
  } catch (err) {
    printMsg(`${red('Failed to write .release-it.json file content')}`);
    printMsg(`${red('Please add the following content in .release-it.json')}`);
    printMsg(`${red(releaseIt)}`);
  }

  // 改写 package.json
  const packageJson = readJsonFile<PackageJSON>('./package.json');
  packageJson.scripts['release:comment'] = '自动生成changelog';
  packageJson.scripts['commit:release'] =
    'npm run commit && release-it --ci --only-version';
  packageJson.scripts['release'] = 'release-it --ci --only-version';
  writeJsonFile<PackageJSON>('./package.json', packageJson);
}

/**
 * 安装 husky 和 lint-staged，以实现 git commit 时自动化校验
 * @param hooks，需要自动执行的钩子
 * @param lintStaged，需要钩子运行的命令
 */
export function installHusky(
  hooks: { [key: string]: string },
  lintStaged: Array<string>,
): void {
  // 初始化 git 仓库
  shell.exec('git init');
  // 在安装 husky 和 lint-staged
  shell.exec('npm i husky lint-staged -D');
  // 设置 package.json
  const packageJson = readJsonFile<PackageJSON>('./package.json');
  packageJson['husky'] = {
    hooks: {
      'pre-commit': 'lint-staged',
      ...hooks,
    },
  };
  const lintScript =
    lintStaged.map((item) => `npm run ${item}`).join(' && ') || '';
  packageJson['lint-staged'] = {
    'src/**/*.{js,ts,vue,less,scss,css}': [
      ...lintStaged.map((item) => `npm run ${item}`),
      'git add .',
    ],
  };
  packageJson.scripts['lint'] = lintScript;
  writeJsonFile<PackageJSON>('./package.json', packageJson);
}

/**
 * 安装构建工具，使用vue-cli构建
 */
export function installBuild(feature: Array<string>): void {
  // 设置 package.json
  const packageJson = readJsonFile<PackageJSON>('./package.json');
  packageJson.scripts['build:comment'] = '构建';
  let order = '';
  if (feature.includes('ESLint')) {
    order += 'npm run eslint';
  }
  if (feature.includes('Prettier')) {
    order += ' && npm run prettier';
  }
  order += ' && vue-cli-service build';
  packageJson.scripts['build'] = order;
  writeJsonFile<PackageJSON>('./package.json', packageJson);
}
