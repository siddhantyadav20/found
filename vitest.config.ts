import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

/**
 * The test runner.
 *
 * Deliberately unambitious. There is no jsdom, no React Testing Library and no
 * component test here, because the things worth testing on this site are not
 * components — they are the handful of pure functions everything else is built
 * on, and those run in plain Node.
 *
 * The game's engine is the clearest case: `tests/support/play3.ts` walks every
 * episode as a perfect player and as curious ones, which no screenshot can do.
 *
 * The `@` alias mirrors `tsconfig.json`'s `paths`, which is how every import in
 * the app is written.
 *
 * `server-only` is aliased to a stub for the reason that file gives: without
 * it, any module carrying that guard throws on import here, and the store the
 * engagement feature runs on in development would be untestable.
 */
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
      "server-only": fileURLToPath(
        new URL("./tests/stubs/server-only.ts", import.meta.url),
      ),
    },
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
});
