import assert from 'assert';

import { getExpoApiBaseUrl, getExpoWebsiteBaseUrl } from '../../api';
import { AppPlatform, BuildFragment } from '../../graphql/generated';

/**
 * Get the URL of the project dashboard.
 * @param accountName The name of the account.
 * @param projectName The name of the project.
 * @returns The URL of the project dashboard.
 */
export function getProjectDashboardUrl(accountName: string, projectName: string): string {
  return new URL(
    `/accounts/${accountName}/projects/${projectName}`,
    getExpoWebsiteBaseUrl()
  ).toString();
}

/**
 * Get the URL of the build logs.
 * @param build The build.
 * @param hash The hash of the logs to link to.
 * @returns The URL of the build logs.
 */
export function getBuildLogsUrl(build: BuildFragment, hash?: string): string {
  const { project } = build;
  const url =
    project.__typename !== 'App'
      ? `/builds/${build.id}`
      : `/accounts/${project.ownerAccount.name}/projects/${project.slug}/builds/${build.id}${
          hash ? `#${hash}` : ''
        }`;

  return new URL(url, getExpoWebsiteBaseUrl()).toString();
}

/**
 * Get the URL of an artifact.
 * @param artifactId The ID of the artifact.
 * @returns The URL of the artifact.
 */
export function getArtifactUrl(artifactId: string): string {
  return new URL(`/artifacts/${artifactId}`, getExpoWebsiteBaseUrl()).toString();
}

/**
 * Get the URL of the internal distribution install page.
 * @param build The build.
 * @returns The URL of the internal distribution install page.
 */
export function getInternalDistributionInstallUrl(build: BuildFragment): string {
  if (build.platform === AppPlatform.Ios) {
    return `itms-services://?action=download-manifest;url=${getExpoApiBaseUrl()}/v2/projects/${
      build.project.id
    }/builds/${build.id}/manifest.plist`;
  }

  assert(build.artifacts?.buildUrl, 'buildUrl is missing');

  return build.artifacts.buildUrl;
}

/**
 * Get the URL of an update group.
 * @param accountName The name of the account.
 * @param projectName The name of the project.
 * @param updateGroupId The ID of the update group.
 * @returns The URL of the update group.
 */
export function getUpdateGroupUrl(
  accountName: string,
  projectName: string,
  updateGroupId: string
): string {
  return new URL(
    `/accounts/${encodeURIComponent(accountName)}/projects/${encodeURIComponent(
      projectName
    )}/updates/${encodeURIComponent(updateGroupId)}`,
    getExpoWebsiteBaseUrl()
  ).toString();
}

/**
 * Get the URL of a workflow run.
 * @param accountName The name of the account.
 * @param projectName The name of the project.
 * @param workflowRunId The ID of the workflow run.
 * @returns The URL of the workflow run.
 */
export function getWorkflowRunUrl(
  accountName: string,
  projectName: string,
  workflowRunId: string
): string {
  return new URL(
    `/accounts/${encodeURIComponent(accountName)}/projects/${encodeURIComponent(
      projectName
    )}/workflows/${workflowRunId}`,
    getExpoWebsiteBaseUrl()
  ).toString();
}

/**
 * Get the URL of the project's GitHub settings.
 * @param accountName The name of the account.
 * @param projectName The name of the project.
 * @returns The URL of the project's GitHub settings.
 */
export function getProjectGitHubSettingsUrl(accountName: string, projectName: string): string {
  return new URL(
    `/accounts/${encodeURIComponent(accountName)}/projects/${encodeURIComponent(
      projectName
    )}/github`,
    getExpoWebsiteBaseUrl()
  ).toString();
}

/**
 * Get the URL of the hosting deployments.
 * @param accountName The name of the account.
 * @param projectName The name of the project.
 * @returns The URL of the hosting deployments.
 */
export function getHostingDeploymentsUrl(accountName: string, projectName: string): string {
  return new URL(
    `/accounts/${encodeURIComponent(accountName)}/projects/${encodeURIComponent(
      projectName
    )}/hosting/deployments`,
    getExpoWebsiteBaseUrl()
  ).toString();
}
