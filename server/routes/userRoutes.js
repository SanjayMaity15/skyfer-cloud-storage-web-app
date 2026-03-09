import express from "express"
import { editProfile } from "../controllers/userController.js";
import { isAuth } from "../middlewares/isAuth.js";
import { upload } from "../services/multer.js";

const router = express.Router()

router.post("/edit-profile", isAuth, upload.single("profilePic"),  editProfile)

export default router;
    