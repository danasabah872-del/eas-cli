import {
  ArchiveSource,
  ArchiveSourceType,
  BuildMode,
  BuildTrigger,
  FingerprintSourceType,
  Metadata,
  Workflow,
} from '@expo/eas-build-job';
import { LoggerLevel } from '@expo/logger';
import assert from 'assert';

import {
  BuildCredentialsSource,
  BuildIosEnterpriseProvisioning,
  BuildMetadataInput,
  BuildWorkflow,
  DistributionType,
  FingerprintSourceInput,
  BuildMode as GraphQLBuildMode,
  BuildTrigger as GraphQLBuildTrigger,
  FingerprintSourceType as GraphQLFingeprintSourceType,
  ProjectArchiveSourceInput,
  ProjectArchiveSourceType,
  WorkerLoggerLevel,
} from '../graphql/generated';

/**
 * Transform the project archive source to a GraphQL input.
 * @param archiveSource The project archive source.
 * @returns The GraphQL input.
 */
export function transformProjectArchive(archiveSource: ArchiveSource): ProjectArchiveSourceInput {
  if (archiveSource.type === ArchiveSourceType.GCS) {
    return {
      type: ProjectArchiveSourceType.Gcs,
      bucketKey: archiveSource.bucketKey,
      metadataLocation: archiveSource.metadataLocation,
    };
  } else if (archiveSource.type === ArchiveSourceType.URL) {
    return {
      type: ProjectArchiveSourceType.Url,
      url: archiveSource.url,
    };
  } else {
    throw new Error(`Unsupported project archive source type: '${archiveSource.type}'`);
  }
}

/**
 * Transform the build metadata to a GraphQL input.
 * @param metadata The build metadata.
 * @returns The GraphQL input.
 */
export function transformMetadata(metadata: Metadata): BuildMetadataInput {
  return {
    ...metadata,
    fingerprintSource:
      metadata.fingerprintSource && transformFingerprintSource(metadata.fingerprintSource),
    credentialsSource:
      metadata.credentialsSource && transformCredentialsSource(metadata.credentialsSource),
    distribution: metadata.distribution && transformDistribution(metadata.distribution),
    workflow: metadata.workflow && transformWorkflow(metadata.workflow),
    iosEnterpriseProvisioning:
      metadata.iosEnterpriseProvisioning &&
      transformIosEnterpriseProvisioning(metadata.iosEnterpriseProvisioning),
  };
}

/**
 * Transform the fingerprint source to a GraphQL input.
 * @param fingerprintSource The fingerprint source.
 * @returns The GraphQL input.
 */
export function transformFingerprintSource(
  fingerprintSource: NonNullable<Metadata['fingerprintSource']>
): FingerprintSourceInput | null {
  if (fingerprintSource.type !== FingerprintSourceType.GCS) {
    return null;
  }

  return {
    type: GraphQLFingeprintSourceType.Gcs,
    bucketKey: fingerprintSource.bucketKey,
    isDebugFingerprint: fingerprintSource.isDebugFingerprint,
  };
}

function transformCredentialsSource(
  credentialsSource: Metadata['credentialsSource']
): BuildCredentialsSource {
  if (credentialsSource === 'local') {
    return BuildCredentialsSource.Local;
  } else {
    return BuildCredentialsSource.Remote;
  }
}

function transformDistribution(distribution: Metadata['distribution']): DistributionType {
  if (distribution === 'internal') {
    return DistributionType.Internal;
  } else if (distribution === 'simulator') {
    return DistributionType.Simulator;
  } else {
    return DistributionType.Store;
  }
}

/**
 * Transform the workflow to a GraphQL input.
 * @param workflow The workflow.
 * @returns The GraphQL input.
 */
export function transformWorkflow(workflow: Workflow): BuildWorkflow {
  if (workflow === Workflow.GENERIC) {
    return BuildWorkflow.Generic;
  } else {
    return BuildWorkflow.Managed;
  }
}

/**
 * Transform the iOS enterprise provisioning to a GraphQL input.
 * @param enterpriseProvisioning The iOS enterprise provisioning.
 * @returns The GraphQL input.
 */
export function transformIosEnterpriseProvisioning(
  enterpriseProvisioning: Metadata['iosEnterpriseProvisioning']
): BuildIosEnterpriseProvisioning {
  if (enterpriseProvisioning === 'adhoc') {
    return BuildIosEnterpriseProvisioning.Adhoc;
  } else {
    return BuildIosEnterpriseProvisioning.Universal;
  }
}

const buildModeToGraphQLBuildMode: Record<BuildMode, GraphQLBuildMode> = {
  [BuildMode.BUILD]: GraphQLBuildMode.Build,
  [BuildMode.CUSTOM]: GraphQLBuildMode.Custom,
  [BuildMode.RESIGN]: GraphQLBuildMode.Resign,
  [BuildMode.REPACK]: GraphQLBuildMode.Repack,
};

export function transformBuildMode(buildMode: BuildMode): GraphQLBuildMode {
  const graphQLBuildMode = buildModeToGraphQLBuildMode[buildMode];
  assert(graphQLBuildMode, `Unsupported build mode: ${buildMode}`);
  return graphQLBuildMode;
}

/**
 * Transform the build trigger to a GraphQL input.
 * @param buildTrigger The build trigger.
 * @returns The GraphQL input.
 */
export function transformBuildTrigger(buildTrigger: BuildTrigger): GraphQLBuildTrigger {
  if (buildTrigger === BuildTrigger.EAS_CLI) {
    return GraphQLBuildTrigger.EasCli;
  } else if (buildTrigger === BuildTrigger.GIT_BASED_INTEGRATION) {
    return GraphQLBuildTrigger.GitBasedIntegration;
  }
  throw new Error('Unknown build trigger');
}

/**
 * A map of logger levels to GraphQL worker logger levels.
 */
export const loggerLevelToGraphQLWorkerLoggerLevel: Record<LoggerLevel, WorkerLoggerLevel> = {
  [LoggerLevel.TRACE]: WorkerLoggerLevel.Trace,
  [LoggerLevel.DEBUG]: WorkerLoggerLevel.Debug,
  [LoggerLevel.INFO]: WorkerLoggerLevel.Info,
  [LoggerLevel.WARN]: WorkerLoggerLevel.Warn,
  [LoggerLevel.ERROR]: WorkerLoggerLevel.Error,
  [LoggerLevel.FATAL]: WorkerLoggerLevel.Fatal,
};
