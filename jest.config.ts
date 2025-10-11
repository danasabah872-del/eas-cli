import type { Config } from 'jest';

const config: Config = {
  projects: [
    '<rootDir>/packages/social-media-app-backend/jest.config.ts',
    '<rootDir>/packages/social-media-app-frontend/jest.config.ts',
  ],
  watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'],
};

export default config;
