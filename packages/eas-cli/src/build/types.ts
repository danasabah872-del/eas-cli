import { ResourceClass } from '@expo/eas-json';
import { LoggerLevel } from '@expo/logger';

import { LocalBuildOptions } from './local';
import { RequestedPlatform } from '../platform';

/**
 * The status of a build.
 */
export enum BuildStatus {
  /**
   * The build has been created, but it has not been queued yet.
   */
  NEW = 'new',
  /**
   * The build is in the queue.
   */
  IN_QUEUE = 'in-queue',
  /**
   * The build is in progress.
   */
  IN_PROGRESS = 'in-progress',
  /**
   * The build is pending cancellation.
   */
  PENDING_CANCEL = 'pending-cancel',
  /**
   * The build has errored.
   */
  ERRORED = 'errored',
  /**
   * The build has finished.
   */
  FINISHED = 'finished',
  /**
   * The build has been canceled.
   */
  CANCELED = 'canceled',
}

/**
 * The distribution type of a build.
 */
export enum BuildDistributionType {
  /**
   * A build for the app store.
   */
  STORE = 'store',
  /**
   * An internal build.
   */
  INTERNAL = 'internal',
  /** @deprecated Use simulator flag instead */
  SIMULATOR = 'simulator',
}

/**
 * The flags for a build.
 */
export interface BuildFlags {
  /**
   * The requested platform.
   */
  requestedPlatform: RequestedPlatform;
  /**
   * The build profile.
   */
  profile?: string;
  /**
   * Whether to run in non-interactive mode.
   */
  nonInteractive: boolean;
  /**
   * Whether to wait for the build to complete.
   */
  wait: boolean;
  /**
   * Whether to clear the cache.
   */
  clearCache: boolean;
  /**
   * Whether to output in JSON format.
   */
  json: boolean;
  /**
   * Whether to automatically submit the build.
   */
  autoSubmit: boolean;
  /**
   * The submit profile.
   */
  submitProfile?: string;
  /**
   * The local build options.
   */
  localBuildOptions: LocalBuildOptions;
  /**
   * The resource class.
   */
  resourceClass?: ResourceClass;
  /**
   * The build message.
   */
  message?: string;
  /**
   * The build logger level.
   */
  buildLoggerLevel?: LoggerLevel;
  /**
   * Whether to freeze the credentials.
   */
  freezeCredentials: boolean;
}
