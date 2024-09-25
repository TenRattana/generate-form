import "dotenv/config";

const getEnvVars = (env = "") => {
  switch (env) {
    case "production":
      return {
        apiUrl: process.env.API_URL,
        environment: "production",
      };
    case "development":
    default:
      return {
        apiUrl: process.env.API_URL,
        environment: "development",
      };
  }
};

const environment = process.env.APP_ENV || "development";

export default {
  expo: {
    name: "generate-form",
    slug: "generate-form",
    version: "1.0.0",
    orientation: "landscape",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
    },
    web: {
      bundler: "metro",
    },
    plugins: [
      "expo-router",
      [
        "expo-camera",
        {
          cameraPermission: "Allow $(PRODUCT_NAME) to access your camera",
          microphonePermission:
            "Allow $(PRODUCT_NAME) to access your microphone",
          recordAudioAndroid: true,
        },
      ],
    ],
    extra: getEnvVars(environment),
    scheme: "generate-form",
  },
};
