export default {
  expo: {
    name: "GIG ECONOMY",
    slug: "gig-economy-app",
    version: "1.0.0",
    orientation: "portrait",
    userInterfaceStyle: "automatic",
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.gigeconomy.app"
    },
    android: {
      package: "com.gigeconomy.app",
      adaptiveIcon: {
        backgroundColor: "#0f0f1a"
      }
    },
    web: {
      bundler: "metro"
    }
  }
};
