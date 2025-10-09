import Joi from 'joi';

import { BuildProfileSchema } from './build/schema';
import { UnresolvedSubmitProfileSchema } from './submit/schema';
import { AppVersionSource } from './types';

/**
 * The schema for `eas.json`.
 */
export const EasJsonSchema = Joi.object({
  /**
   * The schema version.
   */
  $schema: Joi.string(),
  /**
   * The CLI configuration.
   */
  cli: Joi.object({
    /**
     * The EAS CLI version.
     */
    version: Joi.string(),
    requireCommit: Joi.boolean(),
    appVersionSource: Joi.string().valid(...Object.values(AppVersionSource)),
    promptToConfigurePushNotifications: Joi.boolean(),
    updateAssetHostOverride: Joi.string(),
    updateManifestHostOverride: Joi.string(),
  }),
  build: Joi.object().pattern(Joi.string(), BuildProfileSchema),
  submit: Joi.object().pattern(Joi.string(), UnresolvedSubmitProfileSchema),
});
