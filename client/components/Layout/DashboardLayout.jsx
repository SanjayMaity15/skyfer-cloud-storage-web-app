import React, { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { api } from "../../api/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import { getImageUrl } from "../../src/utils/getImageUrl";
import { MdDashboard, MdLogout, MdOutlineStarBorder } from "react-icons/md";
import { IoPersonCircleOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import { setUser } from "../../src/features/userSlice";
import Popup from "../UI/Popup";

const DashboardLayout = () => {
	// get user data from redux store
	const { user } = useSelector((state) => state.user);
	const [isOpenPopup, setIsOpenPopup] = useState(false);
	const location = useLocation();
	console.log(user);
	const isDashboard = location.pathname === "/dashboard";
	const isStarred = location.pathname === "/dashboard/starred";
	const navigate = useNavigate();
	const dispatch = useDispatch();
	// logout user functionality
	const handleLogoutUser = async () => {
		try {
			const result = await api.post(
				"/auth/logout",
				{},
				{ withCredentials: true },
			);
			toast.success(result?.data?.message);
			dispatch(setUser(null));

			navigate("/login");
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="flex h-screen">
			<aside className="w-1/5 bg-white flex flex-col justify-between">
				<div>
					{/* brand name */}
					<Link
						className="flex items-center cursor-pointer mt-2"
						to="/"
					>
						<img
							src={getImageUrl("brand.png")}
							alt="skyfer cloud storage app"
							className="w-30"
						/>
						<span className="text-3xl font-extrabold -ml-6 text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary font-lobster select-none">
							Skyfer
						</span>
					</Link>

					{/* menus */}

					<div className="flex flex-col mt-6 gap-1">
						<Link
							to="."
							className={`flex items-center gap-2 px-4 py-3 ${isDashboard && "bg-primary/10 text-primary border-r-4 border-primary"}`}
						>
							<MdDashboard className="text-lg" />
							Dashboard
						</Link>
						<Link
							to="starred"
							className={`flex items-center gap-2 px-4 py-3 ${isStarred && "bg-primary/10 text-primary border-r-4 border-primary"}`}
						>
							<MdOutlineStarBorder className="text-lg" />
							Starred
						</Link>
					</div>
				</div>

				{/* profile */}
				<div className="mb-6 flex flex-col gap-4 px-4">
					<div className="flex items-center">
						<div>
							<IoPersonCircleOutline
								className="text-4xl text-gray-600"
								onClick={() => navigate("/profile")}
							/>
						</div>

						<div className="flex flex-col text-xs">
							<span className="font-semibold">
								{user?.userName}
							</span>
							<span>{user?.email}</span>
						</div>
					</div>

					<div>
						<button
							className="flex items-center gap-1 bg-red-100 text-red-600 px-6 rounded-full text-sm py-2 tracking-wider cursor-pointer"
							onClick={() => setIsOpenPopup(true)}
						>
							Logout
							<MdLogout />
						</button>
					</div>

					<Popup
						isOpen={isOpenPopup}
						setIsOpen={setIsOpenPopup}
						heading="Logout Confirmation !"
						text="Are you sure to Logout"
						btn1="Cancel"
						btn2="Confirm"
						onCancel={setIsOpenPopup}
						onConfirm={handleLogoutUser}
					/>
				</div>
			</aside>
			<section>
				<Outlet />
			</section>
		</div>
	);
};

export default DashboardLayout;
