import { RunOptions, getPackageJson } from '@expo/config';
import { SpawnResult } from '@expo/spawn-async';

/**
 * Checks if an object is a spawn result error.
 * @param obj - The object to check.
 * @returns True if the object is a spawn result error, false otherwise.
 */
export function isSpawnResultError(obj: any): obj is Error & SpawnResult {
  return (
    obj &&
    'message' in obj &&
    obj.status !== undefined &&
    obj.stdout !== undefined &&
    obj.stderr !== undefined
  );
}

/**
 * Checks if the current build is a dev client build.
 * @param runOptions - The run options.
 * @param projectRoot - The project root.
 * @returns True if the current build is a dev client build, false otherwise.
 */
export function isDevClientBuild({
  runOptions,
  projectRoot,
}: {
  runOptions: RunOptions;
  projectRoot: string;
}): boolean {
  if (!hasDirectDevClientDependency(projectRoot)) {
    return false;
  }

  if ('variant' in runOptions && runOptions.variant !== undefined) {
    return runOptions.variant === 'debug';
  }
  if ('configuration' in runOptions && runOptions.configuration !== undefined) {
    return runOptions.configuration === 'Debug';
  }

  return true;
}

/**
 * Checks if the project has a direct dev client dependency.
 * @param projectRoot - The project root.
 * @returns True if the project has a direct dev client dependency, false otherwise.
 */
export function hasDirectDevClientDependency(projectRoot: string): boolean {
  const { dependencies = {}, devDependencies = {} } = getPackageJson(projectRoot);
  return !!dependencies['expo-dev-client'] || !!devDependencies['expo-dev-client'];
}
