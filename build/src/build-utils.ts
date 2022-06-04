import { spawn } from 'child_process';
import chalk from 'chalk';
import consola from 'consola';
import type { TaskFunction } from 'gulp';
import { buildRoot, projPackage, projRoot } from './build-constants';
import type { ProjectManifest } from '@pnpm/types';

export const getPackageManifest = (pkgPath: string) => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require(pkgPath) as ProjectManifest;
};

export const getPackageDependencies = (
  pkgPath: string
): Record<'dependencies' | 'peerDependencies', string[]> => {
  const manifest = getPackageManifest(pkgPath);
  const { dependencies = {}, peerDependencies = {} } = manifest;

  return {
    dependencies: Object.keys(dependencies),
    peerDependencies: Object.keys(peerDependencies),
  };
};

export const excludeFiles = (files: string[]) => {
  const excludes = ['node_modules', 'test', 'mock', 'gulpfile', 'dist'];
  return files.filter(
    (path) => !excludes.some((exclude) => path.includes(exclude))
  );
};

export const withTaskName = <T extends TaskFunction>(name: string, fn: T) =>
  Object.assign(fn, { displayName: name });

export const runTask = (name: string) =>
  withTaskName(`shellTask:${ name }`, () =>
    run(`pnpm run start ${ name }`, buildRoot)
  );

export const run = async (command: string, cwd: string = projRoot) =>
  new Promise<void>((resolve, reject) => {
    const [cmd, ...args] = command.split(' ');
    consola.info(`run: ${ chalk.green(`${ cmd } ${ args.join(' ') }`) }`);
    const app = spawn(cmd, args, {
      cwd,
      stdio: 'inherit',
      shell: process.platform === 'win32',
    });

    const onProcessExit = () => app.kill('SIGHUP');

    app.on('close', (code) => {
      process.removeListener('exit', onProcessExit);

      if (code === 0) {
        resolve();
      } else {
        reject(
          new Error(`Command failed. \n Command: ${ command } \n Code: ${ code }`)
        );
      }
    });
    process.on('exit', onProcessExit);
  });

export const generateExternal = async (options: { full: boolean }) => {
  const { dependencies, peerDependencies } = getPackageDependencies(projPackage);

  return (id: string) => {
    const packages: string[] = peerDependencies;
    if (!options.full) {
      packages.push('@vue', ...dependencies);
    }

    return [...new Set(packages)].some(
      (pkg) => id === pkg || id.startsWith(`${ pkg }/`)
    );
  };
};
