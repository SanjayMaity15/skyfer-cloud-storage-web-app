import File from "../models/File.js";
import path from "path";
import fs from "node:fs/promises"

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

		const fileName = file.originalname;
		const size = file.size;
		const extension = path.extname(file.originalname);
		const parentDirId = req.params.id || user.rootDirId.toString();
		const owner = user._id;

		const fileRes = await File.create({
			fileName,
			size,
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

export const sendFileToUser = async (req, res) => {
	try {
		const { id } = req.params;
		const user = req.user;
		const { action } = req.query;

		const file = await File.findOne({ _id: id, owner: user._id });

		if (!file) {
			return res.status(404).json({
				success: false,
				message: "File not found",
			});
		}

		const filePath = `${process.cwd()}/storage/${file.fileName}`;

		if (action === "download") {
			return res.download(filePath);
		}

		return res.sendFile(filePath, (err) => {
			if (!res.headersSent && err) {
				return res.status(404).json({ error: "File not found!" });
			}
		});
	} catch (error) {
		console.log(error);
	}
};

// rename file

export const renameFile = async (req, res) => {
	try {
		const { id } = req.params;
		let { newFileName } = req.body;
		const user = req.user;

		let file = await File.findOne({
			_id: id,
			owner: user._id,
		});

		const ext = path.extname(file.fileName);
		const finalFileName = `${newFileName}${ext}`;
		const oldFilePath = `${process.cwd()}/storage/${file.fileName}`;
		const newFilePath = `${process.cwd()}/storage/${finalFileName}`;
		file.fileName = finalFileName;

		await file.save()

		await fs.rename(oldFilePath, newFilePath)

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
// delete file

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
