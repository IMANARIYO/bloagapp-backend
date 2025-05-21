// jest.config.js
export default {
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  transform: {},
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  // Allow all files in the project to be treated as ESM
  transformIgnorePatterns: [],
  // Set testMatch to find your test files
  testMatch: ['**/test/**/*.test.js'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    'authentication/**/*.js',
    'controllers/**/*.js',
    'middlewares/**/*.js',
    'models/**/*.js',
    'utils/**/*.js',
    '!**/node_modules/**',
    '!**/vendor/**'
  ],
  verbose: true,
  clearMocks: true,
  maxWorkers: '50%'
}
