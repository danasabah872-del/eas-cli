import { Errors } from '@oclif/core';

import { getMockEasJson, mockCommandContext, mockTestCommand } from './utils';
import Submit from '../../commands/submit';
import { selectRequestedPlatformAsync } from '../../platform';
import { createSubmissionContextAsync } from '../../submit/context';
import { submitAsync, waitToCompleteAsync } from '../../submit/submit';
import { getProfilesAsync } from '../../utils/profiles';

jest.mock('../../platform');
jest.mock('../../submit/context');
jest.mock('../../submit/submit');
jest.mock('../../utils/profiles');

describe(Submit, () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('throws an error if --what-to-test is used for android', async () => {
    const ctx = mockCommandContext(Submit, {
      easJson: getMockEasJson(),
    });
    const cmd = mockTestCommand(Submit, ['--platform', 'android', '--what-to-test', 'test'], ctx);
    const error = await cmd.run().catch(err => err);
    expect(error).toBeInstanceOf(Errors.ExitError);
    expect(error.message).toBe('--what-to-test is only supported for iOS submissions.');
    expect(selectRequestedPlatformAsync).not.toHaveBeenCalled();
    expect(getProfilesAsync).not.toHaveBeenCalled();
    expect(createSubmissionContextAsync).not.toHaveBeenCalled();
    expect(submitAsync).not.toHaveBeenCalled();
    expect(waitToCompleteAsync).not.toHaveBeenCalled();
  });

  it('throws an error if --groups is used for android', async () => {
    const ctx = mockCommandContext(Submit, {
      easJson: getMockEasJson(),
    });
    const cmd = mockTestCommand(Submit, ['--platform', 'android', '--groups', 'test-group'], ctx);
    const error = await cmd.run().catch(err => err);
    expect(error).toBeInstanceOf(Errors.ExitError);
    expect(error.message).toBe('--groups is only supported for iOS submissions.');
    expect(selectRequestedPlatformAsync).not.toHaveBeenCalled();
    expect(getProfilesAsync).not.toHaveBeenCalled();
    expect(createSubmissionContextAsync).not.toHaveBeenCalled();
    expect(submitAsync).not.toHaveBeenCalled();
    expect(waitToCompleteAsync).not.toHaveBeenCalled();
  });
});
