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
    extra: getEnvVars(environment),
  },
};
