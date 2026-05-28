declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV?: "development" | "production";
    PORT?: string;
    MONGODB_URI: string;
    JWT_SECRET: string;
    SESSION_SECRET: string;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    B_PROD_URL?: string;
    BE_DEV_URL?: string;
    ORIGIN_MAIN?: string;
    ORIGIN?: string;
    LOCAL?: string;
    SPOTIFY_CLIENT_ID?: string;
    SPOTIFY_CLIENT_SECRET?: string;
    GEMINI_API_KEY?: string;
    GEMINI_MODEL?: string;
    AI_MAX_REQUESTS_PER_MINUTE?: string;
    AI_RATE_LIMIT_WINDOW_SECONDS?: string;
    CLOUDINARY_CLOUD_NAME?: string;
    CLOUDINARY_API_KEY?: string;
    CLOUDINARY_API_SECRET?: string;
  }
}
