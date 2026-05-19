
import authRoutes from "./routes/auth.route.js";
import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.route.js";
import searchRoutes from "./routes/search.route.js"
import actionsRoutes from "./routes/actions.routes.js"
import paginationRoutes from "./routes/pagination.routes.js"
import songRoutes from "./routes/song.routes.js"
import aiRoutes from "./routes/ai.routes.js"
import { rateLimiter } from "./middleware/rateLimiter.js";
import cors from "cors";
import { cleanupInactiveDocuments } from "./lib/cleanup.js";
import passport from "./lib/passport.js";
import session from "express-session";
import { getGoogleCallbackUrl } from "./lib/authConfig.js";

dotenv.config();
const app = express();

// Render sits behind a proxy — needed so secure cookies work in production
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

// Google OAuth uses a short lived session cookie during the redirect dance only
app.use(
  session({
    secret: process.env.SESSION_SECRET || process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

const corsOptions = {
  origin: [process.env.ORIGIN, process.env.LOCAL, process.env.ORIGIN_MAIN], 
  methods: ['GET','POST','PUT','DELETE','PATCH'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true, 
};


app.use(cors(corsOptions))
// app.options("*", cors(corsOptions)); 

connectDB();

app.use(passport.initialize())
app.use(passport.session())

app.use("/api", rateLimiter)

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes)
app.use("/api/releases", searchRoutes)
app.use("/api/actions", actionsRoutes)
app.use("/api/pages", paginationRoutes)
app.use("/api/music", songRoutes)
app.use("/api/ai", aiRoutes)

app.get("/", (req, res) => {
  res.send("Server is live on Vercel");
});


app.get("/api", (req, res) => {
  res.json({ message: "API is working on Vercel" });
});

app.get("/api/health", (req,res)=>{
  res.status(200).json({
    ok: true,
    status: "alive and breathing",
    timestamp: new Date().toISOString()
})
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  const message = process.env.NODE_ENV === 'production' 
    ? 'Something went wrong!' 
    : err.message;
  
  res.status(err.status || 500).json({ 
    message,
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
});

// Handle 404
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
  try {
    console.log(`Google OAuth callback: ${getGoogleCallbackUrl()}`);
  } catch (err) {
    console.warn("Google OAuth callback URL not configured:", err.message);
  }
});

// Schedule cleanup task only in local development
if (process.env.NODE_ENV !== 'production') {
  setInterval(cleanupInactiveDocuments, 24 * 60 * 60 * 1000);
}

// Export for Vercel
export default app;
