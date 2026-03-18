import { setupServer } from "msw/node";

// Create a server with no default handlers.
// Each test file defines its own handlers via server.use().
export const server = setupServer();
