import express from "express"
import { getAllUser } from "../controllers/adminController.js";
import { isAuth } from "../middlewares/isAuth.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = express.Router()

router.get("/users", isAuth, isAdmin, getAllUser)


export default router;