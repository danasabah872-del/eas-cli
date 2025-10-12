import { Client } from '../vcs/vcs';

/**
 * Get the default branch name for a project.
 * @param vcsClient the vcs client
 * @returns the default branch name
 */
export async function getDefaultBranchNameAsync(vcsClient: Client): Promise<string | null> {
  return await vcsClient.getBranchNameAsync();
}

/**
 * An error that is thrown when a branch is not found.
 */
export class BranchNotFoundError extends Error {
  constructor(message?: string) {
    super(message ?? 'Branch not found.');
  }
}
