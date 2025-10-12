import { BuildProfile } from '@expo/eas-json';

import { EnvironmentVariableEnvironment } from '../../graphql/generated';

type Environment = NonNullable<BuildProfile['environment']>;

const BuildProfileEnvironmentToEnvironment: Record<Environment, EnvironmentVariableEnvironment> = {
  production: EnvironmentVariableEnvironment.Production,
  preview: EnvironmentVariableEnvironment.Preview,
  development: EnvironmentVariableEnvironment.Development,
};

/**
 * Check if a string is a valid environment.
 * @param env The string to check.
 * @returns Whether the string is a valid environment.
 */
export function isEnvironment(env: string): env is EnvironmentVariableEnvironment {
  return Object.values(EnvironmentVariableEnvironment).includes(
    env as EnvironmentVariableEnvironment
  );
}

/**
 * Convert a build profile environment to an environment.
 * @param environment The build profile environment.
 * @returns The environment, or null if the build profile environment is not set.
 */
export function buildProfileEnvironmentToEnvironment(
  environment: BuildProfile['environment']
): EnvironmentVariableEnvironment | null {
  if (!environment) {
    return null;
  }
  return BuildProfileEnvironmentToEnvironment[environment];
}
