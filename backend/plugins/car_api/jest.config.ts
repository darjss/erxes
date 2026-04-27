export default {
  displayName: 'car_api',
  preset: '../../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.(ts|js)$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.json',
      },
    ],
  },
  transformIgnorePatterns: ['node_modules/'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  coverageDirectory: '../../../coverage/backend/plugins/car_api',
  testMatch: ['**/__tests__/**/*.test.ts'],
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  moduleNameMapper: {
    '^~/(.*)$': '<rootDir>/src/$1',
    '^@/(.*)$': '<rootDir>/src/modules/$1',
    '^erxes-api-shared/(.*)$': '<rootDir>/../../erxes-api-shared/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,js}',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
    '!src/main.ts',
  ],
};
