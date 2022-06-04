import { resolve } from 'path';
import { ResolveIdHook, rollup } from 'rollup';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import esbuild from 'rollup-plugin-esbuild';
import glob from 'fast-glob';
import { cdOutput, cdRoot, pkgRoot } from '../build-constants';
import { excludeFiles, generateExternal } from '../build-utils';
import alias from '@rollup/plugin-alias';
import { CnHisDesignAlias } from '../plugins/cn-design-alias';

const customResolver = nodeResolve({
  extensions: ['.vue', '.js', '.ts', '.tsx', '.json', '.mjs']
});
export const buildModules = async () => {
  const input = excludeFiles(
    await glob('**/*.{js,ts,vue}', {
      cwd: pkgRoot,
      absolute: true,
    })
  );
  const bundle = await rollup({
    input,
    plugins: [
      CnHisDesignAlias(),
      alias({
        entries: [
          { find: '@', replacement: resolve(__dirname, '../src') },
          { find: '~', replacement: resolve(__dirname, '../packages') }
        ],
        customResolver: customResolver as ResolveIdHook
      }),
      vue({
        isProduction: false
      }),
      vueJsx(),
      nodeResolve({
        extensions: ['.mjs', '.js', '.json', '.ts', '.css', '.less'],
      }),
      commonjs(),
      esbuild({
        jsxFactory: 'vueJsxCompat'
      })
    ],
    external: await generateExternal({ full: false })
  });
  await bundle.write(
    {
      format: 'es',
      dir: resolve(cdOutput, 'es'),
      preserveModules: true,
      preserveModulesRoot: cdRoot,
      entryFileNames: `[name].mjs`,
    }
  );
};
