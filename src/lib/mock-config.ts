/**
 * Single switch for every screen's mock-vs-API data source. Every screen that talks to
 * customer-identity or customer-self-care imports this same flag instead of declaring its own -
 * flipping this one line back to `false` once the five backend services are reachable is enough
 * to switch the whole app over, no per-screen edits needed.
 */
export const USE_MOCK = true;
