
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
		const { success, data, error } = editProfileSchema.safeParse(req.body);

		if (!success) {
			return res.status(400).json({
				success: false,
				message: error.issues[0].message,
			});
		}

		const { userName, gender } = data;
		const profilePic = req.file;
		const user = req.user;

		user.userName = userName;
		user.gender = gender;

		if (profilePic) {
			if (user.public_id) {
				await cloudinary.uploader.destroy(user.public_id);
			}

			const { public_id, secure_url } = await uploadFileToCloudinary(
				profilePic.path,
			);

			user.profilePic = secure_url;
			user.public_id = public_id;
		}

		await user.save();

		return res.status(200).json({
			success: true,
			message: "Profile updated successfully",
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			success: false,
			message: "Server error",
		});
	}
};