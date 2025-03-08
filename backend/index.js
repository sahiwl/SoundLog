import router from "./routes/auth.route.js"
import authRoutes from "./routes/auth.route.js"
import express from "express"
import dotenv from "dotenv"
import { connectDB } from "./lib/db.js"
import cookieParser from "cookie-parser"

dotenv.config()
const app = express()

app.use(express.json()) // Add this line to parse JSON bodies
app.use(cookieParser())
const PORT = process.env.PORT
connectDB()

app.use("/api/auth", authRoutes)
app.get('/', (req, res) => {
    res.send("Server is live")
})


app.listen(PORT,()=>{
    console.log(`This server is running on port: `, PORT);
})