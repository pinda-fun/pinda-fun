module.exports = {
  webpack: (config) => {
    config.resolve.alias.react = 'preact/compat';
    config.resolve.alias['react-dom/test-utils'] = 'preact/test-utils';
    config.resolve.alias['react-dom'] = 'preact/compat';
    return config;
  },
  jest: (config) => {
    config.moduleNameMapper.react = 'preact/compat';
    config.moduleNameMapper['react-dom/test-utils'] = 'preact/test-utils';
    config.moduleNameMapper['react-dom'] = 'preact/compat';
    return config;
  }
}