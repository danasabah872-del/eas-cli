import { EasCommandError } from '../commandUtils/errors';

/**
 * This error is thrown when the user tries to build a project with a deprecated job format.
 */
export class TurtleDeprecatedJobFormatError extends EasCommandError {}

/**
 * This error is thrown when the user tries to build a project on the free tier, but the free tier is disabled.
 */
export class EasBuildFreeTierDisabledError extends EasCommandError {}

/**
 * This error is thrown when the user tries to build an iOS project on the free tier, but the free tier is disabled for iOS.
 */
export class EasBuildFreeTierDisabledIOSError extends EasCommandError {}

/**
 * This error is thrown when the user tries to build an Android project on the free tier, but the free tier is disabled for Android.
 */
export class EasBuildFreeTierDisabledAndroidError extends EasCommandError {}

/**
 * This error is thrown when the user tries to build a project on the free tier, but they have exceeded the free tier limit.
 */
export class EasBuildFreeTierLimitExceededError extends EasCommandError {}

/**
 * This error is thrown when the user tries to build an iOS project on the free tier, but they have exceeded the free tier limit for iOS.
 */
export class EasBuildFreeTierIosLimitExceededError extends EasCommandError {}

/**
 * This error is thrown when the user tries to build a project with a resource class that is not available in the free tier.
 */
export class EasBuildResourceClassNotAvailableInFreeTierError extends EasCommandError {}

/**
 * This error is thrown when the user tries to build a project with a legacy resource class that is not available.
 */
export class EasBuildLegacyResourceClassNotAvailableError extends EasCommandError {}

/**
 * This error is thrown when the user tries to build a project with invalid parameters.
 */
export class RequestValidationError extends EasCommandError {}

/**
 * This error is thrown when EAS Build is down for maintenance.
 */
export class EasBuildDownForMaintenanceError extends EasCommandError {}

/**
 * This error is thrown when the user has too many pending builds.
 */
export class EasBuildTooManyPendingBuildsError extends EasCommandError {}

/**
 * This error is thrown when the project archive fails to upload.
 */
export class EasBuildProjectArchiveUploadError extends EasCommandError {}
