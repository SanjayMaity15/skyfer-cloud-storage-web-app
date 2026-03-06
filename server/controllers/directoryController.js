// create directory

import Directory from "../models/Directory.js";
import { directorySchema } from "../validators/directoryValidators.js";
import File from "../models/File.js";
import fs from "node:fs/promises";



/*
=========================================

		Create directory Controller

=========================================
*/

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


/*
=========================================

		Get directory Controller

=========================================
*/

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
				isStarred: dir.isStarred,
				createdAt: dir.createdAt,
			})),
			files: files.map((file) => ({
				_id: file._id,
				name: file.fileName,
				extension: file.extension,
				size: file.size,
				createdAt: file.createdAt,
				updatedAt: file.updatedAt,
			})),
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Server error" });
	}
};



/*
=========================================

		Rename directory Controller

=========================================
*/

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



/*
=========================================

		Delete directory Controller

=========================================
*/

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

			let files = await File.find({ parentDirId: id })
				.select("_id fileName")
				.lean();

			for (const { _id } of directories) {
				const { files: childFiles, directories: childDirectories } =
					await getDirectoryContents(_id);
				files = [...files, ...childFiles];
				directories = [...directories, ...childDirectories];
			}

			return { directories, files };
		}

		const { directories, files } = await getDirectoryContents(id);

		await Directory.deleteMany({
			_id: { $in: [...directories.map(({ _id }) => _id), id] },
		});

		await File.deleteMany({
			_id: { $in: [...files.map(({ _id }) => _id)] },
		});

		console.log(files)

		for (const { fileName } of files) {
			console.log(fileName)
			await fs.rm(`${process.cwd()}/storage/${fileName}`);
		}

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



/*
=========================================

		handle star directory Controller

=========================================
*/

export const handleAddStarToFolder = async (req, res) => {
	try {
		const { folderId } = req.body;
		const user = req.user;

		if (!folderId || !user) {
			return res.status(400).json({
				success: false,
				message: "Something went wrong",
			});
		}

		const starDir = await Directory.findOne({
			_id: folderId,
			owner: user._id,
		});

		starDir.isStarred = !starDir.isStarred;

		await starDir.save();

		return res.status(200).json({
			success: false,
			message: `${starDir.isStarred ? "Mark as imported folder" : "Remove from important folder"}`,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Server error",
		});
	}
};
