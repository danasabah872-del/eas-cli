import { Android, Cache, Ios, Platform } from '@expo/eas-build-job';

/**
 * The source of the credentials.
 */
export enum CredentialsSource {
  LOCAL = 'local',
  REMOTE = 'remote',
}

/**
 * The resource class for a build.
 */
export enum ResourceClass {
  DEFAULT = 'default',
  LARGE = 'large',
  /**
   * @deprecated use M_MEDIUM instead
   */
  M1_MEDIUM = 'm1-medium',
  MEDIUM = 'medium',
  M_MEDIUM = 'm-medium',
  /**
   * @deprecated use LARGE instead
   */
  M_LARGE = 'm-large',
}

/**
 * The distribution type for a build.
 */
export type DistributionType = 'store' | 'internal';

/**
 * The enterprise provisioning type for an iOS build.
 */
export type IosEnterpriseProvisioning = 'adhoc' | 'universal';

/**
 * The auto-increment type for a version.
 */
export type VersionAutoIncrement = boolean | 'version';
/**
 * The auto-increment type for an iOS version.
 */
export type IosVersionAutoIncrement = VersionAutoIncrement | 'buildNumber';
/**
 * The auto-increment type for an Android version.
 */
export type AndroidVersionAutoIncrement = VersionAutoIncrement | 'versionCode';

/**
 * The common build profile properties.
 */
export interface CommonBuildProfile {
  /**
   * The resource class for the build.
   */
  resourceClass?: ResourceClass;

  /**
   * The environment variables for the build.
   */
  env?: Record<string, string>;
  /**
   * The Node.js version for the build.
   */
  node?: string;
  /**
   * A boolean indicating whether to use Corepack.
   */
  corepack?: boolean;
  /**
   * The pnpm version for the build.
   */
  pnpm?: string;
  /**
   * The Bun version for the build.
   */
  bun?: string;
  /**
   * The Yarn version for the build.
   */
  yarn?: string;
  /**
   * @deprecated
   */
  expoCli?: string;

  /**
   * The source of the credentials.
   */
  credentialsSource: CredentialsSource;
  /**
   * The distribution type for the build.
   */
  distribution: DistributionType;

  /**
   * The release channel for the build.
   */
  releaseChannel?: string;
  /**
   * The channel for the build.
   */
  channel?: string;

  /**
   * A boolean indicating whether the build is for a development client.
   */
  developmentClient?: boolean;
  /**
   * The pre-build command for the build.
   */
  prebuildCommand?: string;

  /**
   * The auto-increment type for the version.
   */
  autoIncrement?: boolean;

  /**
   * The paths to the build artifacts.
   */
  buildArtifactPaths?: string[];

  /**
   * The cache configuration for the build.
   */
  cache?: Omit<Cache, 'clear'>;

  /**
   * The path to the custom build configuration.
   */
  config?: string;

  /**
   * A boolean indicating whether to build without credentials.
   */
  withoutCredentials?: boolean;

  /**
   * The environment for the build.
   */
  environment?: 'preview' | 'production' | 'development';
}

/**
 * The platform-specific build profile properties.
 */
interface PlatformBuildProfile extends Omit<CommonBuildProfile, 'autoIncrement'> {
  /**
   * @deprecated use applicationArchivePath
   */
  artifactPath?: string;
  /**
   * The path to the application archive.
   */
  applicationArchivePath?: string;
}

/**
 * The Android build profile properties.
 */
export interface AndroidBuildProfile extends PlatformBuildProfile {
  /**
   * The image for the builder environment.
   */
  image?: Android.BuilderEnvironment['image'];
  /**
   * The NDK version for the build.
   */
  ndk?: string;

  /**
   * The Gradle command for the build.
   */
  gradleCommand?: string;
  /**
   * The build type for the build.
   */
  buildType?: Android.BuildType.APK | Android.BuildType.APP_BUNDLE;

  /**
   * The auto-increment type for the version.
   */
  autoIncrement?: AndroidVersionAutoIncrement;

  /**
   * The name of the keystore.
   */
  keystoreName?: string;
}

/**
 * The iOS build profile properties.
 */
export interface IosBuildProfile extends PlatformBuildProfile {
  /**
   * The image for the builder environment.
   */
  image?: Ios.BuilderEnvironment['image'];
  /**
   * The Bundler version for the build.
   */
  bundler?: string;
  /**
   * The Fastlane version for the build.
   */
  fastlane?: string;
  /**
   * The CocoaPods version for the build.
   */
  cocoapods?: string;

  /**
   * The enterprise provisioning type for the build.
   */
  enterpriseProvisioning?: IosEnterpriseProvisioning;

  /**
   * A boolean indicating whether the build is for a simulator.
   */
  simulator?: boolean;
  /**
   * The scheme for the build.
   */
  scheme?: string;
  /**
   * The build configuration for the build.
   */
  buildConfiguration?: string;

  /**
   * The auto-increment type for the version.
   */
  autoIncrement?: IosVersionAutoIncrement;
}

/**
 * The build profile for a specific platform.
 */
export type BuildProfile<TPlatform extends Platform = Platform> = TPlatform extends Platform.ANDROID
  ? AndroidBuildProfile
  : IosBuildProfile;

/**
 * The `eas.json` build profile.
 */
export interface EasJsonBuildProfile extends Partial<CommonBuildProfile> {
  /**
   * The name of the profile to extend.
   */
  extends?: string;
  /**
   * The Android-specific build profile properties.
   */
  [Platform.ANDROID]?: Partial<AndroidBuildProfile>;
  /**
   * The iOS-specific build profile properties.
   */
  [Platform.IOS]?: Partial<IosBuildProfile>;
}
