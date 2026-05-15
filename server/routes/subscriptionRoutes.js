import express from "express";

import { isAuth } from "../middlewares/isAuth.js";
import { createSubscription, skyferWebhookRazorpay } from "../controllers/subscriptionController.js";

const router = express.Router();

router.post("/create", isAuth, createSubscription);
router.post("/webhook/razorpay/skyfer", skyferWebhookRazorpay)

export default router;
