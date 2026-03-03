// create directory

import Directory from "../models/Directory.js";
import { directorySchema } from "../validators/directoryValidators.js";
import File from "../models/File.js";

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

		const existingDirname = await Directory.findOne({
			dirName,
			owner: user._id,
		});

		if (existingDirname) {
			return res.status(409).json({
				success: false,
				message: "Failed to create folder name already exists",
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

// controllers/directoryController.js

export const getDirectory = async (req, res) => {
	try {
		const user = req.user; // logged-in user
		const dirId = req.params.id || user.rootDirId.toString(); // current directory

		// Fetch current directory
		const currentDir = await Directory.findOne({
			_id: dirId,
			owner: user._id,
		}).lean();
		if (!currentDir) {
			return res.status(404).json({ message: "Directory not found" });
		}

		// Fetch subdirectories
		const directories = await Directory.find({
			parentDirId: dirId,
			owner: user._id,
		}).lean();

		// Fetch files inside this directory
		const files = await File.find({
			parentDirId: dirId,
			owner: user._id,
		}).lean();

		return res.status(200).json({
			_id: currentDir._id,
			name: currentDir.dirName,
			directories: directories.map((dir) => ({
				_id: dir._id,
				name: dir.dirName,
				createdAt: dir.createdAt,
			})),
			files: files.map((file) => ({
				_id: file._id,
				name: file.fileName,
				size: file.size,
				createdAt: file.createdAt,
			})),
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Server error" });
	}
};

export const renameDirectory = async (req, res) => {
	try {
		const { newDirName } = req.body;

		const user = req.user; // logged-in user
		const dirId = req.params.id;

		if (!newDirName || !user || !dirId) {
			return res.status(400).json({
				success: true,
				message: "All fields are required",
			});
		}

		// check if the name already exist or not

		const existingDirname = await Directory.findOne({
			dirName: newDirName,
			owner: user._id,
		});

		if (existingDirname) {
			return res.status(409).json({
				success: false,
				message: "Failed to rename folder name already exists",
			});
		}

		const dir = await Directory.findOneAndUpdate(
			{ _id: dirId, owner: user._id },
			{ dirName: newDirName },
		);

		return res.status(200).json({
			success: true,
			message: "Rename successfully",
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Server error",
		});
	}
};

export const deleteDirectory = async (req, res) => {
	const { id } = req.params;

	try {
		const directoryData = await Directory.findOne({
			_id: id,
			owner: req.user._id,
		})
			.select("_id")
			.lean();

		if (!directoryData) {
			return res.status(404).json({
				success: false,
				message: "Directory not found!",
			});
		}

		async function getDirectoryContents(id) {
			let directories = await Directory.find({ parentDirId: id })
				.select("_id")
				.lean();

			for (const { _id } of directories) {
				const { directories: childDirectories } =
					await getDirectoryContents(_id);

				directories = [...directories, ...childDirectories];
			}

			return { directories };
		}

		const { directories } = await getDirectoryContents(id);

		await Directory.deleteMany({
			_id: { $in: [...directories.map(({ _id }) => _id), id] },
		});

		return res.status(200).json({
			success: true,
			message: "Folder deleted successfully",
		});
	} catch (err) {
		return res.status(500).json({
			success: false,
			message: "Server error",
		});
	}
};
