import multer from "multer";
import dotenv from "dotenv"
dotenv.config()

const storagePath = process.env.STORAGE_PATH;

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, storagePath);
	},
	filename: function (req, file, cb) {
		
		cb(null, file.originalname);
	},
});

export const upload = multer({ storage });
