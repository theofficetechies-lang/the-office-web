import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import globals from "globals";

/**
 * Flat config. `npm run lint` runs the typecheck; `npm run eslint` runs this.
 * The a11y plugin is enabled deliberately — Phase 17 of the brief is an
 * accessibility phase, and several of its items are lintable.
 */
export default tseslint.config(
  {
    ignores: ["dist/**", "dist-ssr/**", "dist-ssr-api/**", "dist-test/**", "public/**"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: {
      "react-hooks": reactHooks,
      "jsx-a11y": jsxA11y,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
      // The reveal hook re-runs per route on purpose, and the typewriter's
      // single-mount effect is intentional; both carry explanatory comments.
      "react-hooks/exhaustive-deps": "warn",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      eqeqeq: ["error", "smart"],
      "prefer-const": "error",
      "no-var": "error",
    },
  },
  {
    // Serverless handlers and Node scripts run outside the browser.
    files: ["api/**/*.ts", "scripts/**/*.mjs", "vite.config.ts", "eslint.config.js"],
    languageOptions: {
      globals: { ...globals.node },
    },
    rules: {
      "jsx-a11y/anchor-is-valid": "off",
      // Node tooling reports progress on stdout by design.
      "no-console": "off",
    },
  }
);
