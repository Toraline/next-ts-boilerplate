import nextJest from "next/jest";
import dotenv from "dotenv";

dotenv.config();

const createJestConfig = nextJest();
const customJestConfig = createJestConfig({
  moduleDirectories: ["node_modules", "<rootDir>/src"],
  testTimeout: 60000,
});

export default customJestConfig;
