export default {
  displayName: 'mto_api',
  preset: '../../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.(ts|js)$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.json',
        isolatedModules: true,
      },
    ],
  },
  transformIgnorePatterns: ['node_modules/'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  coverageDirectory: '../../../coverage/backend/plugins/mto_api',
  testMatch: ['**/__tests__/**/*.test.ts'],
  moduleNameMapper: {
    '^~/(.*)$': '<rootDir>/src/$1',
    '^@/(.*)$': '<rootDir>/src/modules/$1',
    '^erxes-api-shared/(.*)$': '<rootDir>/../../erxes-api-shared/src/$1',
    '^file-type/core$': '<rootDir>/src/__mocks__/file-type.ts',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,js}',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
    '!src/main.ts',
  ],
};
