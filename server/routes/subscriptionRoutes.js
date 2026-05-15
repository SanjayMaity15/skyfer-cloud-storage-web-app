import express from "express";

import { isAuth } from "../middlewares/isAuth.js";
import { createSubscription } from "../controllers/subscriptionController.js";

const router = express.Router();

router.post("/create", isAuth, createSubscription);


export default router;
