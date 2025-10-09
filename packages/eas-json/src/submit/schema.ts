import Joi from 'joi';

import { AndroidReleaseStatus, AndroidReleaseTrack } from './types';

/**
 * The schema for the Android submit profile.
 */
export const AndroidSubmitProfileSchema = Joi.object({
  /**
   * The release status for the submission.
   */
  releaseStatus: Joi.string().valid(...Object.values(AndroidReleaseStatus)),
  /**
   * The release track for the submission.
   */
  releaseTrack: Joi.string().valid(...Object.values(AndroidReleaseTrack)),
  /**
   * A boolean indicating whether to send the changes for review.
   */
  changesNotSentForReview: Joi.boolean(),
  /**
   * The path to the service account key.
   */
  serviceAccountKeyPath: Joi.string(),
});

/**
 * The schema for the iOS submit profile.
 */
export const IosSubmitProfileSchema = Joi.object({
  /**
   * The App Store Connect app ID.
   */
  ascAppId: Joi.string(),
  /**
   * The Apple ID.
   */
  appleId: Joi.string(),
  /**
   * The App Store Connect app identifier.
   */
  ascAppIdentifier: Joi.string(),
  /**
   * The Apple team ID.
   */
  appleTeamId: Joi.string(),
  /**
   * The SKU.
   */
  sku: Joi.string(),
  /**
   * The language.
   */
  language: Joi.string(),
  /**
   * The company name.
   */
  companyName: Joi.string(),
  /**
   * The app name.
   */
  appName: Joi.string(),
});

/**
 * The schema for an unresolved iOS submit profile.
 */
export const UnresolvedIosSubmitProfileSchema = IosSubmitProfileSchema.concat(
  Joi.object({
    /**
     * The name of the profile to extend.
     */
    extends: Joi.string(),
  })
);

/**
 * The schema for a resolved iOS submit profile.
 */
export const ResolvedIosSubmitProfileSchema = UnresolvedIosSubmitProfileSchema;

/**
 * The schema for an unresolved submit profile.
 */
export const UnresolvedSubmitProfileSchema = Joi.object({
  /**
   * The name of the profile to extend.
   */
  extends: Joi.string(),
  /**
   * The Android-specific submit profile properties.
   */
  android: AndroidSubmitProfileSchema,
  /**
   * The iOS-specific submit profile properties.
   */
  ios: UnresolvedIosSubmitProfileSchema,
});
