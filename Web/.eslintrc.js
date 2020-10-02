const warnInDevelopment = process.env.NODE_ENV === 'production' ? 'error' : 'warn';

module.exports = {
  "extends": [
    "airbnb-typescript"
  ],
  "parserOptions": {
    "project": './tsconfig.json',
  },
  "plugins": ["react", "@typescript-eslint", "prettier", "react-hooks"],
  "env": {
    "browser": true,
    "jasmine": true,
    "jest": true
  },
  "rules": {
    // Allow debugger and console statement in development
    'no-debugger': warnInDevelopment,
    'no-console': warnInDevelopment,

    // This rule has issues with the TypeScript parser, but tsc catches
    // these sorts of errors anyway.
    // See: https://github.com/typescript-eslint/typescript-eslint/issues/342
    'no-undef': 'off',

    'no-shadow': 'off', // replaced by ts-eslint rule below
    '@typescript-eslint/no-shadow': 'error',

    'no-alert': 'off',
    'no-underscore-dangle': 'off',

    '@typescript-eslint/comma-dangle': ['error', 'always-multiline'],

    // TypeScript lints this for us
    'react/prop-types': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'react/require-default-props': 'off',
    'max-classes-per-file': 'warn',

    '@typescript-eslint/no-unused-vars': ['error', { 'argsIgnorePattern': '^_', 'varsIgnorePattern': '^_' }],
    '@typescript-eslint/type-annotation-spacing': 'error',

    'import/prefer-default-export': 'off',

    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",

    "no-restricted-imports": [
      "error",
      {
        "paths": [
          {
            "name": "styled-components",
            "message": "Please import from styled-components/macro."
          },
          {
            "name": "react-virtualized",
            "message": "Please import from react-virtualized/dist/es/<component> instead."
          }
        ],
        "patterns": [
          "!styled-components/macro",
          "!react-virtualized/dist/es/*"
        ]
      }
    ]
  },
  "settings": {
    "react": {
      "pragma": "React",
      "version": "detect"
    },
    "import/resolver": {
      "node": {
        "paths": ["src"]
      }
    },
  },
  "parser": "@typescript-eslint/parser"
};
