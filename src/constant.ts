import { join } from 'path';
import { GitLabConfig } from './types';

export const CWD = process.cwd();
export const GENERATOR_DIR = join(__dirname, '../generators');

export const gitLabConfig: GitLabConfig = {
  vue2: {
    label: 'Vue 2',
    url: 'http://10.0.30.40:9191/zhangyushi/vue2-template.git',
    branch: 'main',
  },
  vue3: {
    label: 'Vue 3',
    url: 'http://10.0.30.40:9191/dev1-group/dms-web.git',
    branch: 'main',
  },
  'vue2-h5': {
    label: 'vue2-h5',
    url: 'http://10.0.30.40:9191/dev1-group/melib-web.git',
    branch: 'main',
  },
  'vue3-h5': {
    label: 'Vue 3-h5',
    url: 'http://10.0.30.40:9191/dev1-group/melib-web.git',
    branch: 'main',
  },
  nodejs: {
    label: 'Node js',
    url: 'http://10.0.30.40:9191/dev1-group/dms-service.git',
    branch: 'main',
  },
};

export enum FEATURE_ENUMS {
  ESLint = 'ESLint',
  Prettier = 'Prettier',
  CZ = 'CZ',
  TypeScript = 'TypeScript',
}
