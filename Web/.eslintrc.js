const warnInDevelopment = process.env.NODE_ENV === 'production' ? 'error' : 'warn';

module.exports = {
  "extends": [
    "airbnb-typescript"
  ],
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

    'no-alert': 'off',
    'prefer-destructuring': 'off',
    'no-underscore-dangle': 'off',

    // TypeScript lints this for us
    'react/prop-types': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'max-classes-per-file': 'warn',

    '@typescript-eslint/no-unused-vars': ['error', { 'argsIgnorePattern': '^_', 'varsIgnorePattern': '^_' }],
    'import/prefer-default-export': 'off',

    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
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
