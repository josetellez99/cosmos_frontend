import "@testing-library/jest-dom/vitest";
import { server } from "./mocks/server";

// Start MSW server before all tests in every test file
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));

// Reset any per-test handlers so they don't leak between tests
afterEach(() => server.resetHandlers());

// Shut down the server after all tests finish
afterAll(() => server.close());
