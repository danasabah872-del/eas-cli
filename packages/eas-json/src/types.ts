import { EasJsonBuildProfile } from './build/types';
import { EasJsonSubmitProfile } from './submit/types';

/**
 * The type of a profile.
 */
export type ProfileType = 'build' | 'submit';
/**
 * A profile from `eas.json`.
 */
export type EasJsonProfile<T extends ProfileType> = T extends 'build'
  ? EasJsonBuildProfile
  : EasJsonSubmitProfile;

/**
 * The source of the credentials.
 */
export enum CredentialsSource {
  LOCAL = 'local',
  REMOTE = 'remote',
}

/**
 * The source of the app version.
 */
export enum AppVersionSource {
  LOCAL = 'local',
  REMOTE = 'remote',
}

/**
 * The `eas.json` file format.
 */
export interface EasJson {
  /**
   * The CLI configuration.
   */
  cli?: {
    /**
     * The EAS CLI version.
     */
    version?: string;
    /**
     * A boolean indicating whether a git commit is required to build.
     */
    requireCommit?: boolean;
    appVersionSource?: AppVersionSource;
    promptToConfigurePushNotifications?: boolean;
    updateAssetHostOverride?: string;
    updateManifestHostOverride?: string;
  };
  build?: { [profileName: string]: EasJsonBuildProfile };
  submit?: { [profileName: string]: EasJsonSubmitProfile };
}
