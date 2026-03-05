import React, { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { CiSearch } from "react-icons/ci";
import {
	FaArrowLeft,
	FaFolder,
	FaRegEye,
	FaRegFile,
	FaRegFolder,
	FaRegStar,
	FaStar,
} from "react-icons/fa";
import { FaCloudArrowUp } from "react-icons/fa6";
import { FiArrowLeft } from "react-icons/fi";
import { IoCloudDownload, IoCloudDownloadOutline } from "react-icons/io5";
import { MdOutlineCreate, MdOutlineCreateNewFolder } from "react-icons/md";
import DirectoryPopup from "./DirectoryPopup";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/axiosInstance";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useRef } from "react";
import axios from "axios";
import { getFileIcon } from "../../src/utils/getFileIcons";
import { convertBytes } from "../../src/utils/digitalUnitConverter";
import { truncateFileName } from "../../src/utils/wordTruncate";
import { timeFormat } from "../../src/utils/timeFormat";

const DashboardHome = () => {
	const { user } = useSelector((state) => state.user);
	const navigate = useNavigate();

	const fileUpload = useRef(null);

	const [loadingFolderId, setLoadingFolderId] = useState(null);

	// three dots operation
	const [threeDotes, setThreeDots] = useState(false);
	const [threeDotes2, setThreeDots2] = useState(false);
	const [currentFolder, setCurrentFolder] = useState(null);
	const [currentFile, setCurrentFile] = useState(null);
	const [uploadProgress, setUploadProgress] = useState(0);
	// current direactory and its data
	const [currentDir, setCurrentDir] = useState({
		_id: "",
		name: "",
		directories: [],
		files: [],
	});

	// file upload

	const handleFileUploadButtonClick = () => {
		fileUpload.current.click();
	};

	// search directory

	const [searchDir, setSearchDir] = useState("");
	const filterDirectory = currentDir.directories.filter((dir) =>
		dir.name.toLowerCase().includes(searchDir.toLowerCase()),
	);

	const [dirPopupConfig, setDirPopupConfig] = useState({
		isOpen: false,
		text: "",
		heading: "",
		type: "",
		btn1: "",
		btn2: "",
		onConfirm: null,
	});

	const openCreatePopup = () => {
		setDirPopupConfig({
			isOpen: true,
			text: "Create a folder to organize files",
			heading: "Create Folder",
			type: "input",
			btn1: "Cancel",
			btn2: "Create",
			onConfirm: handleCreateDirectory,
		});
	};
	const openRenamePopup = () => {
		setDirPopupConfig({
			isOpen: true,
			text: "Rename your folder",
			heading: "Rename Folder",
			type: "input",
			btn1: "Cancel",
			btn2: "Rename",
			onConfirm: handleRenameDirectory,
		});
	};
	// file rename
	const openFileRenamePopup = () => {
		setDirPopupConfig({
			isOpen: true,
			text: "Rename your file give file name only no extension",
			heading: "Rename file",
			type: "input",
			btn1: "Cancel",
			btn2: "Rename",
			onConfirm: handleRenameFile,
		});
	};
	const openDeletePopup = () => {
		setDirPopupConfig({
			isOpen: true,
			text: "Are you sure to delete folder",
			heading: "Delete Folder",
			type: "",
			btn1: "Cancel",
			btn2: "Delete",
			onConfirm: handleDeleteDirectory,
		});
	};
	const openFileDeletePopup = () => {
		setDirPopupConfig({
			isOpen: true,
			text: "Are you sure to delete file",
			heading: "Delete File",
			type: "",
			btn1: "Cancel",
			btn2: "Delete",
			onConfirm: handleDeleteFile,
		});
	};

	const handleCreateDirectory = async (dirName) => {
		try {
			const url = currentDir._id
				? `/dir/create/${currentDir._id}`
				: "/dir/create";

			const result = await api.post(
				url,
				{ dirName },
				{ withCredentials: true },
			);

			toast.success(result?.data?.message);

			getDirData(currentDir._id);
		} catch (error) {
			toast.error(error.response?.data?.message);
		}
	};

	const getDirData = async (dirId) => {
		try {
			setLoadingFolderId(dirId);
			const url = dirId ? `/dir/get-dir/${dirId}` : "/dir/get-dir";
			const result = await api.get(url, { withCredentials: true });

			// Store in state
			setCurrentDir({
				_id: result.data._id,
				name: result.data.name,
				directories: result.data.directories,
				files: result.data.files,
			});
			setLoadingFolderId(null);
		} catch (error) {
			setLoadingFolderId(null);
			console.log(error.response?.data?.message || error.message);
		}
	};

	useEffect(() => {
		getDirData();
	}, []);

	const handleRenameDirectory = async (dirName) => {
		const newDirName = dirName;
		try {
			const result = await api.post(
				`/dir/rename/${currentFolder}`,
				{ newDirName },
				{ withCredentials: true },
			);
			setCurrentFolder(null);
			toast.success(result?.data?.message);

			getDirData(currentDir._id);
		} catch (error) {
			toast.error(error?.response?.data?.message);
		}
	};

	const handleDeleteDirectory = async () => {
		try {
			const result = await api.delete(`/dir/delete/${currentFolder}`, {
				withCredentials: true,
			});
			setCurrentFolder(null);
			getDirData(currentDir._id);
			toast.success(result?.data?.message);
		} catch (error) {
			toast.error(error?.response?.data?.message);
		}
	};

	const handleStarRatedFolder = async (folderId) => {
		try {
			const result = await api.post(
				"/dir/starred",
				{ folderId },
				{ withCredentials: true },
			);
			setCurrentFolder(null);
			getDirData(currentDir._id);
			toast.success(result?.data?.message);
		} catch (error) {
			toast.error(error?.response?.data?.message);
		}
	};

	const handleFileUpload = async (e) => {
		const file = e.target.files[0];
		const formData = new FormData();
		formData.append("file", file);

		try {
			setUploadProgress(0);
			const result = await axios.post(
				`${import.meta.env.VITE_BASE_URL}/file/upload/${currentDir._id}`,
				formData,
				{
					onUploadProgress: (progressEvent) => {
						const percentCompleted = Math.round(
							(progressEvent.loaded * 100) / progressEvent.total,
						);
						setUploadProgress(percentCompleted);
					},
					withCredentials: true,
				},
			);
			setUploadProgress(0);
			toast.success(result?.data?.message);
		} catch (error) {
			setUploadProgress(0);
			toast.error(error?.response?.data?.message);
		}
	};

	// file preview

	const handleFilePreview = async (fileId) => {
		try {
			window.open(`${import.meta.env.VITE_BASE_URL}/file/view/${fileId}`);
		} catch (error) {
			console.log(error);
		}
	};

	// file download
	const handleFileDownload = async (fileId) => {
		try {
			window.open(
				`${import.meta.env.VITE_BASE_URL}/file/view/${fileId}?action=download`,
			);
		} catch (error) {
			console.log(error);
		}
	};

	// 	handle reanme files

	const handleRenameFile = async (newFileName) => {
		try {
			const result = await api.post(
				`/file/rename/${currentFile}`,
				{ newFileName },
				{ withCredentials: true },
			);
			toast.success(result?.data?.message);
		} catch (error) {
			toast.error(error?.response?.data?.message);
		}
	};

	// handle delete file
	const handleDeleteFile = async () => {
		try {
			const result = await api.delete(`/file/delete/${currentFile}`, {
				withCredentials: true,
			});
			toast.success(result?.data?.message);
		} catch (error) {
			toast.error(error?.response?.data?.message);
		}
	};

	return (
		<div className="w-full ">
			{/* serach section */}
			<div className="flex flex-col-reverse md:flex md:justify-between p-6 gap-3">
				<div className="flex-1 relative md:w-1/2">
					<CiSearch className="absolute top-3 left-3" />
					<input
						type="text"
						className="bg-white py-2 px-8 focus:ring-2 ring-primary focus:border-none focus:outline-none w-full rounded-full shadow-xs"
						placeholder="Search folder..."
						value={searchDir}
						onChange={(e) => setSearchDir(e.target.value)}
					/>
				</div>
				<div className="flex-2 text-2xl flex justify-end gap-3">
					<button
						className="w-10 h-10 rounded-full bg-primary flex justify-center items-center hover:bg-pink-800 cursor-pointer"
						onClick={handleFileUploadButtonClick}
						disabled={uploadProgress}
					>
						<FaCloudArrowUp className=" text-white" />
					</button>

					{/* input file field but hidden */}
					<input
						type="file"
						ref={fileUpload}
						name="file"
						style={{ display: "none" }}
						onChange={handleFileUpload}
					/>

					<div
						className="w-10 h-10 rounded-full bg-primary hover:bg-pink-800 cursor-pointer flex justify-center items-center"
						onClick={() => {
							openCreatePopup();
						}}
					>
						<MdOutlineCreateNewFolder className=" text-white" />
					</div>
				</div>
			</div>
			{/* upload progress */}
			{uploadProgress > 0 && (
				<div className="h-4 w-[80%] md:w-[50%] mx-auto border border-green-300 rounded-full bg-green-100 mb-4">
					<div
						className="h-4 rounded-full bg-green-400 text-center text-xs flex items-center justify-center font-semibold text-white"
						style={{ width: `${uploadProgress}%` }}
					>
						{uploadProgress}%
					</div>
				</div>
			)}
			{/* path */}
			<div className="bg-white shadow-xs py-4 flex flex-col md:flex-row justify-between md:items-center px-4 gap-2">
				<div className="flex items-center gap-2">
					<FaArrowLeft className="text-gray-500" />
					<span>PATH</span>
				</div>
				<div className="flex gap-2 justify-end">
					<div className="flex items-center gap-1 bg-yellow-50 text-yellow-600 text-xs font-semibold px-4 py-1 border border-yellow-600 rounded-full">
						<FaRegFolder />
						Folders {currentDir.directories.length}
					</div>
					<div className="flex items-center gap-1 bg-indigo-50 text-indigo-600 text-xs font-semibold px-4 py-1 border border-indigo-600 rounded-full">
						<FaRegFile />
						Files {currentDir.files.length}
					</div>
				</div>
			</div>
			{/* folder */}
			<div className="p-6">
				<h2 className="mb-2 font-semibold uppercase text-gray-500">
					Directories
				</h2>
				<div className="h-0.5 bg-gray-300 mb-2" />

				<div className="grid grid-cols-1 gap-2">
					{filterDirectory.map((dir) => (
						<div
							key={dir._id}
							className="rounded-sm shadow-2xs bg-white md:p-2 p-4 flex flex-col relative"
							title={`${dir.name}\n${convertBytes(dir.size)}\nCreated AT : ${timeFormat(dir.createdAt)}`}
						>
							{dir._id === loadingFolderId ? (
								<p className="text-primary flex justify-center items-center">
									Opening...
								</p>
							) : (
								<div className="flex flex-col md:flex-row justify-between gap-3 md:items-center">
									<div className="flex items-center justify-between gap-4">
										<div className="flex items-center gap-2">
											<div className="self-center bg-amber-50 border border-amber-200 p-2 rounded-full">
												<FaFolder className="text-2xl text-amber-400" />
											</div>
											<div className="flex flex-col">
												<span
													className="text-sm font-semibold cursor-pointer capitalize hover:underline hover:text-indigo-700"
													onClick={() =>
														getDirData(dir._id)
													} // open subdirectory
												>
													{dir.name}
												</span>

												{/* size folder */}
											</div>
										</div>

										{/* for mobile view */}
										<div className="md:hidden flex gap-4">
											<button
												className="cursor-pointer "
												onClick={() =>
													handleStarRatedFolder(
														dir._id,
													)
												}
											>
												{dir?.isStarred ? (
													<FaStar className="text-yellow-400" />
												) : (
													<FaRegStar />
												)}
											</button>

											<button
												className="cursor-pointer"
												onClick={() => {
													setThreeDots(
														(prev) => !prev,
													);
													setCurrentFolder(dir._id);
												}}
											>
												<BsThreeDotsVertical />
											</button>
										</div>
									</div>

									<div className="flex items-center gap-4">
										{/* date */}
										<span className="text-xs text-yellow-600 font-semibold bg-yellow-50 border border-amber-300 px-2 py-1 rounded-full">
											Created At : {timeFormat(dir.createdAt)}
										</span>

										<button
											className="hidden md:flex cursor-pointer"
											onClick={() =>
												handleStarRatedFolder(dir._id)
											}
										>
											{dir?.isStarred ? (
												<FaStar className="text-yellow-400" />
											) : (
												<FaRegStar />
											)}
										</button>

										<button
											className="cursor-pointer hidden md:flex"
											onClick={() => {
												setThreeDots((prev) => !prev);
												setCurrentFolder(dir._id);
											}}
										>
											<BsThreeDotsVertical />
										</button>
									</div>

									{dir._id === currentFolder &&
										threeDotes && (
											<div className="absolute right-0 top-15 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden animate-fadeIn">
												<button
													onClick={() => {
														openRenamePopup();
														setThreeDots(false);
													}}
													className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150 cursor-pointer"
												>
													Rename
												</button>

												<button
													onClick={() => {
														openDeletePopup();
														setThreeDots(false);
													}}
													className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150 cursor-pointer"
												>
													Delete
												</button>
											</div>
										)}
								</div>
							)}
						</div>
					))}
				</div>
			</div>
			{/* files */}
			<div className="px-6">
				<h2 className="mb-2 font-semibold uppercase text-gray-500">
					Files{" "}
				</h2>
				<div className="h-0.5 bg-gray-300 mb-2" />
				<div className="flex flex-col gap-2">
					{currentDir?.files.map((file) => {
						const {
							icon: FileIcon,
							color,
							bg,
							border,
						} = getFileIcon(file.extension);

						return (
							<div
								key={file._id}
								className=" rounded-sm shadow-2xs bg-white md:p-2 p-4 md:items-center flex-col md:flex-row flex justify-between gap-4 relative"
								title={`${file.name}\n${convertBytes(file.size)}\n${timeFormat(file.createdAt)}`}
							>
								<div className="flex items-center justify-between gap-5">
									<div className="flex items-center gap-2">
										<div
											className={`${bg} ${border} p-2 rounded-full border`}
										>
											<FileIcon
												className={`text-2xl ${color}`}
											/>
										</div>
										<div className="flex flex-col">
											<span className="text-sm font-semibold hover:underline hover:text-indigo-700 cursor-pointer">
												{truncateFileName(file.name)}
											</span>
											<span className="text-xs text-gray-500">
												{convertBytes(file.size)}
											</span>
										</div>
									</div>

									<button
										className="md:hidden cursor-pointer"
										onClick={() => {
											setCurrentFile(file._id);
											setThreeDots2((prev) => !prev);
										}}
									>
										<BsThreeDotsVertical />
									</button>
								</div>

								<div>
									<p className="md:hidden text-xs text-primary bg-pink-100 px-4 py-1 rounded-full border border-pink-300 font-semibold text-center">
										Created At : {timeFormat(file.createdAt)}
									</p>
								</div>

								<div className="flex items-center justify-between gap-4">
									<div className="flex justify-center w-full gap-2">
										<p className="hidden md:flex text-xs text-primary bg-pink-100 px-4 py-1 rounded-full border border-pink-300 font-semibold text-center">
											Created At :{" "}
											{new Date(
												file.createdAt,
											).toLocaleString("en-GB", {
												day: "2-digit",
												month: "2-digit",
												year: "numeric",
											})}
										</p>

										<button
											className="bg-indigo-100 text-indigo-700 font-semibold md:px-2 px-4 py-1 rounded-full text-xs flex items-center gap-1 cursor-pointer hover:bg-indigo-200 transition-colors duration-200"
											onClick={() =>
												handleFilePreview(file._id)
											}
										>
											<FaRegEye className="text-sm" />
											Preview
										</button>
										<button
											className="bg-green-100 text-green-700 font-semibold md:px-2 px-4 py-1 rounded-full text-xs flex items-center gap-1 cursor-pointer hover:bg-green-200 transition-colors duration-200"
											onClick={() =>
												handleFileDownload(file._id)
											}
										>
											<IoCloudDownloadOutline className="text-sm" />
											Download
										</button>
									</div>

									<button
										className="md:flex hidden cursor-pointer"
										onClick={() => {
											setCurrentFile(file._id);
											setThreeDots2((prev) => !prev);
										}}
									>
										<BsThreeDotsVertical />
									</button>

									{file._id === currentFile &&
										threeDotes2 && (
											<div className="absolute right-0 top-15 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden animate-fadeIn">
												<button
													onClick={() => {
														openFileRenamePopup();
														setThreeDots2(false);
													}}
													className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150 cursor-pointer"
												>
													Rename
												</button>

												<button
													onClick={() => {
														openFileDeletePopup();
														setThreeDots2(false);
													}}
													className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150 cursor-pointer"
												>
													Delete
												</button>
											</div>
										)}
								</div>
							</div>
						);
					})}
				</div>
			</div>
			{/* directory popup */}
			'
			<DirectoryPopup
				isOpen={dirPopupConfig.isOpen}
				heading={dirPopupConfig.heading}
				btn1={dirPopupConfig.btn1}
				btn2={dirPopupConfig.btn2}
				type={dirPopupConfig.type}
				text={dirPopupConfig.text}
				onCancel={() =>
					setDirPopupConfig((prev) => ({ ...prev, isOpen: false }))
				}
				onConfirm={dirPopupConfig.onConfirm}
			/>
		</div>
	);
};

export default DashboardHome;
