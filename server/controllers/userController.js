import { success } from "zod";
import { editProfileSchema } from "../validators/authValidators.js";
import { uploadFileToCloudinary } from "../services/cloudinary.js";
import { cloudinary } from "../config/cloudinary.config.js";

/*
=========================================

		Edit user profile Controller

=========================================
*/

export const editProfile = async (req, res) => {
	try {
		const { success, data } = editProfileSchema.safeParse(req.body);
		console.log("object");
		if (!success) {
			return res.status(400).json({
				success: false,
				message: "All fields must be filled",
			});
		}

		const { userName, gender } = data;
		const profilePic = req.file;
        let user = req.user;
        
        if (user.public_id) {
            await cloudinary.uploader.destroy(user.public_id)
        }
		// console.log({userName, gender, profilePic})

		const { public_id, secure_url } = await uploadFileToCloudinary(
			profilePic.path,
		);

		user.userName = userName;
		user.gender = gender;
		user.profilePic = secure_url;
		user.public_id = public_id;

		console.log(user);
		await user.save();

		return res.status(200).json({
			success: true,
			message: "Profile updated successfully",
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Server error",
		});
	}
};
