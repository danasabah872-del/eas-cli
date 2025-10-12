import { AppVersionSource, EasJson, EasJsonAccessor } from '@expo/eas-json';
import chalk from 'chalk';
import fs from 'fs-extra';

import { maybeBailOnRepoStatusAsync, reviewAndCommitChangesAsync } from './utils/repository';
import Log, { learnMore } from '../log';
import { ora } from '../ora';
import { easCliVersion } from '../utils/easCli';
import { Client } from '../vcs/vcs';

interface ConfigureParams {
  projectDir: string;
  nonInteractive: boolean;
  vcsClient: Client;
}

/**
 * Check if eas.json exists in the project directory.
 * @param projectDir The project directory.
 * @returns A boolean indicating whether eas.json exists.
 */
export async function easJsonExistsAsync(projectDir: string): Promise<boolean> {
  return await fs.pathExists(EasJsonAccessor.formatEasJsonPath(projectDir));
}

/**
 * Creates eas.json if it does not exist.
 *
 * @param configureParams The configuration parameters.
 * @returns A boolean indicating whether eas.json was created.
 */
export async function ensureProjectConfiguredAsync(
  configureParams: ConfigureParams
): Promise<boolean> {
  if (await easJsonExistsAsync(configureParams.projectDir)) {
    return false;
  }

  await configureAsync(configureParams);
  return true;
}

async function configureAsync({
  projectDir,
  nonInteractive,
  vcsClient,
}: ConfigureParams): Promise<void> {
  await maybeBailOnRepoStatusAsync(vcsClient, nonInteractive);

  await createEasJsonAsync(projectDir, vcsClient);

  if (await vcsClient.isCommitRequiredAsync()) {
    Log.newLine();
    await reviewAndCommitChangesAsync(vcsClient, 'Configure EAS Build', {
      nonInteractive,
    });
  }
}

/**
 * Check if a build profile exists in eas.json.
 * @param projectDir The project directory.
 * @param profileName The name of the build profile.
 * @returns A boolean indicating whether the build profile exists.
 */
export async function doesBuildProfileExistAsync({
  projectDir,
  profileName,
}: {
  projectDir: string;
  profileName: string;
}): Promise<boolean> {
  try {
    const easJsonAccessor = EasJsonAccessor.fromProjectPath(projectDir);
    const easJson = await easJsonAccessor.readRawJsonAsync();
    if (!easJson.build?.[profileName]) {
      return false;
    }
    return true;
  } catch (error) {
    Log.error(`We were unable to read ${chalk.bold('eas.json')} contents. Error: ${error}.`);
    throw error;
  }
}

/**
 * Create a new build profile in eas.json.
 * @param projectDir The project directory.
 * @param profileName The name of the build profile.
 * @param profileContents The contents of the build profile.
 * @param vcsClient The vcs client.
 * @param nonInteractive A boolean indicating whether to run in non-interactive mode.
 */
export async function createBuildProfileAsync({
  projectDir,
  profileName,
  profileContents,
  vcsClient,
  nonInteractive,
}: {
  projectDir: string;
  profileName: string;
  profileContents: Record<string, any>;
  vcsClient: Client;
  nonInteractive: boolean;
}): Promise<void> {
  const spinner = ora(`Adding "${profileName}" build profile to ${chalk.bold('eas.json')}`).start();
  try {
    const easJsonAccessor = EasJsonAccessor.fromProjectPath(projectDir);
    await easJsonAccessor.readRawJsonAsync();

    easJsonAccessor.patch(easJsonRawObject => {
      return {
        ...easJsonRawObject,
        build: {
          ...easJsonRawObject.build,
          [profileName]: profileContents,
        },
      };
    });
    await easJsonAccessor.writeAsync();
    spinner.succeed(
      `Successfully added "${profileName}" build profile to ${chalk.bold('eas.json')}.`
    );

    if (await vcsClient.isCommitRequiredAsync()) {
      Log.newLine();
      await reviewAndCommitChangesAsync(
        vcsClient,
        `Add "${profileName}" build profile to eas.json`,
        {
          nonInteractive,
        }
      );
    }
  } catch (error) {
    spinner.fail(
      `We were not able to configure "${profileName}" build profile inside of ${chalk.bold(
        'eas.json'
      )}. Error: ${error}.`
    );
    throw error;
  }
}

const EAS_JSON_DEFAULT: EasJson = {
  cli: {
    version: `>= ${easCliVersion}`,
    appVersionSource: AppVersionSource.REMOTE,
  },
  build: {
    development: {
      developmentClient: true,
      distribution: 'internal',
    },
    preview: {
      distribution: 'internal',
    },
    production: {
      autoIncrement: true,
    },
  },
  submit: {
    production: {},
  },
};

async function createEasJsonAsync(projectDir: string, vcsClient: Client): Promise<void> {
  const easJsonPath = EasJsonAccessor.formatEasJsonPath(projectDir);

  await fs.writeFile(easJsonPath, `${JSON.stringify(EAS_JSON_DEFAULT, null, 2)}\n`);
  await vcsClient.trackFileAsync(easJsonPath);
  Log.withTick(
    `Generated ${chalk.bold('eas.json')}. ${learnMore(
      'https://docs.expo.dev/build-reference/eas-json/'
    )}`
  );
}
