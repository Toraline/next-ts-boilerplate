import nextJest from "next/jest";
import dotenv from "dotenv";

dotenv.config();

const createJestConfig = nextJest();
const customJestConfig = createJestConfig({});

export default customJestConfig;
