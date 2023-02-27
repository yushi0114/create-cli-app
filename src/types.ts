export enum TemplateTypeEnum {
  vue2 = 'vue2',
  vue3 = 'vue3',
  'vue2-h5' = 'vue2-h5',
  'vue3-h5' = 'vue3-h5',
  nodejs = 'nodejs',
}

export enum CssLangEnum {
  LESS = 'less',
  SCSS = 'scss',
}

export type GitLabConfigItem = { label: string; url: string; branch: string };

export type GitLabConfig = { [K in TemplateTypeEnum]: GitLabConfigItem };
