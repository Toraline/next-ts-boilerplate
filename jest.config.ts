import nextJest from "next/jest";
import dotenv from "dotenv";

dotenv.config();

const createJestConfig = nextJest();
const customJestConfig = createJestConfig({
  setupFilesAfterEnv: ["<rootDir>/src/tests/setup.ts"],
  moduleDirectories: ["node_modules", "<rootDir>/src"],
  testTimeout: 60000,
  clearMocks: true,
});

export default customJestConfig;
