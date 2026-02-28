// Import all necessary package and file
import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import helmet from "helmet"
import { connectDatabase } from "./config/connectDatabase.js"
import cookieParser from "cookie-parser"


// import routes
import authRoutes from "./routes/authRoutes.js"

// import port
const PORT = process.env.PORT || 5000


// config dotenv
dotenv.config()

// createing instance of app
const app = express()

// config cors , parser, cookie parser

app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true
}))

app.use(express.json())
app.use(cookieParser())
app.use(helmet())

// all routes
app.use("/api/auth", authRoutes)





// default get req
app.get("/", (req, res) => {
    res.send("SERVER IS RUNNING")
})

// server listen
app.listen(PORT, async() => {
    await connectDatabase()
    console.log(`SERVER IS RUNNING AT PORT ${PORT}`);
})