import * as download from 'download-git-repo';
import { printMsg, GET_GENERATOR_DIR } from '../utils/common';
// import { execSync } from 'child_process';
import rimraf from 'rimraf';
import { red, green } from 'chalk';
import { gitLabConfig } from '../constant';
import { TemplateTypeEnum } from '../types';

export function clone(remote, name, option) {
  printMsg(green('正在拉取项目…'));
  printMsg(green(remote));
  return new Promise<void>((resolve, reject) => {
    download(remote, name, option, (err) => {
      if (err) {
        printMsg(red(err));
        reject(err);
        return;
      }
      printMsg(green('拉取成功'));
      resolve();
    });
  });
}

export async function cloneTemplate(vueVersion: TemplateTypeEnum) {
  const { url, branch } = gitLabConfig[vueVersion];
  await rimraf(GET_GENERATOR_DIR(vueVersion), {});
  // 下载模板
  // printMsg(green('正在拉取项目…'));
  // await execSync(
  //   `git clone -b ${branch} ${url} ${GET_GENERATOR_DIR(vueVersion)}`,
  // );
  // printMsg(green('拉取成功'));
  await clone(`direct:${url}#${branch}`, GET_GENERATOR_DIR(vueVersion), {
    clone: true,
  });
  return true;
}
