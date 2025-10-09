export enum AndroidReleaseStatus {
  completed = 'completed',
  draft = 'draft',
  halted = 'halted',
  inProgress = 'inProgress',
}

export enum AndroidReleaseTrack {
  production = 'production',
  beta = 'beta',
  alpha = 'alpha',
  internal = 'internal',
}

/**
 * The Android submit profile.
 */
export interface AndroidSubmitProfile {
  /**
   * The release status for the submission.
   */
  releaseStatus?: AndroidReleaseStatus;
  /**
   * The release track for the submission.
   */
  releaseTrack?: AndroidReleaseTrack;
  /**
   * A boolean indicating whether to send the changes for review.
   */
  changesNotSentForReview?: boolean;
  /**
   * The path to the service account key.
   */
  serviceAccountKeyPath?: string;
}

/**
 * The iOS submit profile.
 */
export interface IosSubmitProfile {
  /**
   * The App Store Connect app ID.
   */
  ascAppId?: string;
  /**
   * The Apple ID.
   */
  appleId?: string;
  /**
   * The App Store Connect app identifier.
   */
  ascAppIdentifier?: string;
  /**
   * The Apple team ID.
   */
  appleTeamId?: string;
  /**
   * The SKU.
   */
  sku?: string;
  /**
   * The language.
   */
  language?: string;
  /**
   * The company name.
   */
  companyName?: string;
  /**
   * The app name.
   */
  appName?: string;
}

/**
 * The submit profile.
 */
export type SubmitProfile<TPlatform extends 'android' | 'ios'> = TPlatform extends 'android'
  ? AndroidSubmitProfile
  : IosSubmitProfile;

/**
 * The `eas.json` submit profile.
 */
export interface EasJsonSubmitProfile {
  /**
   * The name of the profile to extend.
   */
  extends?: string;
  /**
   * The Android-specific submit profile properties.
   */
  android?: AndroidSubmitProfile;
  /**
   * The iOS-specific submit profile properties.
   */
  ios?: IosSubmitProfile;
}

/**
 * The fields to evaluate for an Android submit profile.
 */
export const AndroidSubmitProfileFieldsToEvaluate: (keyof AndroidSubmitProfile)[] = [
  'serviceAccountKeyPath',
];

/**
 * The fields to evaluate for an iOS submit profile.
 */
export const IosSubmitProfileFieldsToEvaluate: (keyof IosSubmitProfile)[] = ['appleId'];
