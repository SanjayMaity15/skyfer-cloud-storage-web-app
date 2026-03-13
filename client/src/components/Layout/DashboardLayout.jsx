import  { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { api } from "../../api/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import { getImageUrl } from "../../utils/getImageUrl";
import { MdDashboard, MdLogout, MdOutlineStarBorder } from "react-icons/md";
import { IoPersonCircleOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import { setUser } from "../../features/userSlice";
import Popup from "../UI/Popup";
import { FaArrowLeft, FaBars, FaDatabase, FaTrashAlt } from "react-icons/fa";
import { convertBytes } from "../../utils/digitalUnitConverter";
import { MAX_STORAGE } from "../../constant/constant";

const DashboardLayout = () => {
	// get user data from redux store
	const { user } = useSelector((state) => state.user);
	const [isOpenPopup, setIsOpenPopup] = useState(false);
	const [isMbMenuActive, setIsMbMenuActive] = useState(false);
	const location = useLocation();
	
	const isDashboard = location.pathname === "/dashboard";
	const isTrash = location.pathname === "/dashboard/trash";
	
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

	

	return (
		<div className="flex h-screen relative">
			<button
				className={`absolute md:hidden top-9 left-4 text-2xl ${isMbMenuActive && "hidden"}`}
				onClick={() => setIsMbMenuActive((prev) => !prev)}
			>
				<FaBars />
			</button>

			<aside
				className={`
					fixed top-0 left-0 h-screen w-2/4 bg-white z-50 flex flex-col justify-between
					transform transition-transform duration-300 ease-in-out
					${isMbMenuActive ? "translate-x-0" : "-translate-x-full"}
					
					md:translate-x-0 
					md:static 
					md:w-1/5
				`}
			>
				<div>
					<button
						className="md:hidden relative top-2 left-2 text-xl"
						onClick={() => setIsMbMenuActive((prev) => !prev)}
					>
						<FaArrowLeft />
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
							className={`flex items-center gap-2 px-4 py-3 ${isDashboard && "bg-primary/20 text-primary border-r-4 border-primary"}`}
						>
							<MdDashboard className="text-lg" />
							Dashboard
						</Link>
					</div>

					{user?.role === "user" && (
						<div className="flex flex-col gap-1">
							<Link
								to="trash"
								className={`flex items-center gap-2 px-4 py-3 ${isTrash && "bg-primary/20 text-primary border-r-4 border-primary"}`}
							>
								<FaTrashAlt className="text-sm" />
								Trash
							</Link>
						</div>
					)}
				</div>

				{/* profile */}
				<div className="mb-6 flex flex-col gap-4 px-4 overflow-hidden">
					{user?.role === "user" && (
						<div className="flex justify-center bg-green-200 py-1 rounded-full border">
							<span className="flex items-center gap-2 text-xs">
								Used {convertBytes(user.storageUsed)} of{" "}
								{MAX_STORAGE} MB <FaDatabase />
							</span>
						</div>
					)}

					<div className="flex items-center">
						<div className="w-12">
							{user.profilePic ? (
								<img
									src={user.profilePic}
									alt={user.userName}
									className="w-8 h-8 rounded-full cursor-pointer"
									onClick={() => navigate("/profile")}
								/>
							) : (
								<IoPersonCircleOutline
									className="text-4xl text-gray-600 cursor-pointer"
									onClick={() => navigate("/profile")}
								/>
							)}
						</div>

						<div className="flex flex-col text-xs -ml-3">
							<span className="font-semibold">
								{user?.userName}
							</span>
							<span>{user?.email}</span>
						</div>
					</div>

					<div>
						<button
							className="flex items-center gap-1 bg-red-100 text-red-600 hover:bg-red-200 px-6 rounded-full text-sm py-2 tracking-wider cursor-pointer border"
							onClick={() => setIsOpenPopup(true)}
						>
							<MdLogout />
							Logout
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
