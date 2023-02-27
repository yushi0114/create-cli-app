/**
 * create 命令的具体任务
 */

import {
  end,
  installFeature,
  // installTSAndInit,
  // installTypesNode,
  isFileExist,
  // selectFeature,
} from '../utils/create';

import { SjcGenerator } from '../utils/generator';

// create 命令
export default async function create(projectName: string): Promise<void> {
  const generator = new SjcGenerator(projectName);
  await generator.prompting();
  // 判断文件是否已经存在
  isFileExist(generator.inputs.name);
  await generator.run();
  // 安装 typescript 并初始化
  // (generator.inputs.feature.includes('TypeScript')) && installTSAndInit();
  // 安装 @types/node
  // (generator.inputs.feature.includes('TypeScript')) && installTypesNode();
  // 安装 feature
  installFeature(generator.inputs.feature);
  // 结束
  end(projectName);
}
