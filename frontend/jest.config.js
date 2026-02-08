const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  collectCoverageFrom: [
    'presentation/hooks/usePermission.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 66,
      lines: 100,
      statements: 90,
    },
  },
}

module.exports = createJestConfig(customJestConfig)
