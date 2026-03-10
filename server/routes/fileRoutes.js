import express from "express"
import { upload } from "../services/multer.js";
import { deleteFile, fileUpload, getDeletedFile, permanantDelete, recoverDeletedFile } from "../controllers/fileController.js";
import { isAuth } from "../middlewares/isAuth.js";
import { sendFileToUser } from "../controllers/fileController.js";
import { renameFile } from "../controllers/fileController.js";

const router = express.Router()

router.post("/upload", isAuth, upload.single("file"), fileUpload)
router.post("/upload/:id", isAuth, upload.single("file"), fileUpload)
router.get("/view/:id", isAuth, sendFileToUser)
router.post("/rename/:id", isAuth, renameFile)
router.delete("/delete/:id", isAuth, deleteFile)
router.get("/trash-file", isAuth, getDeletedFile)
router.delete("/permanant-delete/:id", isAuth, permanantDelete)
router.post("/recover-file/:id", isAuth, recoverDeletedFile)

export default router;