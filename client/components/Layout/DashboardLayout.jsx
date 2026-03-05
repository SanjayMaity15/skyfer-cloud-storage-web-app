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
import { FaArrowLeft, FaBars } from "react-icons/fa";

const DashboardLayout = () => {
	// get user data from redux store
	const { user } = useSelector((state) => state.user);
	const [isOpenPopup, setIsOpenPopup] = useState(false);
	const [isMbMenuActive, setIsMbMenuActive] = useState(false);
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
			toast.error(error?.response?.data?.message);
		}
	};

	console.log(isMbMenuActive);
	return (
		<div className="flex h-screen relative">
			<button
				className={`absolute md:hidden top-8 left-4 text-xl ${isMbMenuActive && "hidden"}`}
				onClick={() => setIsMbMenuActive((prev) => !prev)}
			>
				<FaBars />
			</button>

			<aside
				className={`
					fixed top-0 left-0 h-screen w-3/4 bg-white z-50 flex flex-col justify-between
					transform transition-transform duration-300 ease-in-out
					${isMbMenuActive ? "translate-x-0" : "-translate-x-full"}
					
					md:translate-x-0 
					md:static 
					md:w-1/5
				`}
			>
				<div>
					<button className="md:hidden relative top-2 left-2 text-xl" onClick={() => setIsMbMenuActive(prev => !prev)}>
						<FaArrowLeft/>
					</button>
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

			{/* mobile side bar */}

			<section className="w-full">
				<Outlet />
			</section>
		</div>
	);
};

export default DashboardLayout;
