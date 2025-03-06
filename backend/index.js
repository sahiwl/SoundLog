import router from "./routes/auth.route.js"
import authRoutes from "./routes/auth.route.js"
import express from "express"
import dotenv from "dotenv"
import { connectDB } from "./lib/db.js"

dotenv.config()
const app = express()

const PORT = process.env.PORT
connectDB()

app.use("/api/auth", authRoutes)
app.get('/', (req, res) => {
    res.send("Server is live")
})


app.listen(PORT,()=>{
    console.log(`This server is running on port: `, PORT);
})