import express from "express"
import { getAllUser, logoutUser } from "../controllers/adminController.js";
import { isAuth } from "../middlewares/isAuth.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = express.Router()

router.get("/users", isAuth, isAdmin, getAllUser)
router.post("/user/logout/:id", isAuth, isAdmin, logoutUser)

export default router;