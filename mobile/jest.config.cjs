module.exports = {
  preset: 'jest-expo',
  setupFiles: ['<rootDir>/jest.env.cjs'],
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/src/$1' },
  testMatch: ['**/*.test.ts', '**/*.test.tsx'],
};
