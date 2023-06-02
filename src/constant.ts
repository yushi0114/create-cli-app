import { join } from 'path';
import { GitLabConfig } from './types';

export const CWD = process.cwd();
export const GENERATOR_DIR = join(__dirname, '../generators');

export const gitLabConfig: GitLabConfig = {
  vue2: {
    label: 'Vue 2',
    url: 'https://github.com/yushi0114/vue2-template.git',
    branch: 'main',
  },
  vue3: {
    label: 'Vue 3',
    url: 'https://github.com/yushi0114/vben-v2-template.git',
    branch: 'main',
  },
  'vue2-h5': {
    label: 'vue2-h5',
    url: 'https://github.com/yushi0114/vue2-template.git',
    branch: 'main',
  },
  'vue3-h5': {
    label: 'Vue 3-h5',
    url: 'https://github.com/yushi0114/vben-v2-template.git',
    branch: 'main',
  },
  nodejs: {
    label: 'Node js',
    url: 'https://github.com/yushi0114/tcl-store-api.git',
    branch: 'main',
  },
};

export enum FEATURE_ENUMS {
  ESLint = 'ESLint',
  Prettier = 'Prettier',
  CZ = 'CZ',
  TypeScript = 'TypeScript',
}
