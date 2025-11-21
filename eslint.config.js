
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";

export default [
  {
    ignores: [
      "dist",
      "node_modules",
      "client/dist",
      "client/node_modules",
      "server/dist",
      "server/node_modules",
      ".env",
      ".env.*",
      "**/*.css",
    ],
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  ...tseslint.configs.recommended,
  pluginReactConfig,
  {
    rules: {
      "react/react-in-jsx-scope": "off",
    },
  },
];
