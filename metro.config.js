const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add web-specific configuration
config.resolver.resolverMainFields = ['browser', 'module', 'main'];

// Custom resolver to alias native modules with web polyfills
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Alias expo native modules to web polyfills when platform is web
  if (platform === 'web') {
    if (moduleName === 'expo-linear-gradient') {
      return {
        filePath: path.resolve(__dirname, 'src/polyfills/expo-linear-gradient.web.js'),
        type: 'sourceFile',
      };
    }
    if (moduleName === 'expo-blur') {
      return {
        filePath: path.resolve(__dirname, 'src/polyfills/expo-blur.web.js'),
        type: 'sourceFile',
      };
    }
  }

  // Fall back to the default resolver
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
