// Import all necessary package and file
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import { connectDatabase } from "./config/connectDatabase.js";
import cookieParser from "cookie-parser";

// import routes
import authRoutes from "./routes/authRoutes.js";
import passResetRoutes from "./routes/forgotPassRoutes.js";
import googleLoginRoutes from "./routes/authGoogleRoutes.js";
import userRoutes from "./routes/userRoutes.js"
import dirRoutes from "./routes/directoryRoutes.js"
import multer from "multer";
import fileRoutes from "./routes/fileRoutes.js"
// import port
const PORT = process.env.PORT || 5000;

// config dotenv
dotenv.config();

// createing instance of app
const app = express();
app.disable("x-powered-by");
// config cors , parser, cookie parser

app.use(
	cors({
		origin: process.env.FRONTEND_URL,
		// origin: [
		// 	"http://localhost:5173",
		// 	"http://10.180.53.153:5173",
		// ],
		methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
		credentials: true,
	}),
);


app.use(express.json());
app.use(cookieParser());



// all routes

app.use("/api/auth", authRoutes);
app.use("/api/reset", passResetRoutes);
app.use("/api/auth/google", googleLoginRoutes);
app.use("/api/user", userRoutes)
app.use("/api/dir", dirRoutes)
app.use("/api/file", fileRoutes)

// default get req
app.get("/", (req, res) => {
	res.send("SERVER IS RUNNING");
});

// server listen
app.listen(PORT, "0.0.0.0" ,async () => {
	await connectDatabase();
	console.log(`---SERVER IS RUNNING AT PORT ${PORT}---`);
});
