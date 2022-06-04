import { PKG_NAME, PKG_PREFIX } from '../build-constants';

import type { Plugin } from 'rollup';

export function CnHisDesignAlias(): Plugin {
  const themeChalk = 'theme-chalk';
  const sourceThemeChalk = `${ PKG_PREFIX }/${ themeChalk }` as const;
  const bundleThemeChalk = `${ PKG_NAME }/${ themeChalk }` as const;

  return {
    name: 'cnhis-design-alias-plugin',
    resolveId(id) {
      if (id.startsWith(sourceThemeChalk)) {
        return {
          id: id.replaceAll(sourceThemeChalk, bundleThemeChalk),
          external: 'absolute',
        };
      }
      if (id.startsWith('~/')) {
        return {
          id: id.replaceAll('~/', `${ PKG_NAME }/es/`),
          external: 'absolute'
        };
      }
    },
  };
}
