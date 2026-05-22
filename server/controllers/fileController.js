import File from "../models/File.js";
import fs from "fs";
import path from "path";
import { uploadFileToCloudinary } from "../services/cloudinary.js";
import { cloudinary } from "../config/cloudinary.config.js";
import Subscription from "../models/Subscription.js";
import {
	DeleteObjectCommand,
	HeadObjectCommand,
	PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getObject, s3 } from "../config/s3.config.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createCloudFrontGetObjectSignedUrl } from "../config/cloudfront.config.js";

/*
=========================================

		File upload Controller

=========================================

*/

export const fileUploadInitiate = async (req, res) => {
	try {
		const { name, size, type, parentDirId } = req.body;
		const user = req.user;

		if (!name || !size || !parentDirId) {
			return res.status(400).json({
				message: "All info not present",
			});
		}

		if (!user.subscriptionStatus === "free") {
			const subscription = await Subscription.findOne({
				userId: req.user._id,
			});

			const now = new Date();

			if (
				!subscription ||
				subscription.status !== "active" ||
				subscription.endAt < now
			) {
				return res.status(403).json({
					success: false,
					message: "Subscription expired",
				});
			}
		}

		if (user.storageUsed + size > user.storageLimit) {
			return res.status(400).json({
				success: false,
				message: "Failed to upload storage limit exceeded.",
			});
		}

		const extension = path.extname(name);

		const fileRes = await File.create({
			fileName: name,
			size,
			resource_type: type,
			extension,
			parentDirId,
			owner: user._id,
		});

		const key = `${fileRes._id}${extension}`;

		const command = new PutObjectCommand({
			Bucket: process.env.S3_BUCKET_NAME,
			Key: key,
			ContentType: type,
		});

		const uploadUrl = await getSignedUrl(s3, command, {
			expiresIn: 300,
			signableHeaders: new Set(["host"]),
		});

		res.status(200).json({ uploadUrl, key });
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Server error",
		});
	}
};

export const verifyFileUploadComplete = async (req, res) => {
	try {
		const { key } = req.body;
		const user = req.user;

		const command = new HeadObjectCommand({
			Bucket: process.env.S3_BUCKET_NAME,
			Key: key,
		});

		const { ContentLength } = await s3.send(command);

		const fileId = key.split(".")[0];

		const fileData = await File.findById(fileId);

		if (fileData.size !== ContentLength) {
			return res.status(500).json({
				success: false,
				message: "Could not able to upload file. Due to size mismatch",
			});
		}

		fileData.isUploaded = "completed";
		await fileData.save();

		user.storageUsed += fileData.size;
		user.save();

		return res.status(201).json({
			success: true,
			message: "file upload succesfully",
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Server error",
		});
	}
};

export const cancelFileUpload = async (req, res) => {
	try {
		const { key } = req.body;
		

		if (!key) {
			return res.status(400).json({
				message: "File name missing"
			})
		}

		const fileId = key.split(".")[0];

		await File.findByIdAndDelete(fileId)

		return res.status(200).json({
			message: "upload cancelled"
		})
	} catch (error) {
		return res.status(500).json({
			message: "server error"
		})
	}
}

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

		const key = `${file._id}${file.extension}`;
		const fileName = file.fileName;

		if (action === "download") {
			const downloadUrl = await getObject(key, true, fileName);

			return res.redirect(downloadUrl);
		} else {
			const previewUrl = createCloudFrontGetObjectSignedUrl(key)
			return res.status(200).json({
				success: true,
				data: previewUrl,
			});
		}
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

		file.fileName = `${newFileName}${file.extension}`;
		await file.save();

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

		let file = await File.findOneAndUpdate(
			{
				_id: id,
				owner: user._id,
			},
			{ isDeleted: true },
		);

		user.storageUsed = Math.max(0, user.storageUsed - file.size);
		await user.save();

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

export const recoverDeletedFile = async (req, res) => {
	try {
		const { id } = req.params;
		const user = req.user;

		let file = await File.findOne({
			_id: id,
			owner: user._id,
		});

		if (user.storageUsed + file.size > user.storageLimit) {
			return res.status(400).json({
				success: false,
				message: "Your storage limit exceeded.",
			});
		}

		await file.updateOne({ isDeleted: false });

		user.storageUsed += file.size;
		await user.save();

		return res.status(200).json({
			success: true,
			message: "File recover successfully",
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Server error",
		});
	}
};

export const permanantDelete = async (req, res) => {
	try {
		const { id } = req.params;
		const user = req.user;

		let file = await File.findOne({
			_id: id,
			owner: user._id,
		});

		// delete from cloudinary
		const key = `${file._id}${file.extension}`;

		

		const command = new DeleteObjectCommand({
			Bucket: process.env.S3_BUCKET_NAME,
			Key: key,
		});

		const result = await s3.send(command);

		// delete from db

		await file.deleteOne();

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

// get deleted file

export const getDeletedFile = async (req, res) => {
	try {
		const files = await File.find({ owner: req.user._id, isDeleted: true });

		return res.status(200).json({
			success: false,
			message: "Data fetch successfully",
			files,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Server error",
		});
	}
};
