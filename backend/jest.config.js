export const testEnvironment = 'node';
export const testMatch = [
  '**/tests/**/*.test.js',
  '**/__tests__/**/*.js',
  '**/?(*.)+(spec|test).js'
];
export const collectCoverageFrom = [
  'models/**/*.js',
  'routes/**/*.js',
  'middleware/**/*.js',
  'config/**/*.js',
  '!**/node_modules/**',
  '!**/tests/**',
  '!**/coverage/**'
];
export const coverageDirectory = 'coverage';
export const coverageReporters = ['text', 'lcov', 'html'];
export const setupFilesAfterEnv = ['<rootDir>/tests/setup.js'];
export const testTimeout = 10000;
export const verbose = true;
export const forceExit = true;
export const clearMocks = true;
export const resetMocks = true;
export const restoreMocks = true;