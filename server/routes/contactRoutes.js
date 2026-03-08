import express from "express"
import { sendContactUsMsg } from "../controllers/contactController.js"

const router = express.Router()

router.post("/send", sendContactUsMsg)

export default router