/**
 * Stands in for the `server-only` package under Vitest.
 *
 * `server-only` exists to make a build fail if server code is imported into a
 * client bundle. It has no runtime behaviour, and there is no bundler in the
 * test run to enforce it — so the tests alias it to this empty module and
 * exercise the store and auth helpers directly.
 */
export {};
