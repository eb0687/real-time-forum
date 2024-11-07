import globals from "globals";
import pluginJs from "@eslint/js";
import noFloat from "eslint-plugin-no-floating-promise";
import importPlugin from 'eslint-plugin-import';
import jsdoc from "eslint-plugin-jsdoc";


/** @type {import('eslint').Linter.Config} */
export default [
  pluginJs.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: { globals: globals.browser },
    ...pluginJs.configs.recommended,
    plugins: {
      "no-floating-promise": noFloat,
      "import": importPlugin,
      "jsdoc": jsdoc
    },
    rules: {
      "no-floating-promise/no-floating-promise": 2,
      "no-unused-vars": "warn",
      "prefer-const": "warn",


      "no-return-await": "warn",
      "import/no-unresolved": "error",
      "import/named": "error",
      "import/default": "error",
      "import/namespace": "error",

      "jsdoc/check-values": "error",

      "strict": "warn",

      "no-undef": "error",
    }
  }
];
