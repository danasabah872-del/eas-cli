import { Platform } from '@expo/eas-build-job';
import envString from 'env-string';

import { AndroidSubmitProfileSchema, ResolvedIosSubmitProfileSchema } from './schema';
import {
  AndroidSubmitProfileFieldsToEvaluate,
  IosSubmitProfileFieldsToEvaluate,
  SubmitProfile,
} from './types';
import { MissingParentProfileError, MissingProfileError } from '../errors';
import { EasJson } from '../types';

/**
 * Resolves a submit profile by merging it with its parent profile and the default profile.
 * @param easJson - The `eas.json` object.
 * @param platform - The platform to resolve the profile for.
 * @param profileName - The name of the profile to resolve.
 * @returns The resolved submit profile.
 */
export function resolveSubmitProfile<T extends Platform>({
  easJson,
  platform,
  profileName,
}: {
  easJson: EasJson;
  platform: T;
  profileName?: string;
}): SubmitProfile<T> {
  try {
    const submitProfile = resolveProfile({
      easJson,
      platform,
      profileName: profileName ?? 'production',
    });
    const unevaluatedProfile = mergeProfiles(getDefaultProfile(platform), submitProfile);
    return evaluateFields(platform, unevaluatedProfile);
  } catch (err: any) {
    if (err instanceof MissingProfileError && !profileName) {
      return getDefaultProfile(platform);
    } else {
      throw err;
    }
  }
}

/**
 * Resolves a profile by recursively merging it with its parent profiles.
 * @param platform - The platform to resolve the profile for.
 * @param easJson - The `eas.json` object.
 * @param profileName - The name of the profile to resolve.
 * @param depth - The current depth of the recursion.
 * @returns The resolved submit profile.
 */
function resolveProfile<T extends Platform>({
  easJson,
  profileName,
  depth = 0,
  platform,
}: {
  platform: T;
  easJson: EasJson;
  profileName: string;
  depth?: number;
}): SubmitProfile<T> | undefined {
  if (depth >= 5) {
    throw new Error(
      'Too long chain of profile extensions, make sure "extends" keys do not make a cycle'
    );
  }

  const profile = easJson.submit?.[profileName];
  if (!profile) {
    if (depth === 0) {
      throw new MissingProfileError(`Missing submit profile in eas.json: ${profileName}`);
    } else {
      throw new MissingParentProfileError(
        `Extending non-existent submit profile in eas.json: ${profileName}`
      );
    }
  }

  const { extends: baseProfileName, ...rest } = profile;
  const platformProfile = rest[platform] as SubmitProfile<T> | undefined;
  if (baseProfileName) {
    const baseProfile = resolveProfile({
      easJson,
      platform,
      profileName: baseProfileName,
      depth: depth + 1,
    });
    return mergeProfiles(baseProfile, platformProfile);
  } else {
    return platformProfile;
  }
}

/**
 * Merges two submit profiles.
 * @param base - The base profile.
 * @param update - The profile to merge with the base profile.
 * @returns The merged profile.
 */
function mergeProfiles<T extends Platform>(
  base: SubmitProfile<T>,
  update?: SubmitProfile<T>
): SubmitProfile<T>;
function mergeProfiles<T extends Platform>(
  base?: SubmitProfile<T>,
  update?: SubmitProfile<T>
): SubmitProfile<T> | undefined;
function mergeProfiles<T extends Platform>(
  base?: SubmitProfile<T>,
  update?: Submit-Profile<T>
): SubmitProfile<T> | undefined {
  if (!update) {
    return base;
  }
  return { ...base, ...update };
}

/**
 * Gets the default submit profile for a given platform.
 * @param platform - The platform to get the default profile for.
 * @returns The default submit profile.
 */
export function getDefaultProfile<T extends Platform>(platform: T): SubmitProfile<T> {
  const Schema =
    platform === Platform.ANDROID ? AndroidSubmitProfileSchema : ResolvedIosSubmitProfileSchema;
  return Schema.validate({}, { allowUnknown: false, abortEarly: false, convert: true }).value;
}

/**
 * Evaluates the fields of a submit profile that can contain environment variables.
 * @param platform - The platform to evaluate the profile for.
 * @param profile - The profile to evaluate.
 * @returns The evaluated profile.
 */
function evaluateFields<T extends Platform>(
  platform: T,
  profile: SubmitProfile<T>
): SubmitProfile<T> {
  const fields =
    platform === Platform.ANDROID
      ? AndroidSubmitProfileFieldsToEvaluate
      : IosSubmitProfileFieldsToEvaluate;
  const evaluatedProfile = { ...profile };
  for (const field of fields) {
    if (field in evaluatedProfile) {
      // @ts-ignore
      evaluatedProfile[field] = envString(evaluatedProfile[field], process.env);
    }
  }
  return evaluatedProfile;
}
