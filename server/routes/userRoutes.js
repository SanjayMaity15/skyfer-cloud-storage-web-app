import express from "express"
import { editProfile } from "../controllers/userController.js";
import { isAuth } from "../middlewares/isAuth.js";

const router = express.Router()

router.post("/edit-profile", isAuth, editProfile)

export default router;
