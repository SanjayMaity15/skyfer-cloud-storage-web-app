import React, { useEffect, useRef, useState } from "react";
import {
	FaFolder,
	FaRegFile,
	FaRegStar,
	FaStar,
	FaArrowLeft,
} from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaCloudArrowUp } from "react-icons/fa6";
import { MdOutlineCreateNewFolder } from "react-icons/md";
import { toast } from "react-toastify";
import axios from "axios";
import { api } from "../../api/axiosInstance";
import DirectoryPopup from "./DirectoryPopup";

const DashboardHome = () => {
	const fileUploadRef = useRef(null);

	const [currentDir, setCurrentDir] = useState(null);
	const [breadcrumbs, setBreadcrumbs] = useState([{ _id: "", name: "Root" }]);

	const [menuFolderId, setMenuFolderId] = useState(null);

	const [dirPopupConfig, setDirPopupConfig] = useState({
		isOpen: false,
		heading: "",
		text: "",
		type: "",
		btn1: "",
		btn2: "",
		onConfirm: null,
	});

	// ================= FETCH DIRECTORY =================
	const getDirData = async (dirId = "") => {
		try {
			const url = dirId ? `/dir/get-dir/${dirId}` : "/dir/get-dir";
			const res = await api.get(url, { withCredentials: true });
			setCurrentDir(res.data);
		} catch (err) {
			toast.error(err.response?.data?.message || err.message);
		}
	};

	useEffect(() => {
		getDirData();
	}, []);

	// ================= OPEN FOLDER =================
	const openFolder = async (folderId, folderName) => {
		await getDirData(folderId);

		setBreadcrumbs((prev) => [
			...prev,
			{ _id: folderId, name: folderName },
		]);
	};

	// ================= BREADCRUMB CLICK =================
	const handleBreadcrumbClick = async (index) => {
		const newCrumbs = breadcrumbs.slice(0, index + 1);
		const selected = newCrumbs[newCrumbs.length - 1];

		setBreadcrumbs(newCrumbs);
		await getDirData(selected._id);
	};

	// ================= BACK BUTTON =================
	const handleBack = async () => {
		if (breadcrumbs.length <= 1) return;

		const newCrumbs = breadcrumbs.slice(0, -1);
		const previous = newCrumbs[newCrumbs.length - 1];

		setBreadcrumbs(newCrumbs);
		await getDirData(previous._id);
	};

	// ================= CREATE =================
	const handleCreateDirectory = async (dirName) => {
		try {
			const url = currentDir?._id
				? `/dir/create/${currentDir._id}`
				: "/dir/create";

			await api.post(url, { dirName }, { withCredentials: true });

			toast.success("Folder created");
			getDirData(currentDir?._id);
		} catch (err) {
			toast.error(err.response?.data?.message);
		}
	};

	const openCreatePopup = () => {
		setDirPopupConfig({
			isOpen: true,
			heading: "Create Folder",
			text: "Enter folder name",
			type: "input",
			btn1: "Cancel",
			btn2: "Create",
			onConfirm: handleCreateDirectory,
		});
	};

	// ================= RENAME =================
	const handleRename = async (newName) => {
		try {
			await api.post(
				`/dir/rename/${menuFolderId}`,
				{ newDirName: newName },
				{ withCredentials: true },
			);

			toast.success("Folder renamed");
			getDirData(currentDir._id);
		} catch (err) {
			toast.error(err.response?.data?.message);
		}
	};

	const openRenamePopup = (id) => {
		setMenuFolderId(id);
		setDirPopupConfig({
			isOpen: true,
			heading: "Rename Folder",
			text: "Enter new name",
			type: "input",
			btn1: "Cancel",
			btn2: "Rename",
			onConfirm: handleRename,
		});
	};

	// ================= DELETE =================
	const handleDelete = async () => {
		try {
			await api.delete(`/dir/delete/${menuFolderId}`, {
				withCredentials: true,
			});

			toast.success("Folder deleted");
			getDirData(currentDir._id);
		} catch (err) {
			toast.error(err.response?.data?.message);
		}
	};

	const openDeletePopup = (id) => {
		setMenuFolderId(id);
		setDirPopupConfig({
			isOpen: true,
			heading: "Delete Folder",
			text: "Are you sure?",
			type: "",
			btn1: "Cancel",
			btn2: "Delete",
			onConfirm: handleDelete,
		});
	};

	// ================= STAR =================
	const handleStar = async (folderId) => {
		try {
			await api.post(
				"/dir/starred",
				{ folderId },
				{ withCredentials: true },
			);

			getDirData(currentDir._id);
		} catch (err) {
			toast.error(err.response?.data?.message);
		}
	};

	// ================= FILE UPLOAD =================
	const handleFileUploadClick = () => {
		fileUploadRef.current.click();
	};

	const handleFileUpload = async (e) => {
		const file = e.target.files[0];
		if (!file) return;

		const formData = new FormData();
		formData.append("file", file);

		try {
			await axios.post(
				`http://localhost:8000/api/file/upload/${currentDir?._id || ""}`,
				formData,
				{ withCredentials: true },
			);

			toast.success("File uploaded");
			getDirData(currentDir?._id);
		} catch (err) {
			toast.error(err.response?.data?.message);
		}
	};

	if (!currentDir) return <p className="p-6">Loading...</p>;

	return (
		<div className="w-full p-6">
			{/* ================= HEADER (BACK + BREADCRUMB) ================= */}
			<div className="flex items-center gap-3 mb-6">
				<button
					onClick={handleBack}
					disabled={breadcrumbs.length <= 1}
					className={`p-2 rounded-full border ${
						breadcrumbs.length <= 1
							? "text-gray-300 cursor-not-allowed"
							: "hover:bg-gray-100"
					}`}
				>
					<FaArrowLeft />
				</button>

				<div className="flex flex-wrap items-center gap-2">
					{breadcrumbs.map((crumb, index) => (
						<div key={index} className="flex items-center gap-2">
							<span
								onClick={() => handleBreadcrumbClick(index)}
								className={`cursor-pointer ${
									index === breadcrumbs.length - 1
										? "font-semibold text-black"
										: "text-gray-500 hover:text-primary"
								}`}
							>
								{crumb.name}
							</span>

							{index !== breadcrumbs.length - 1 && (
								<span className="text-gray-400">/</span>
							)}
						</div>
					))}
				</div>
			</div>

			{/* ================= ACTION BUTTONS ================= */}
			<div className="flex justify-end gap-3 mb-6">
				<button
					onClick={handleFileUploadClick}
					className="w-10 h-10 bg-primary rounded-full flex justify-center items-center text-white"
				>
					<FaCloudArrowUp />
				</button>

				<input
					type="file"
					ref={fileUploadRef}
					style={{ display: "none" }}
					onChange={handleFileUpload}
				/>

				<button
					onClick={openCreatePopup}
					className="w-10 h-10 bg-primary rounded-full flex justify-center items-center text-white"
				>
					<MdOutlineCreateNewFolder />
				</button>
			</div>

			{/* ================= FOLDERS ================= */}
			<div className="grid grid-cols-4 gap-5">
				{currentDir.directories?.map((dir) => (
					<div
						key={dir._id}
						className="bg-white shadow rounded p-4 relative hover:shadow-md"
					>
						<div className="flex justify-between">
							<div
								onClick={() => openFolder(dir._id, dir.name)}
								className="flex items-center gap-2 cursor-pointer"
							>
								<FaFolder className="text-yellow-500 text-2xl" />
								<span className="font-medium capitalize">
									{dir.name}
								</span>
							</div>

							<button
								onClick={() =>
									setMenuFolderId(
										menuFolderId === dir._id
											? null
											: dir._id,
									)
								}
							>
								<BsThreeDotsVertical />
							</button>
						</div>

						<p className="text-xs text-gray-400 mt-3">
							{new Date(dir.createdAt).toLocaleString()}
						</p>

						<button
							onClick={() => handleStar(dir._id)}
							className="absolute bottom-3 right-3"
						>
							{dir.isStarred ? (
								<FaStar className="text-yellow-400" />
							) : (
								<FaRegStar />
							)}
						</button>

						{menuFolderId === dir._id && (
							<div className="absolute right-2 top-10 bg-white border rounded shadow w-28 z-50">
								<button
									onClick={() => openRenamePopup(dir._id)}
									className="block w-full text-left px-3 py-2 hover:bg-gray-100"
								>
									Rename
								</button>
								<button
									onClick={() => openDeletePopup(dir._id)}
									className="block w-full text-left px-3 py-2 text-red-600 hover:bg-red-50"
								>
									Delete
								</button>
							</div>
						)}
					</div>
				))}
			</div>

			{/* ================= FILES ================= */}
			<div className="grid grid-cols-4 gap-5 mt-6">
				{currentDir.files?.map((file) => (
					<div
						key={file._id}
						className="bg-white shadow rounded p-4 hover:shadow-md"
					>
						<div className="flex items-center gap-2">
							<FaRegFile className="text-gray-600 text-xl" />
							<span>{file.name}</span>
						</div>

						<p className="text-xs text-gray-400 mt-2">
							{(file.size / 1024).toFixed(2)} KB
						</p>

						<p className="text-xs text-gray-400">
							{new Date(file.createdAt).toLocaleString()}
						</p>
					</div>
				))}
			</div>

			<DirectoryPopup
				isOpen={dirPopupConfig.isOpen}
				heading={dirPopupConfig.heading}
				text={dirPopupConfig.text}
				type={dirPopupConfig.type}
				btn1={dirPopupConfig.btn1}
				btn2={dirPopupConfig.btn2}
				onCancel={() =>
					setDirPopupConfig((prev) => ({ ...prev, isOpen: false }))
				}
				onConfirm={dirPopupConfig.onConfirm}
			/>
		</div>
	);
};

export default DashboardHome;
