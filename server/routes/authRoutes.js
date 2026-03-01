import express from "express";
import { getCurrentUser, login, logout, register, sendOTP } from "../controllers/authController.js";
import { isAuth } from "../middlewares/isAuth.js";

const router = express.Router();

router.post("/send-otp", sendOTP);
router.post("/register", register);
router.post("/login", login);
router.post("/logout", isAuth, logout);
router.get("/current-user", isAuth, getCurrentUser);

export default router;
