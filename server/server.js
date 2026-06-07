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
import fileRoutes from "./routes/fileRoutes.js"
import contactRoutes from "./routes/contactRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"
import planRoutes from "./routes/planRoutes.js"
import subscriptionRoutes from "./routes/subscriptionRoutes.js"
import webhooksRoutes from "./routes/webhooksRoutes.js"
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
		methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
		credentials: true,
		allowedHeaders: ["Content-Type", "Authorization"]
	}),
);


app.use(express.json());
app.use(cookieParser());



// all routes

app.use("/api/auth", authRoutes);
app.use("/api/reset", passResetRoutes);
app.use("/api/google", googleLoginRoutes);
app.use("/api/user", userRoutes)
app.use("/api/dir", dirRoutes)
app.use("/api/file", fileRoutes)
app.use("/api/contact", contactRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/plans", planRoutes)
app.use("/api/subscription", subscriptionRoutes)
app.use("/webhook", webhooksRoutes)

// default get req
app.get("/", (req, res) => {
	res.send("SERVER IS RUNNING Sanjay");
});

// server listen
app.listen(PORT ,async () => {
	await connectDatabase();
	console.log(`---SERVER IS RUNNING AT PORT ${PORT}---`);
});
