export const validateEnv = () : void => {
  const required : string[] = [
    "MONGODB_URI",
    "JWT_SECRET",
    "SESSION_SECRET",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
  ];

  if (process.env.NODE_ENV === "production") {
    required.push(
      "ORIGIN_MAIN",
      "B_PROD_URL",
      "SPOTIFY_CLIENT_ID",
      "SPOTIFY_CLIENT_SECRET"
    );
  }

  for (const key of required) {
    if (!process.env[key]?.trim()) {
      console.error(`Missing required env: ${key}`);
      process.exit(1);
    }
  }
};
