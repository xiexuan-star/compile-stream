import glob from 'fast-glob';
import { src, dest } from 'gulp';
import less from 'gulp-less';
import { resolve } from 'path';
import { cdOutput, pkgRoot } from '../build-constants';
import { excludeFiles } from '../build-utils';

function gulpLessParser(id: string) {
  const outputId = resolve(cdOutput, 'es', id.match(/packages\/(.+\/style)/)?.[1] ?? '');
  return src(id)
    .pipe(less())
    .pipe(dest(outputId));
}

export const buildStyles = async () => {
  const input = excludeFiles(
    await glob('**/index.{less,css}', {
      cwd: pkgRoot,
      absolute: true,
    }));
  return Promise.all(input.map(gulpLessParser));
};
