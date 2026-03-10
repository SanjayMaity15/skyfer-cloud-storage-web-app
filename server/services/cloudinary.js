import { cloudinary } from "../config/cloudinary.config.js";
import fs from "fs";

export const uploadFileToCloudinary = async (filePath) => {
	try {
		const result = await cloudinary.uploader.upload(filePath, {
            folder: "Skyfer",
            resource_type: "auto"
        });
        fs.unlinkSync(filePath)        
		console.log(result);
 
        const { public_id, secure_url } = result;
		return {public_id, secure_url};
    } catch (error) {
        fs.unlinkSync(filePath)
		console.error(error);
	}
};
