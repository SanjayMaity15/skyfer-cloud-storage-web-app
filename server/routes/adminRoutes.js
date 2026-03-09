import express from "express"
import { deleteUser, getAllUser, logoutUser, restoreUser } from "../controllers/adminController.js";
import { isAuth } from "../middlewares/isAuth.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = express.Router()

router.get("/users", isAuth, isAdmin, getAllUser)
router.post("/user/logout/:id", isAuth, isAdmin, logoutUser)
router.post("/user/delete/:id", isAuth, isAdmin, deleteUser)
router.post("/user/restore/:id", isAuth, isAdmin, restoreUser)

export default router;