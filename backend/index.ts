import authRoutes from "./routes/auth.route.js";
import express from "express";
import type { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.route.js";
import searchRoutes from "./routes/search.route.js";
import actionsRoutes from "./routes/actions.routes.js";
import paginationRoutes from "./routes/pagination.routes.js";
import songRoutes from "./routes/song.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import { rateLimiter } from "./middleware/rateLimiter.js";
import cors, { type CorsOptions } from "cors";
import { cleanupInactiveDocuments } from "./lib/cleanup.js";
import passport from "./lib/passport.js";
import session from "express-session";
import { getGoogleCallbackUrl } from "./lib/authConfig.js";
import { validateEnv } from "./lib/validateEnv.js";
import { AppError } from "./lib/AppError.js";

dotenv.config();
validateEnv();
const app = express();

// Render sits behind a proxy, needed so secure cookies work in production
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

// Google OAuth uses a short lived session cookie during the redirect dance only
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

const corsOptions: CorsOptions = {
  origin: [process.env.ORIGIN, process.env.LOCAL, process.env.ORIGIN_MAIN].filter(
    Boolean
  ) as string[],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
// app.options("*", cors(corsOptions)); 

connectDB();

app.use(passport.initialize());
app.use(passport.session());

app.use("/api", rateLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/releases", searchRoutes);
app.use("/api/actions", actionsRoutes);
app.use("/api/pages", paginationRoutes);
app.use("/api/music", songRoutes);
app.use("/api/ai", aiRoutes);

// _req: underscore marks an intentionally unused param (Express requires the slot)
app.get("/", (_req: Request, res: Response) => {
  res.send("Server is live on Render");
});

app.get("/api", (_req: Request, res: Response) => {
  res.json({ message: "API is working on Vercel" });
});

app.get("/api/health", (_req: Request, res: Response) => {
  res.status(200).json({
    ok: true,
    status: "alive and breathing",
    timestamp: new Date().toISOString(),
  });
});

// 404 handler, must come before the error handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler, all routes use asyncHandler, so thrown errors arrive here
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (
    typeof err === "object" &&
    err !== null &&
    "type" in err &&
    err.type === "entity.too.large"
  ) {
    return res.status(413).json({ message: "Request body too large" });
  }

  if (err instanceof AppError) {
    const body: Record<string, unknown> = { message: err.message };
    if (err.details && typeof err.details === "object") {
      Object.assign(body, err.details);
    }
    return res.status(err.statusCode).json(body);
  }

  console.error("Unhandled error:", err);

  const maybeErr = err as { statusCode?: number; status?: number; message?: string };
  const status = maybeErr.statusCode || maybeErr.status || 500;
  const message =
    status >= 500 && process.env.NODE_ENV === "production"
      ? "Internal Server Error"
      : maybeErr.message || "Internal Server Error";

  res.status(status).json({ message });
});

const PORT =
  typeof process.env.PORT === "string" ? parseInt(process.env.PORT, 10) : 5001;

const CLEANUP_INTERVAL_MS = 24 * 60 * 60 * 1000;

const scheduleCleanup = () => {
  cleanupInactiveDocuments().catch((err) =>
    console.error("Startup cleanup failed:", err)
  );
  setInterval(() => {
    cleanupInactiveDocuments().catch((err) =>
      console.error("Scheduled cleanup failed:", err)
    );
  }, CLEANUP_INTERVAL_MS);
};

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
  try {
    console.log(`Google OAuth callback: ${getGoogleCallbackUrl()}`);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn("Google OAuth callback URL not configured:", message);
  }
  scheduleCleanup();
});

export default app;
