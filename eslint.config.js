import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Remote R2 assets and SVG markup use plain <img> intentionally.
      "@next/next/no-img-element": "off",
      "@typescript-eslint/no-unused-vars": "off",
      // Marketing copy uses apostrophes/quotes freely in JSX text.
      "react/no-unescaped-entities": "off",
    },
  },
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "node_modules/**",
      "next-env.d.ts",
      "scripts/**",
    ],
  },
];

export default eslintConfig;
