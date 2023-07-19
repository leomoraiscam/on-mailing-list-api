module.exports = {
  preset: '@shelf/jest-mongodb',
  roots: ['<rootDir>/tests'],
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!**/tests/**',
    '!**/config/**',
  ],
  testEnvironment: 'node',
  transform: {
    '.+\\.ts$': 'ts-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/tests(.*)$': '<rootDir>/tests/$1',
  },
  setupFiles: ['dotenv/config']
};
