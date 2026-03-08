import File from "../models/File.js";
import path from "path";
import fs from "node:fs/promises"
import { uploadFileToCloudinary } from "../services/cloudinary.js";



/*
=========================================

		File upload Controller

=========================================
*/

export const fileUpload = async (req, res) => {
	try {
		const user = req.user;
		const file = req.file;

		if (!user || !file) {
			return res.status(400).json({
				success: false,
				message: "Something went wrong",
			});
		}

		const uploadUrl = await uploadFileToCloudinary(file.path)
		const fileName = file.originalname;
		const size = file.size;
		const extension = path.extname(file.originalname);
		const parentDirId = req.params.id || user.rootDirId.toString();
		const owner = user._id;

		const fileRes = await File.create({
			fileName,
			size,
			url : uploadUrl,
			extension,
			parentDirId,
			owner,
		});

		return res.status(200).json({
			success: true,
			message: "File uploaded successfully",
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Server error",
		});
	}
};



/*
=========================================

		File preview Controller

=========================================
*/

export const sendFileToUser = async (req, res) => {
	try {
		const { id } = req.params;
		const { action } = req.query;
		const user = req.user;

		const file = await File.findOne({ _id: id, owner: user._id });

		if (!file) {
			return res.status(404).json({
				success: false,
				message: "File not found",
			});
		}

		if (action === "download") {
			const downloadUrl = file.url.replace(
				"/upload/",
				"/upload/fl_attachment/",
			);

			return res.redirect(downloadUrl);
		}

		return res.status(200).json({
			success: true,
			data: file.url,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			success: false,
			message: "Server error",
		});
	}
};
/*
=========================================

		File rename Controller

=========================================
*/

export const renameFile = async (req, res) => {
	try {
		const { id } = req.params;
		let { newFileName } = req.body;
		const user = req.user;

		let file = await File.findOne({
			_id: id,
			owner: user._id,
		});

		file.fileName = newFileName;
		await file.save()

		return res.status(200).json({
			success: true,
			message: "File renamed successfully",
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Server error",
		});
	}
};



/*
=========================================

		Delete file Controller

=========================================
*/

export const deleteFile = async (req, res) => {
	try {
		const { id } = req.params;
		const user = req.user;

		let file = await File.findOneAndDelete({
			_id: id,
			owner: user._id,
		});

		await fs.rm(`${process.cwd()}/storage/${file.fileName}`);

		return res.status(200).json({
			success: true,
			message: "File Deleted successfully",		
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Server error",
		});
	}
};
