import spawnAsync from '@expo/spawn-async';
import { vol } from 'memfs';

import { runLocalBuildAsync } from '../local';

jest.mock('@expo/spawn-async', () => jest.fn(() => ({ stdout: '8.0.0' })));
jest.mock('fs');

describe(runLocalBuildAsync, () => {
  afterEach(() => {
    vol.reset();
  });

  it('runs local build', async () => {
    const projectDir = '/app';
    vol.fromJSON(
      {
        'package.json': JSON.stringify({}),
        'eas.json': JSON.stringify({}),
      },
      projectDir
    );

    await runLocalBuildAsync(
      {} as any,
      {} as any,
      {
        verbose: true,
      },
      {}
    );

    expect(spawnAsync).toHaveBeenCalledWith(
      'npx',
      ['-y', 'eas-cli-local-build-plugin@1.0.171', expect.any(String)],
      expect.anything()
    );
  });
});
