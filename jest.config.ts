import type { Config } from '@jest/types'

const config : Config.InitialOptions={
    preset: 'ts-jest',
    testEnvironment: 'node',
    verbose: true
}

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': 'ts-jest', // Transform TypeScript files using ts-jest
  },
  moduleFileExtensions: ['js', 'ts'], // Extend module file extensions to include TypeScript
  collectCoverage: true,
    coverageThreshold: {
      global: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80,
      },
    },
};

export default config