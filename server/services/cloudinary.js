import { cloudinary } from "../config/cloudinary.config.js";
import fs from "fs";
import dotenv from "dotenv"
dotenv.config()

export const uploadFileToCloudinary = async (filePath) => {
	try {
		const result = await cloudinary.uploader.upload(filePath, {
			folder: process.env.CLOUDINARY_FOLDER,
			resource_type: "auto",
		});
        fs.unlinkSync(filePath)        
		
 
        const { public_id, secure_url, resource_type } = result;
		return {public_id, secure_url, resource_type};
    } catch (error) {
        fs.unlinkSync(filePath)
		console.error(error);
	}
};
