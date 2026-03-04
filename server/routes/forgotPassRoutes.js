import express from "express"
import { resetPassword, sendForgotPassOTP, verifyOTPForPassReset } from "../controllers/forgotPasswordController.js"


const router = express.Router()

router.post("/send-otp-pass",  sendForgotPassOTP)
router.post("/verify-otp", verifyOTPForPassReset)
router.post("/reset-password", resetPassword)

export default router