import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import jsxA11y from "eslint-plugin-jsx-a11y";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // eslint-config-next enables only 6 jsx-a11y rules. Accessibility is a stated
  // product requirement here (WCAG AA, real dialog semantics, focus traps), so
  // the full recommended set runs on the app + component tree. Static analysis
  // is a floor — the axe sweep in e2e/a11y.spec.ts covers rendered output.
  // Only the RULES are spread — eslint-config-next already registers the
  // jsx-a11y plugin, and flat config rejects redefining an existing plugin.
  {
    files: ["app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}"],
    rules: jsxA11y.flatConfigs.recommended.rules,
  },
  // Node-side tooling: scripts and Playwright specs are not Next.js pages and
  // must not be held to browser/React rules.
  {
    files: ["e2e/**/*.ts", "scripts/**/*.mjs", "playwright.config.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "no-console": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Archived design-concept experiments — reference material, not part of the app build.
    "design-archive/**",
    // Agent worktrees are transient CHECKOUTS of this same repo under
    // .claude/worktrees/<name>/. Linting them re-lints every file a second
    // time via a path that no root-relative ignore (e.g. "design-archive/**")
    // can match, so an already-ignored file fails the gate purely because a
    // worktree happens to exist.
    ".claude/**",
    // Test/report artifacts.
    "test-results/**",
    "playwright-report/**",
    ".lighthouse/**",
  ]),
]);

export default eslintConfig;
