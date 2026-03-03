// create directory

import Directory from "../models/Directory.js";
import { directorySchema } from "../validators/directoryValidators.js";

export const createDirectory = async (req, res) => {
	try {
		const user = req.user;
		const dirName = req.body.dirName;
		const parentDirId = req.params.id || user.rootDirId.toString();

		const dirData = {
			dirName,
			owner: user._id.toString(),
			parentDirId,
		};

		console.log(dirData);

		const { success, data } = directorySchema.safeParse(dirData);
		if (!success) {
			return res.status(400).json({
				success: false,
				message: "All fields must be filled",
			});
		}

		const dir = await Directory.create({
			dirName: dirData.dirName,
			owner: dirData.owner,
			parentDirId: dirData.parentDirId,
		});

		return res.status(201).json({
			success: true,
			message: "Folder created successfully",
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Server error",
		});
	}
};
