import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";
import jest from "eslint-plugin-jest";
import globals from "globals";

import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import nextPlugin from "@next/eslint-plugin-next";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import a11yPlugin from "eslint-plugin-jsx-a11y";
import importPlugin from "eslint-plugin-import";

export default [
  {
    files: ["src/**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser: tsparser,
      globals: {
        ...globals.node,
      },
    },
    ...js.configs.recommended,
  },
  {
    plugins: { "@typescript-eslint": tseslint },
    rules: {
      ...tseslint.configs.recommended.rules,
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  {
    plugins: {
      "@next/next": nextPlugin,
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      "jsx-a11y": a11yPlugin,
      import: importPlugin,
    },
    rules: {
      ...nextPlugin.configs["core-web-vitals"].rules,
    },
    settings: { react: { version: "detect" } },
  },
  prettier,
  {
    plugins: { prettier: prettierPlugin },
    rules: { "prettier/prettier": "error" },
  },
  {
    files: [
      "src/**/*.{test,spec}.{js,jsx,ts,tsx}",
      "src/**/__tests__/**/*.{js,jsx,ts,tsx}",
      "src/tests/**/*.{js,ts,jsx,tsx}",
      "src/tests/setup-*.{js,ts}",
    ],
    plugins: { jest },
    languageOptions: { globals: { ...globals.jest } },
    rules: { ...jest.configs.recommended.rules },
  },
  {
    ignores: [
      "node_modules/",
      ".next/",
      "dist/",
      "build/",
      "coverage/",

      "eslint.config.*",
      "next.config.*",
      "jest.config.*",
      "vitest.config.*",
      ".prettierrc*",
    ],
  },
];
