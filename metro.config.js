const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add web-specific configuration
config.resolver.resolverMainFields = ['browser', 'module', 'main'];

module.exports = config;
