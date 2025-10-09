import { Platform, Workflow } from '@expo/eas-build-job';
import { vol } from 'memfs';
import envinfo from 'envinfo';

import { mockCommandContext, mockTestCommand } from './utils';
import Diagnostics from '../../commands/diagnostics';
import Log from '../../log';
import * as workflow from '../../project/workflow';
import { Client } from '../../vcs/vcs';

jest.mock('envinfo');
jest.mock('../../log');
jest.mock('../../ora');
jest.mock('fs');

const mockVcsClient: jest.Mocked<Client> = {
  makeShallowCopyAsync: jest.fn(),
  getRootPathAsync: jest.fn().mockResolvedValue('/project'),
  getBranchNameAsync: jest.fn(),
  getCommitHashAsync: jest.fn(),
  getLastCommitMessageAsync: jest.fn(),
  isFileIgnoredAsync: jest.fn(),
  trackFileAsync: jest.fn(),
  isCommitRequiredAsync: jest.fn(),
  hasUncommittedChangesAsync: jest.fn(),
  canGetLastCommitMessage: jest.fn().mockReturnValue(true),
  ensureRepoExistsAsync: jest.fn(),
  commitAsync: jest.fn(),
  showDiffAsync: jest.fn(),
  showChangedFilesAsync: jest.fn(),
};

describe(Diagnostics, () => {
  beforeEach(() => {
    vol.reset();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('runs diagnostics and succeeds', async () => {
    jest.spyOn(workflow, 'resolveWorkflowAsync').mockResolvedValue(Workflow.GENERIC);
    jest.mocked(envinfo.run).mockResolvedValue('mock env info');

    const ctx = mockCommandContext(Diagnostics, {});
    ctx.vcsClient = mockVcsClient;

    vol.fromJSON(
      {
        'package.json': JSON.stringify({ name: 'my-app', version: '1.0.0' }),
        'app.json': JSON.stringify({ expo: { name: 'my-app' } }),
      },
      ctx.projectDir
    );

    const command = mockTestCommand(Diagnostics, [], ctx);
    await expect(command.run()).resolves.not.toThrow();
  });

  it('prints environment information', async () => {
    jest.spyOn(workflow, 'resolveWorkflowAsync').mockResolvedValue(Workflow.GENERIC);
    const mockEnvInfo = 'mock env info';
    jest.mocked(envinfo.run).mockResolvedValue(mockEnvInfo);

    const ctx = mockCommandContext(Diagnostics, {});
    ctx.vcsClient = mockVcsClient;

    vol.fromJSON(
      {
        'package.json': JSON.stringify({ name: 'my-app', version: '1.0.0' }),
        'app.json': JSON.stringify({ expo: { name: 'my-app' } }),
      },
      ctx.projectDir
    );

    const command = mockTestCommand(Diagnostics, [], ctx);
    await command.run();

    expect(envinfo.run).toHaveBeenCalled();
    expect(Log.log).toHaveBeenCalledWith(mockEnvInfo.trimEnd());
  });

  it('prints the project workflow when workflows are different', async () => {
    jest
      .spyOn(workflow, 'resolveWorkflowAsync')
      .mockImplementation(async (_, platform) => {
        if (platform === Platform.ANDROID) {
          return Workflow.GENERIC;
        } else {
          return Workflow.MANAGED;
        }
      });
    jest.mocked(envinfo.run).mockResolvedValue('mock env info');

    const ctx = mockCommandContext(Diagnostics, {});
    ctx.vcsClient = mockVcsClient;

    vol.fromJSON(
      {
        'package.json': JSON.stringify({ name: 'my-app', version: '1.0.0' }),
        'app.json': JSON.stringify({ expo: { name: 'my-app' } }),
      },
      ctx.projectDir
    );

    const command = mockTestCommand(Diagnostics, [], ctx);
    await command.run();

    expect(Log.log).toHaveBeenCalledWith('    Project workflow:');
    expect(Log.log).toHaveBeenCalledWith('      Android: generic');
    expect(Log.log).toHaveBeenCalledWith('      iOS: managed');
  });

  it('prints the project workflow when workflows are the same', async () => {
    jest.spyOn(workflow, 'resolveWorkflowAsync').mockResolvedValue(Workflow.GENERIC);
    jest.mocked(envinfo.run).mockResolvedValue('mock env info');

    const ctx = mockCommandContext(Diagnostics, {});
    ctx.vcsClient = mockVcsClient;

    vol.fromJSON(
      {
        'package.json': JSON.stringify({ name: 'my-app', version: '1.0.0' }),
        'app.json': JSON.stringify({ expo: { name: 'my-app' } }),
      },
      ctx.projectDir
    );

    const command = mockTestCommand(Diagnostics, [], ctx);
    await command.run();

    expect(Log.log).toHaveBeenCalledWith('    Project workflow: generic');
  });
});
