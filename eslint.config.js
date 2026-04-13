// @ts-check
const eslint = require('@eslint/js');
const { defineConfig } = require('eslint/config');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');

module.exports = defineConfig([
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
      // tseslint.configs.stylistic,
      angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      // "semi": "error", // Semicolon required
      // "indent": ["error", 2, { "SwitchCase": 1 }], // Indentation
      // "linebreak-style": ["error", "unix"], // LF required
      // "no-trailing-spaces": "error", // No trailing spaces
      // "eol-last": ["error", "always"], // Final line break required
      // "no-multiple-empty-lines": ["error", { "max": 1, "maxEOF": 1 }], // No multi final line breaks
      // "quotes": ["error", "single", { "avoidEscape": true, "allowTemplateLiterals": true }], // Prefer single quotes
      // "array-bracket-spacing": ["error", "never"], // Array / bracket spacing required
      // "object-curly-spacing": ["error", "always"], // Space after { and before }
      // "template-curly-spacing": ["error", "always"], // Same in template literals ${ }
      // "array-bracket-newline": ["error", "consistent"], // Consistent line breaks in brackets
      // "object-curly-newline": ["error", { "consistent": true }], // Same for curly brackets
      // "function-paren-newline": ["error", "consistent"], // Same for function parenthesis
      // "array-element-newline": ["error", { "ArrayExpression": "consistent", "ArrayPattern": "consistent" }], // Same for array items
      // "object-property-newline": ["error", { "allowAllPropertiesOnSameLine": true }], // Same for object elements
      // "comma-spacing": ["error", { "before": false, "after": true }], // No space allowed before a comma, but a space after it required
      // "comma-dangle": ["error", { // Required comma dangle in the last item / element in multiline
      //   "imports": "always-multiline",
      //   "exports": "always-multiline",
      //   "arrays": "always-multiline",
      //   "objects": "always-multiline",
      //   "functions": "always-multiline",
      // }],
      // "brace-style": ["error", "stroustrup", { "allowSingleLine": true }], // Required line break after } followed by else / catch
      // "keyword-spacing": ["error", { "before": true }], // Required space after keyword
      // "space-before-blocks": ["error", "always"], // Required space before block
      // "spaced-comment": ["error", "always"], // Required space after comment start
      "no-empty": "off", // Allow empty blocks
      "prefer-const": "error", // Prefer const when variable is never reassigned
      "no-constant-condition": "warn", // Just warn about constant conditions
      "eqeqeq": ["error", "always"], // Required type-safe equality operators
      "no-case-declarations": "warn",  // Just warn about declarations inside case blocks
      "yoda": ["error", "never"], // No Yoda conditions
      "@typescript-eslint/class-literal-property-style": "warn", // Just warn about non readonly class properties
      "@typescript-eslint/no-unused-vars": "off", // Allow unused vars
      "@typescript-eslint/no-empty-function": "off", // Allow empty functions
      "@typescript-eslint/prefer-for-of": "off", // for-off optional
      "@typescript-eslint/no-inferrable-types": "off", // Allow inferrable types
      "@typescript-eslint/no-empty-object-type": "warn", // Just warn about empty object type
      "@typescript-eslint/consistent-type-definitions": "off", // Allow creation of types, not only interfaces
      "no-unneeded-ternary": "error", // No unneeded ternary
      "@angular-eslint/directive-selector": ['error', { type: 'attribute', prefix: 'rm', style: 'camelCase' }], // Directives prefix
      "@angular-eslint/component-selector": ['error', { type: 'element', prefix: 'rm', style: 'kebab-case' }], // Custom elements prefix
      "@angular-eslint/no-empty-lifecycle-method": "off", // Allow empty lifecycle methods
    },
  },
  {
    files: ['**/*.html'],
    extends: [angular.configs.templateRecommended, angular.configs.templateAccessibility],
    rules: {
      // Prettier-managed formatting rules (kept commented, not removed):
      // "linebreak-style": ["error", "unix"], // LF required
      // "eol-last": ["error", "always"], // Final line break required
      "@angular-eslint/template/eqeqeq": "error",
      "@angular-eslint/template/alt-text": "error",
      "@angular-eslint/template/click-events-have-key-events": "error",
      "@angular-eslint/template/interactive-supports-focus": "error",
      "@angular-eslint/template/banana-in-box": "error",
      "@angular-eslint/template/no-duplicate-attributes": "error",
    },
  },
]);
