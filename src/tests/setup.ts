import { resetDb } from "tests/utils/reset-db";
import orchestrator from "tests/orchestrator";

beforeEach(async () => {
  await resetDb();
});
