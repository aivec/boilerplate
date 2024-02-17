import { FlatCompat } from "@eslint/eslintrc";
import path from "path";
import { fileURLToPath } from "url";
import globals from "globals";

// mimic CommonJS variables -- not needed if using CommonJS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  {
    ignores: [
      "dist", // default directory for bundled JavaScript/PHP
      "vendor", // PHP composer packages
    ],
  },
  // translate an entire config
  ...compat.config({
    // no top-level config because overrides allows us to filter by file type
    overrides: [
      {
        files: ["*.ts", "*.tsx"],
        extends: ["airbnb", "airbnb-typescript", "airbnb/hooks", "prettier"],
        parser: "@typescript-eslint/parser",
        parserOptions: {
          // use consumer's tsconfig.json
          project: path.resolve(process.cwd(), "./tsconfig.json"),
        },
      },
      {
        files: ["*.js"],
        extends: ["airbnb-base", "prettier"],
      },
    ],
  }),
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js"],
    languageOptions: {
      globals: {
        // exclude browser globals
        ...globals.browser,
        // exclude jQuery
        ...globals.jquery,
      },
    },
  },
  {
    files: ["**/*.tsx"],
    rules: {
      "react/jsx-props-no-spreading": ["warn"],
      // this rule is simply broken for typescript
      "react/require-default-props": ["off"],
    },
  },
  {
    files: ["**/*.js"],
    rules: {
      "import/no-extraneous-dependencies": [
        "error",
        // ignore if dev only file
        { devDependencies: ["eslint.config.js"] },
      ],
    },
  },
];
