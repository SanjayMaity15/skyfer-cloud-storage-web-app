import React, { useEffect, useState } from "react";
import { api } from "../../../api/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import { setAllUsers } from "../../features/allUserSlice";
import Popup from "./Popup";
import { toast } from "react-toastify";

const AdminHome = () => {
	const dispatch = useDispatch();
	const { allUsers } = useSelector((state) => state.allUsers);

	const fetchAllUsers = async () => {
		try {
			const result = await api.get("/admin/users", {
				withCredentials: true,
			});
			const { data } = result.data;
			dispatch(setAllUsers(data));
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		fetchAllUsers();
	}, []);

	const [popupContent, setPopupContent] = useState({
		isOpen: false,
		btn1: "",
		btn2: "",
		onConfirm: null,
		heading: "",
		text: "",
	});

	// logout user

	const handleLogoutUser = async (id) => {
		try {
			const result = await api.post(
				`/admin/user/logout/${id}`,
				{},
				{ withCredentials: true },
			);

			toast.success(result?.data?.message);
			fetchAllUsers();
		} catch (error) {
			toast.error(error?.response?.data?.message);
		}
	};

	const handleDeleteUser = async (id) => {
		try {
			const result = await api.post(
				`/admin/user/delete/${id}`,
				{},
				{ withCredentials: true },
			);

			toast.success(result?.data?.message);
			fetchAllUsers();
		} catch (error) {
			toast.error(error?.response?.data?.message);
		}
	};

	const handleRestoreUser = async (id) => {
		try {
			const result = await api.post(
				`/admin/user/restore/${id}`,
				{},
				{ withCredentials: true },
			);

			toast.success(result?.data?.message);
			fetchAllUsers();
		} catch (error) {
			toast.error(error?.response?.data?.message);
		}
	};

	const openUserLogoutPopup = (id) => {
		setPopupContent({
			isOpen: true,
			heading: "Logout User",
			text: "Are you sure to logout this user",
			onConfirm: () => handleLogoutUser(id),
			btn1: "Cancel",
			btn2: "Confirm",
		});
	};
	const openUserDeletePopUp = (id) => {
		setPopupContent({
			isOpen: true,
			heading: "Delete User",
			text: "Are you sure to delete this user",
			onConfirm: () => handleDeleteUser(id),
			btn1: "Cancel",
			btn2: "Delete",
		});
	};

	const openUserRestorePopup = (id) => {
		setPopupContent({
			isOpen: true,
			heading: "Restore User",
			text: "Are you sure to restore this user",
			onConfirm: () => handleRestoreUser(id),
			btn1: "Cancel",
			btn2: "Restore",
		});
	}

	console.log(allUsers);

	return (
		<section>
			<div className="text-center my-2 p-6">
				<h2 className="text-2xl font-semibold mb-6">ADMIN PANEL</h2>

				<table className="w-full border border-gray-400 border-collapse">
					<thead className="bg-gray-100">
						<tr className="uppercase">
							<th className="border p-3">SI No</th>
							<th className="border p-3">Name</th>
							<th className="border p-3">Email</th>
							<th className="border p-3">Gender</th>
							<th className="border p-3">Join</th>
							<th className="border p-3">Status</th>
							<th className="border p-3">Logout</th>
							<th className="border p-3">Delete</th>
						</tr>
					</thead>

					<tbody>
						{allUsers
							?.filter((user) => !user.isDeleted)
							.map((user, index) => (
								<tr
									key={user._id}
									className="odd:bg-purple-200 text-sm"
								>
									<td className="border p-3 font-bold">
										{index + 1}
									</td>
									<td className="border p-3">{user.name}</td>
									<td className="border p-3">{user.email}</td>
									<td className="border p-3 capitalize">
										{user.gender}
									</td>
									<td className="border p-3">
										{new Date(
											user.join,
										).toLocaleDateString()}
									</td>
									<td className="border p-3">
										{user.isLoggedIn ? (
											<span className="bg-white px-3 py-1 rounded-full text-sm shadow-md flex items-center gap-1 justify-center">
												<span className="w-2 h-2 bg-green-600 block rounded-full animate-pulse"></span>
												Active
											</span>
										) : (
											<span className="bg-white px-3 py-1 rounded-full text-sm shadow-md flex items-center gap-1 justify-center">
												<span className="w-2 h-2 bg-red-600 block rounded-full animate-pulse"></span>
												Inactive
											</span>
										)}
									</td>
									<td className="border p-3">
										<button
											className={`px-4 py-1 text-sm rounded-full text-white cursor-pointer ${user.isLoggedIn ? "bg-yellow-500" : "bg-gray-400 line-through"}`}
											disabled={!user.isLoggedIn}
											onClick={() => {
												openUserLogoutPopup(user._id);
											}}
										>
											Logout
										</button>
									</td>
									<td className="border p-3">
										<button
											className="px-4 py-1 text-sm bg-red-600 text-white rounded-full"
											onClick={() => {
												openUserDeletePopUp(user._id);
											}}
										>
											Delete
										</button>
									</td>
								</tr>
							))}
					</tbody>
				</table>

				<h2 className="text-lg uppercase mt-6 ">Deleted Users</h2>

				<table className="w-full border border-gray-400 border-collapse mt-6">
					<thead>
						<tr className="uppercase">
							<th className="border p-3">SI NO</th>
							<th className="border p-3">name</th>
							<th className="border p-3">email</th>
							<th className="border p-3">restore</th>
						</tr>
					</thead>
					<tbody>
						{allUsers
							?.filter((user) => user.isDeleted)
							.map((user, index) => (
								<tr key={user._id} className="text-sm">
									<td className="border p-3">{index + 1}</td>
									<td className="border p-3">{user.name}</td>
									<td className="border p-3">{user.email}</td>
									<td className="border p-3">
										<button className="text-white bg-secondary px-4 py-1 rounded-full cursor-pointer" onClick={() => openUserRestorePopup(user._id)}>Restore</button>
									</td>
								</tr>
							))}
					</tbody>
				</table>
			</div>

			<Popup
				isOpen={popupContent.isOpen}
				heading={popupContent.heading}
				text={popupContent.text}
				btn1={popupContent.btn1}
				btn2={popupContent.btn2}
				onCancel={() =>
					setPopupContent((prev) => ({ ...prev, isOpen: false }))
				}
				onConfirm={popupContent.onConfirm}
			/>
		</section>
	);
};

export default AdminHome;
