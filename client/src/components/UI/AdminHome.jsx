import React, { useEffect, useState } from "react";
import { api } from "../../../api/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import { setAllUsers } from "../../features/allUserSlice";
import Popup from "./Popup";
import { toast } from "react-toastify";

const AdminHome = () => {
	const dispatch = useDispatch();
	const { allUsers } = useSelector((state) => state.allUsers);

	const [isPopupOpen, setIsPopupOpen] = useState(false);
	const [userId, setUserId] = useState(null);

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

	// logout user

	const handleLogoutUser = async () => {
		try {
			const result = await api.post(
				`/admin/user/logout/${userId}`,
				{},
				{ withCredentials: true },
			);

			setIsPopupOpen(false)
			toast.success(result?.data?.message)
			fetchAllUsers()
		} catch (error) {
			setIsPopupOpen(false)
			toast.error(error?.response?.data?.message)
		}
	};

	console.log(userId)

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
						{allUsers?.map((user, index) => (
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
									{new Date(user.join).toLocaleDateString()}
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
											setIsPopupOpen(true);
											setUserId(user?._id);
										}}
									>
										Logout
									</button>
								</td>
								<td className="border p-3">
									<button className="px-4 py-1 text-sm bg-red-600 text-white rounded-full">
										Delete
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<Popup
				isOpen={isPopupOpen}
				setIsOpen={setIsPopupOpen}
				heading="Logout User"
				text="Are you sure to logout this user"
				btn1="Cancel"
				btn2="Confirm"
				onCancel={setIsPopupOpen}
				onConfirm={handleLogoutUser}
			/>
		</section>
	);
};

export default AdminHome;
