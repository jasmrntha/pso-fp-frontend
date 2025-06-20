// eslint-disable-next-line @typescript-eslint/no-var-requires
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  // Add more setup options before each test is run
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  // if using TypeScript with a baseUrl set to the root directory then you need the below for alias' to work
  moduleDirectories: ['node_modules', '<rootDir>/'],

  testEnvironment: 'jest-environment-jsdom',

  /**
   * Absolute imports and Module Path Aliases
   */
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^~/(.*)$': '<rootDir>/public/$1',
    '^swiper/react$': '<rootDir>/src/__mocks__/swiperReactMock.tsx',
    '^swiper/modules$': '<rootDir>/src/__mocks__/swiperModulesMock.tsx',
    '^swiper/css$': 'identity-obj-proxy',
    '^swiper/css/pagination$': 'identity-obj-proxy',
  },

  collectCoverageFrom: [
    'src/pages/404.page.tsx',
    'src/pages/dashboard/**/*.{ts,tsx}',
    '!src/pages/dashboard/recipes/**/*.{ts,tsx}',
    'src/pages/recipe/**/*.{ts,tsx}',
    'src/pages/index.page.tsx',
  ],
  // testPathIgnorePatterns: ['<rootDir>/src/**/*.test.tsx', '<rootDir>/src/**/*.spec.tsx'],
  collectCoverage: true,
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
