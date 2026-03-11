import multer from "multer";
import dotenv from "dotenv"
dotenv.config()



const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "storage/");
	},
	filename: function (req, file, cb) {
		
		cb(null, file.originalname);
	},
});

export const upload = multer({ storage });
