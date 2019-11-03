module.exports = {
  webpack: (config) => {
    config.resolve.alias.react = 'preact/compat';
    config.resolve.alias['react-dom'] = 'preact/compat';
    return config;
  }
}