import type {Config} from '@jest/types';

// Sync object
const config: Config.InitialOptions = {
  verbose: true,
  testEnvironment: "node",
  testMatch: ["<rootDir>/dist/**/*.test.js"],
  moduleFileExtensions: ["js", "jsx", "json"],
  testPathIgnorePatterns: ["node_modules/", "__tests__setup__"],
  globalSetup: "<rootDir>/dist/__tests__setup__/setup.js",
  globalTeardown: "<rootDir>/dist/__tests__setup__/teardown.js",
  collectCoverageFrom: [
    "**/*.{js,jsx,ts,tsx}",
    "!**/node_modules/**",
    "!**/cron/**",
    "!**/algolia/**",
    "!**/db/**",
    "!**/adrev/**",
    "!**/avatar/**",
    "!**/aws/**",
    "!**/cloudinary/**",
    "!**/googleSheets/**",
    "!**/slack/**",
    "!**/song/**",
    "!**/Spinner/**",
    "!**/entities/**",
    "!**/types/**",
    "!**/typeDefs/**",
    "!**/migrations/**",
    "!**/resolvers/**",
    "!**/coverage/**",
    "!**/utils/**",
    "!**/__tests__setup__/**",
  ],
  testRunner: "jest-circus/runner",
};
export default config;
