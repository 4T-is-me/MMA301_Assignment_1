// Author: trangtttce191027
// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    files: ['__tests__/**/*.{js,jsx}', 'jest.setup.js'],
    languageOptions: {
      globals: {
        jest: 'readonly', describe: 'readonly', test: 'readonly',
        expect: 'readonly', beforeEach: 'readonly', afterEach: 'readonly',
      },
    },
  },
  {
    ignores: ["dist/*"],
  }
]);
