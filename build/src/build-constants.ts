import { resolve } from 'path';

export const PKG_NAME = 'chhis-design-vue';
export const PKG_PREFIX = '@cnhis-design-vue';

export const projRoot = resolve(__dirname, '..', '..');
export const pkgRoot = resolve(projRoot, 'packages');
export const cdRoot = resolve(pkgRoot, 'cnhis-design-vue');
export const buildRoot = resolve(projRoot);

/** root */
export const buildOutput = resolve(projRoot);
/** `/el/components` */
export const cdOutput = resolve(buildOutput);

export const projPackage = resolve(projRoot, 'package.json');

