// jest.config.ts
import type { Config } from "@jest/types";

// Sync object
const config: Config.InitialOptions = {
  verbose: true,
  preset: "ts-jest",
  testEnvironment: "node",
  clearMocks: true,
  testMatch: ["**/__tests__/**/*.test.ts", "**/__tests__/**/*.unit.ts"],
  modulePathIgnorePatterns: ["node_modules", ".git"],
  collectCoverage: true,
  coverageReporters: ["json", "html", "text"],
  collectCoverageFrom: [
    "./src/**",
    "!**/node_modules/**",
    "!**/build/**",
    "!./src/@types/**",
    "!./src/interfaces/**",
    "!./src/dump/**",
    "!./src/index.ts",
    "!./src/config/index.ts",
  ],
  coverageDirectory: "./__tests__/coverage",
  setupFilesAfterEnv: ["<rootDir>/__tests__/jest.setup.ts"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
};

export default config;
