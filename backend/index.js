
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

dotenv.config();
const app = express();

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));

app.use(express.json()); 
app.use(cookieParser());


const corsOptions = {
  origin: [process.env.ORIGIN, process.env.LOCAL, process.env.ORIGIN_MAIN], 
  methods: ['GET','POST','PUT','DELETE','PATCH'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true, 
};


app.use(cors(corsOptions))
// app.options("*", cors(corsOptions)); 

const PORT = process.env.PORT;
connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes)
app.use("/api/releases", searchRoutes)
app.use("/api/actions", actionsRoutes)
app.use("/api/pages", paginationRoutes)
app.use("/api/music", songRoutes)


app.get("/", (req, res) => {
  res.send("Server is live");
});

// Schedule cleanup task to run daily at midnight
setInterval(cleanupInactiveDocuments, 24 * 60 * 60 * 1000);

app.listen(PORT, () => {
  console.log(`This server is running on port: `, PORT);
});
