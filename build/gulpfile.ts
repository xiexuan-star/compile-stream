import { mkdir } from 'fs/promises';
import { parallel, series } from 'gulp';
import { cdOutput, run, runTask, withTaskName } from './src';

export default series([
  withTaskName('clean', () => run('pnpm run clean')),
  withTaskName('createOutput', () => mkdir(cdOutput, { recursive: true })),
  parallel(
    runTask('buildModules'),
    runTask('buildStyles')
  )
]);

export * from './src';

