export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'tsx', 'js'],
    transform: {
      '^.+\\.tsx?$': 'ts-jest',
    },
    testMatch: ['**/__tests__/**/*.test.ts'],
    collectCoverage: false,
    coverageDirectory: 'coverage',
    coverageReporters: ['json', 'lcov', 'text', 'clover'],
  };
  