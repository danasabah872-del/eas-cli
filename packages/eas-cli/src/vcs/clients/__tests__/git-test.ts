import * as PackageManagerUtils from '@expo/package-manager';
import spawnAsync from '@expo/spawn-async';
import { vol } from 'memfs';

import { confirmAsync, promptAsync } from '../../../prompts';
import { doesGitRepoExistAsync, isGitInstalledAsync } from '../../git';
import GitClient from '../git';

jest.mock('@expo/spawn-async');
jest.mock('fs');
jest.mock('../../git');
jest.mock('../../../prompts');
jest.mock('@expo/package-manager');

describe('GitClient', () => {
  afterEach(() => {
    vol.reset();
  });

  describe('ensureRepoExistsAsync', () => {
    it('should not do anything if git is installed and a git repo exists', async () => {
      (isGitInstalledAsync as jest.Mock).mockResolvedValue(true);
      (doesGitRepoExistAsync as jest.Mock).mockResolvedValue(true);
      const client = new GitClient({
        requireCommit: false,
      });
      await client.ensureRepoExistsAsync();
      expect(spawnAsync).not.toHaveBeenCalled();
    });

    it('should initialize a git repo if git is installed but a git repo does not exist', async () => {
      const projectDir = '/app';
      vol.fromJSON(
        {
          'package.json': JSON.stringify({}),
          'eas.json': JSON.stringify({}),
        },
        projectDir
      );
      (isGitInstalledAsync as jest.Mock).mockResolvedValue(true);
      (doesGitRepoExistAsync as jest.Mock).mockResolvedValue(false);
      (confirmAsync as jest.Mock).mockResolvedValue(true);
      (promptAsync as jest.Mock).mockResolvedValue({
        message: 'Initial commit',
      });
      (PackageManagerUtils.resolveWorkspaceRoot as jest.Mock).mockReturnValue(projectDir);
      const client = new GitClient({
        requireCommit: false,
      });

      await client.ensureRepoExistsAsync();

      expect(spawnAsync).toHaveBeenCalledWith('git', ['init'], expect.anything());
      expect(spawnAsync).toHaveBeenCalledWith('git', ['add', '-A'], expect.anything());
      expect(spawnAsync).toHaveBeenCalledWith('git', ['commit', '-m', 'Initial commit'], expect.anything());
    });
  });
});
