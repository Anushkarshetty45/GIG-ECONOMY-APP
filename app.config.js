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
      bundleIdentifier: "com.gigeconomy.app",
      infoPlist: {
        NSFaceIDUsageDescription: "We use Face ID to secure your financial data.",
        NSCameraUsageDescription: "We need camera access to scan receipts.",
        NSPhotoLibraryUsageDescription: "We need photo library access to upload receipts."
      }
    },
    android: {
      package: "com.gigeconomy.app",
      permissions: [
        "USE_BIOMETRIC",
        "USE_FINGERPRINT",
        "CAMERA",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE"
      ]
    },
    web: {
      bundler: "metro",
      favicon: "./assets/favicon.png"
    },
    plugins: [
      "expo-secure-store",
      "expo-local-authentication"
    ]
  }
};
