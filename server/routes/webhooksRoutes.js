import express from "express";
import { skyferWebhookRazorpay } from "../controllers/subscriptionController.js";


const router = express.Router();


router.post("/razorpay/skyfer", skyferWebhookRazorpay)

export default router;
