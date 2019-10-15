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
    'react/prop-types': 'off'
  },
  "settings": {
    "react": {
      "pragma": "React",
      "version": "detect"
    }
  },
  "parser": "@typescript-eslint/parser"
};
