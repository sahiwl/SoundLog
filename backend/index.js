import router from "./routes/auth.route.js";
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

dotenv.config();
const app = express();

app.use(express.json()); // Add this line to parse JSON bodies
app.use(cookieParser());

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}))


const PORT = process.env.PORT;
connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes)
app.use("/api/releases", searchRoutes)
app.use("/api/actions", actionsRoutes, rateLimiter)
app.use("/api/pages", paginationRoutes,rateLimiter)
app.use("/api/music", songRoutes, rateLimiter)

app.get("/", (req, res) => {
  res.send("Server is live");
});

app.listen(PORT, () => {
  console.log(`This server is running on port: `, PORT);
});
