
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
import { rateLimiter } from "./middleware/rateLimiter.js";
import cors from "cors";
import { cleanupInactiveDocuments } from "./lib/cleanup.js";
import passport from "./lib/passport.js";
import session from "express-session";

dotenv.config();
const app = express();

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));

app.use(express.json()); 
app.use(cookieParser());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  },
}));

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


app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes)
app.use("/api/releases", searchRoutes)
app.use("/api/actions", actionsRoutes)
app.use("/api/pages", paginationRoutes)
app.use("/api/music", songRoutes)


app.get("/", (req, res) => {
  res.send("Server is live on Vercel");
});

app.get("/api", (req, res) => {
  res.json({ message: "API is working on Vercel" });
});

// Handle 404
// app.use('*', (req, res) => {
//   res.status(404).json({ message: 'Route not found' });
// });

const PORT = process.env.PORT || 5001;

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`This server is running on port: ${PORT}`);
  });
  
  // Schedule cleanup task only in local development
  setInterval(cleanupInactiveDocuments, 24 * 60 * 60 * 1000);
}

// Export for Vercel
export default app;
