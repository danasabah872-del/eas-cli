import { ExpoConfig } from '@expo/config';
import { Platform, Workflow } from '@expo/eas-build-job';
import { BuildProfile, EasJson } from '@expo/eas-json';
import { LoggerLevel } from '@expo/logger';
import { NodePackageManager } from '@expo/package-manager';

import { LocalBuildOptions } from './local';
import { Analytics, AnalyticsEventProperties } from '../analytics/AnalyticsManager';
import { ExpoGraphqlClient } from '../commandUtils/context/contextUtils/createGraphqlClient';
import { CredentialsContext } from '../credentials/context';
import { Target } from '../credentials/ios/types';
import { BuildResourceClass } from '../graphql/generated';
import { GradleBuildContext } from '../project/android/gradle';
import { CustomBuildConfigMetadata } from '../project/customBuildConfig';
import { XcodeBuildContext } from '../project/ios/scheme';
import { Actor } from '../user/User';
import { Client } from '../vcs/vcs';

/**
 * The common build context.
 * This is the build context without the platform-specific context.
 * @template T The platform to build for.
 */
export type CommonContext<T extends Platform> = Omit<BuildContext<T>, 'android' | 'ios'>;

/**
 * The Android-specific build context.
 */
export interface AndroidBuildContext {
  /**
   * The Android application ID.
   */
  applicationId: string;
  /**
   * The Gradle build context.
   */
  gradleContext?: GradleBuildContext;
  /**
   * The version code override.
   */
  versionCodeOverride?: string;
}

/**
 * The iOS-specific build context.
 */
export interface IosBuildContext {
  /**
   * The bundle identifier.
   */
  bundleIdentifier: string;
  /**
   * The application target.
   */
  applicationTarget: Target;
  /**
   * The targets.
   */
  targets: Target[];
  /**
   * The Xcode build context.
   */
  xcodeBuildContext: XcodeBuildContext;
  /**
   * The build number override.
   */
  buildNumberOverride?: string;
}

/**
 * The build context.
 * @template T The platform to build for.
 */
export interface BuildContext<T extends Platform> {
  /**
   * The name of the account to build for.
   */
  accountName: string;
  /**
   * The EAS JSON CLI configuration.
   */
  easJsonCliConfig: EasJson['cli'];
  /**
   * The build profile.
   */
  buildProfile: BuildProfile<T>;
  /**
   * The name of the build profile.
   */
  buildProfileName: string;
  /**
   * The resource class to use for the build.
   */
  resourceClass: BuildResourceClass;
  /**
   * Whether to clear the cache before building.
   */
  clearCache: boolean;
  /**
   * The credentials context.
   */
  credentialsCtx: CredentialsContext;
  /**
   * The Expo config.
   */
  exp: ExpoConfig;
  /**
   * The local build options.
   */
  localBuildOptions: LocalBuildOptions;
  /**
   * Whether to run in non-interactive mode.
   */
  nonInteractive: boolean;
  /**
   * Whether to exit immediately after starting the build.
   */
  noWait: boolean;
  /**
   * Whether the build is running from a CI environment.
   */
  runFromCI: boolean;
  /**
   * The platform to build for.
   */
  platform: T;
  /**
   * The project directory.
   */
  projectDir: string;
  /**
   * The project ID.
   */
  projectId: string;
  /**
   * The project name.
   */
  projectName: string;
  /**
   * The build message.
   */
  message?: string;
  /**
   * The analytics event properties.
   */
  analyticsEventProperties: AnalyticsEventProperties;
  /**
   * The user.
   */
  user: Actor;
  /**
   * The GraphQL client.
   */
  graphqlClient: ExpoGraphqlClient;
  /**
   * The analytics client.
   */
  analytics: Analytics;
  /**
   * The workflow.
   */
  workflow: Workflow;
  /**
   * The custom build configuration metadata.
   */
  customBuildConfigMetadata?: CustomBuildConfigMetadata;
  /**
   * The Android-specific build context.
   */
  android: T extends Platform.ANDROID ? AndroidBuildContext : undefined;
  /**
   * The iOS-specific build context.
   */
  ios: T extends Platform.IOS ? IosBuildContext : undefined;
  /**
   * Whether to build a development client.
   */
  developmentClient: boolean;
  /**
   * The required package manager.
   */
  requiredPackageManager: NodePackageManager['name'] | null;
  /**
   * The vcs client.
   */
  vcsClient: Client;
  /**
   * The logger level.
   */
  loggerLevel?: LoggerLevel;
  /**
   * Whether verbose logging is enabled.
   */
  isVerboseLoggingEnabled: boolean;
  /**
   * What to test.
   */
  whatToTest?: string;
  /**
   * The environment variables.
   */
  env: Record<string, string>;
}
