const warnInDevelopment = process.env.NODE_ENV === 'production' ? 'error' : 'warn';

module.exports = {
  "extends": [
    "airbnb-typescript"
  ],
  "plugins": ["react", "@typescript-eslint", "prettier"],
  "env": {
    "browser": true,
    "jasmine": true,
    "jest": true
  },
  "rules": {
    // Allow debugger and console statement in development
    'no-debugger': warnInDevelopment,
    'no-console': warnInDevelopment,

    'no-alert': 'off',
    'prefer-destructuring': 'off',

    // TypeScript lints this for us
    'react/prop-types': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'max-classes-per-file': 'warn',

    // import preferences
    'import/prefer-default-export': 'off',
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
