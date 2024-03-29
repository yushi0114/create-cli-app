import { program } from 'commander';
import create from './order/create';

// sjc-cli-app -v、sjc-cli-app --version
// 临时禁用规则，保证这里可以通过 require 方法获取 package.json 中的版本号
/* eslint-disable @typescript-eslint/no-var-requires */
program
  .version(`${require('../package.json').version}`, '-v --version')
  .usage('<command> [options]');

// ys-starter create newPro
program
  .command('create <app-name>')
  .description('Create new project from => ys-starter create yourProjectName')
  .action(async (name: string) => {
    // 创建命令具体做的事情都在这里，name 是你指定的 newPro
    await create(name);
  });

program.parse(process.argv);
