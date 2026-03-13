import React, { useEffect, useState } from "react";
import { api } from "../../api/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import { setAllUsers } from "../../features/allUserSlice";
import Popup from "./Popup";
import { toast } from "react-toastify";

const AdminHome = () => {
	const dispatch = useDispatch();
	const { allUsers } = useSelector((state) => state.allUsers);
	const { user } = useSelector((state) => state.user);
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
	};

	return (
		<section>
			<div className=" my-2 p-6">
				<div>
					<h2 className="text-3xl font-semibold mb-6 text-center">
						ADMIN PANEL
					</h2>
					<p className="text-sm font-semibold">
						ADMIN:{" "}
						<span className="text-primary">{user.userName}</span>
					</p>
				</div>

				<h2 className="text-xl font-semibold mt-6 mb-2 uppercase">
					Active User
				</h2>

				<div className="w-full overflow-x-auto">
					<table className="w-full border border-gray-400 border-collapse text-center">
						<thead className="bg-gray-100">
							<tr className="uppercase bg-linear-to-r from-secondary  to-primary text-white">
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
									<tr key={user._id} className="text-sm">
										<td className="bg-purple-200 border p-3 font-bold">
											{index + 1}
										</td>
										<td className="border p-3">
											{user.name}
										</td>
										<td className="border p-3">
											{user.email}
										</td>
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
												<span className="bg-white px-3 py-1 rounded-full text-sm flex items-center gap-1 justify-center">
													<span className="w-2 h-2 bg-green-600 block rounded-full animate-pulse"></span>
													Active
												</span>
											) : (
												<span className="bg-white px-3 py-1 rounded-full text-sm flex items-center gap-1 justify-center">
													<span className="w-2 h-2 bg-red-600 block rounded-full animate-pulse"></span>
													Inactive
												</span>
											)}
										</td>
										<td className="border p-3">
											<button
												className={`px-4 py-1 text-sm rounded-full border  cursor-pointer ${user.isLoggedIn ? "border-purple-600 bg-purple-100 text-purple-600 hover:bg-purple-200" : "bg-gray-100 text-black border-gray-500 line-through"}`}
												disabled={!user.isLoggedIn}
												onClick={() => {
													openUserLogoutPopup(
														user._id,
													);
												}}
											>
												Logout
											</button>
										</td>
										<td className="border p-3">
											<button
												className="px-4 py-1 text-sm bg-red-100 text-red-600 border border-red-300 hover:bg-red-200 rounded-full cursor-pointer"
												onClick={() => {
													openUserDeletePopUp(
														user._id,
													);
												}}
											>
												Delete
											</button>
										</td>
									</tr>
								))}
						</tbody>
					</table>
				</div>

				<h2 className="text-lg uppercase mt-6 font-semibold">
					Deleted Users
				</h2>

				<div className="w-full overflow-x-auto">
					<table className="w-full border text-center border-gray-400 border-collapse mt-2">
						<thead>
							<tr className="uppercase bg-linear-to-r from-primary to-secondary text-white">
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
										<td className="border p-3 bg-purple-200 font-bold">
											{index + 1}
										</td>
										<td className="border p-3">
											{user.name}
										</td>
										<td className="border p-3">
											{user.email}
										</td>
										<td className="border p-3">
											<button
												className="text-green-600 bg-green-100 border border-green-300 px-4 py-1 rounded-full cursor-pointer"
												onClick={() =>
													openUserRestorePopup(
														user._id,
													)
												}
											>
												Restore
											</button>
										</td>
									</tr>
								))}
						</tbody>
					</table>
				</div>
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
