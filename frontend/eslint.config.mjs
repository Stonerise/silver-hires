import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import nextPlugin from '@next/eslint-plugin-next';
import js from '@eslint/js';

export default [
  js.configs.recommended,
  ...nextPlugin.configs.recommended,
  {
    languageOptions: {
      parser: require('@babel/eslint-parser'),
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          presets: [require.resolve('next/babel')],
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    files: ['**/*.{js,jsx,mjs,cjs}'],
    rules: {
      'no-unused-vars': 'warn',
    },
  },
];