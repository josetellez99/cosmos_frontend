import { setupServer } from "msw/node";
import { handlers } from "./handlers";

// Create a server with default handlers for common auth endpoints.
// Individual tests can override these with server.use() to simulate errors.
// After each test, server.resetHandlers() (in setup.ts) restores these defaults.
export const server = setupServer(...handlers);
