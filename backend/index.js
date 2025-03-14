import router from "./routes/auth.route.js";
import authRoutes from "./routes/auth.route.js";
import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.route.js";
import songRoutes from "./routes/song.route.js"
import actionsRoutes from "./routes/actions.routes.js"
import paginationRoutes from "./routes/pagination.routes.js"


dotenv.config();
const app = express();

app.use(express.json()); // Add this line to parse JSON bodies
app.use(cookieParser());
const PORT = process.env.PORT;
connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes)
app.use("/api/releases", songRoutes)
app.use("/api/actions", actionsRoutes)
app.use("/api/pages", paginationRoutes)

app.get("/", (req, res) => {
  res.send("Server is live");
});

app.listen(PORT, () => {
  console.log(`This server is running on port: `, PORT);
});
