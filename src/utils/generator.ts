import { copySync, readFileSync, writeFileSync } from 'fs-extra';
import * as glob from 'fast-glob';
import * as shell from 'shelljs';
import { yellow, green, blue } from 'chalk';
import { prompt } from 'inquirer';
import { sep, join } from 'path';
import { CWD, GENERATOR_DIR, gitLabConfig, FEATURE_ENUMS } from '../constant';
import { printMsg, clearConsole } from '../utils/common';
import { cloneTemplate } from './cloneTemplate';
import { TemplateTypeEnum, CssLangEnum } from '../types';

const vueVersionOptions: { name: string; value: TemplateTypeEnum }[] = [];
(Object.keys(gitLabConfig) as TemplateTypeEnum[]).forEach((key) => {
  vueVersionOptions.push({ name: gitLabConfig[key].label, value: key });
});

const featureOptions: { name: string; value: FEATURE_ENUMS }[] = [];
(Object.keys(FEATURE_ENUMS) as FEATURE_ENUMS[]).forEach((key) => {
  featureOptions.push({ name: key, value: key });
});

const GET_PROMPTS = (projectName) => [
  {
    type: 'input',
    message: `请输入项目名称：（${projectName}）`,
    name: 'name',
    default: projectName,
    validate(val) {
      if (val.match(/[^A-Za-z0-9\u4e00-\u9fa5_-]/g)) {
        return '项目名称包含非法字符';
      }
      return true;
    },
  },
  {
    type: 'input',
    message: '请输入项目简介：',
    name: 'description',
  },
  {
    name: 'vueVersion',
    message: 'Select Vue version',
    type: 'list',
    choices: vueVersionOptions,
  },
  {
    name: 'preprocessor',
    message: 'Select css preprocessor',
    type: 'list',
    choices: ['Less', 'Sass'],
  },
  {
    name: 'feature',
    type: 'checkbox',
    message: 'Check the features needed for your project',
    choices: featureOptions,
  },
];

export class SjcGenerator {
  outputDir = '';

  inputs: {
    name: string;
    description: string;
    vueVersion: TemplateTypeEnum;
    cssLang: CssLangEnum | '';
    preprocessor: 'Less' | 'Sass' | '';
    feature: string[];
  } = {
    name: '',
    description: '',
    cssLang: '',
    vueVersion: TemplateTypeEnum.vue2,
    preprocessor: '',
    feature: [],
  };

  constructor(name: string) {
    this.inputs.name = name;
    this.outputDir = join(CWD, name);
  }

  async run() {
    // await this.prompting();
    await this.writing();
    this.end();
  }

  async prompting() {
    // 清空命令行
    clearConsole();
    // 输出信息
    /* eslint-disable @typescript-eslint/no-var-requires */
    printMsg(blue(`SJC WEB CLI v${require('../../package.json').version}`));
    printMsg('Start initializing the project:');
    printMsg('');
    return prompt<Record<string, string>>(GET_PROMPTS(this.inputs.name)).then(
      (inputs) => {
        const preprocessor = inputs.preprocessor.toLowerCase();
        const cssLang = preprocessor === 'sass' ? 'scss' : preprocessor;
        this.inputs.cssLang = cssLang;
        this.inputs.vueVersion = inputs.vueVersion;
        this.inputs.preprocessor = preprocessor;
        this.inputs.description = inputs.description;
        this.inputs.name = inputs.name;
        this.inputs.feature = inputs.feature;
        this.outputDir = join(CWD, inputs.name);
      },
    );
  }

  async writing() {
    console.log();
    printMsg(`Creating project in ${green(this.outputDir)}\n`);
    await cloneTemplate(this.inputs.vueVersion);
    // see https://github.com/mrmlnc/fast-glob#how-to-write-patterns-on-windows
    const templatePath = join(GENERATOR_DIR, this.inputs.vueVersion).replace(
      /\\/g,
      '/',
    );

    const templateFiles = glob.sync(
      join(templatePath, '**', '*').replace(/\\/g, '/'),
      {
        dot: true,
      },
    );

    templateFiles.forEach((filePath) => {
      if (filePath.includes('.git') && !filePath.includes('.gitignore')) {
        return;
      }
      const outputPath = filePath
        .replace('.tpl', '')
        .replace(templatePath, this.outputDir);
      this.copyTpl(filePath, outputPath, this.inputs);
    });
  }

  copyTpl(from: string, to: string, args: Record<string, unknown>) {
    copySync(from, to);
    let content = readFileSync(to, 'utf-8');

    Object.keys(args).forEach((key) => {
      const regexp = new RegExp(`<%= ${key} %>`, 'g');
      content = content.replace(regexp, args[key]);
    });

    writeFileSync(to, content);

    const name = to.replace(this.outputDir + sep, '');
    printMsg(`${green('create')} ${name}`);
  }

  end() {
    const { name } = this.inputs;

    console.log();
    printMsg(`Successfully created ${yellow(name)}.`);
    printMsg(blue(`正在安装项目node_modules...`));
    shell.cd(name);
    // printMsg(
    //   `Run ${yellow(
    //     `cd ${name} && git init && yarn && yarn dev`,
    //   )} to start development!`,
    // );
  }
}
