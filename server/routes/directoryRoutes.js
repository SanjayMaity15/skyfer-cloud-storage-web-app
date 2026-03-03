import express from "express"
import { createDirectory } from "../controllers/directoryController.js"
import { isAuth } from "../middlewares/isAuth.js"

const router = express.Router()

router.post("/create", isAuth ,createDirectory)

export default router