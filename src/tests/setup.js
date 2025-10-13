import "@testing-library/jest-dom";
import { resetDb } from "tests/utils/reset-db";
import { fetch, Headers, Request, Response } from "@whatwg-node/fetch";

// Make fetch available globally
global.fetch = fetch;
global.Headers = Headers;
global.Request = Request;
global.Response = Response;

beforeEach(async () => {
  await resetDb();
});
