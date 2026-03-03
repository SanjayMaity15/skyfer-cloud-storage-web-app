import express from "express";
import {
	createDirectory,
	getDirectory,
	renameDirectory,
} from "../controllers/directoryController.js";
import { isAuth } from "../middlewares/isAuth.js";

const router = express.Router();

router.post("/create", isAuth, createDirectory);
router.post("/create/:id", isAuth, createDirectory);

// support both root and sub directory
router.get("/get-dir", isAuth, getDirectory);

router.get("/get-dir/:id", isAuth, getDirectory);

router.post("/rename/:id", isAuth, renameDirectory)

router.delete("/delete/:id", isAuth, deleteDirectory)

export default router;
