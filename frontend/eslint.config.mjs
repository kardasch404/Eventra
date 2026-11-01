import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // next/image warnings — keep as warn, not error
      "@next/next/no-img-element": "warn",
      // false positive: next.js server components (async functions) use try/catch with JSX
      "react-hooks/error-boundaries": "off",
      // false positive: setMounted(true) inside useEffect([]) is intentional hydration guard
      "react-hooks/set-state-in-effect": "off",
      // allow `any` — strict typing improvements tracked separately
      "@typescript-eslint/no-explicit-any": "off",
      // unused vars: downgrade to warn
      "@typescript-eslint/no-unused-vars": "warn",
      // react-hooks/incompatible-library: react-hook-form patterns
      "react-hooks/incompatible-library": "off",
      // unescaped entities
      "react/no-unescaped-entities": "off",
    },
  },
]);

export default eslintConfig;
