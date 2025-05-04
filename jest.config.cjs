// jest.config.cjs
module.exports = {
  // Use JSDOM
  testEnvironment: 'jest-environment-jsdom',

  // Polyfills loaded before anything else
  setupFiles: ['<rootDir>/jest.setup.js'],
  setupFilesAfterEnv: ['<rootDir>/jest.setupAfterEnv.js'],

  // (Optional) If you need global hooks, can also load after env:
  // setupFilesAfterEnv: ['<rootDir>/jest.setupAfterEnv.js'],

  transform: {
    '^.+\\.js$': 'babel-jest'
  },

  moduleFileExtensions: ['js', 'json'],
  collectCoverage: true,
  coverageDirectory: 'coverage'
};
