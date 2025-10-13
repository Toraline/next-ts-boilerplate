import nextJest from "next/jest.js";
import dotenv from "dotenv";

dotenv.config();

const createJestConfig = nextJest();
const customJestConfig = createJestConfig({
  setupFilesAfterEnv: ["<rootDir>/src/tests/setup.js"],
  moduleDirectories: ["node_modules", "<rootDir>/src"],
  testTimeout: 60000,
  clearMocks: true,
  testEnvironment: "jsdom",
  globals: {
    TextEncoder: require("util").TextEncoder,
    TextDecoder: require("util").TextDecoder,
  },
});

export default customJestConfig;
