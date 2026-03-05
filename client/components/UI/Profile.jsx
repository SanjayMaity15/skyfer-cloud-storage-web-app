import React from "react";
import { BsArrowLeft } from "react-icons/bs";
import {
	CiCalendar,
	CiLock,
	CiStopwatch,
	CiTimer,
	CiWarning,
} from "react-icons/ci";
import { FaArrowLeft, FaEdit } from "react-icons/fa";
import { GrSecure } from "react-icons/gr";
import { HiOutlineMail } from "react-icons/hi";
import { IoMdKey } from "react-icons/io";
import { IoFemale, IoMale, IoPersonCircleOutline } from "react-icons/io5";
import { MdPerson, MdSecurity } from "react-icons/md";
import { TbCircleKey } from "react-icons/tb";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Profile = () => {
	const { user } = useSelector((state) => state.user);

	const navigate = useNavigate();

	return (
		<section className="h-screen p-6">
			<div className="h-full max-w-4xl mx-auto flex flex-col md:flex-row gap-7">
				{/* left side */}
				<div className="flex-1 flex flex-col items-center bg-linear-to-tl from-green-50 via-purple-50 to-green-50 p-6 shadow-md rounded-2xl relative">
					{/* back button */}
					<button
						className="absolute left-5 font-bold cursor-pointer text-xl"
						onClick={() => navigate(-1)}
					>
						<FaArrowLeft />
					</button>

					{/* profile pic */}
					{user?.profilePic ? (
						<div className="p-1 border-2 border-gray-400 rounded-full">
							<img
								src={user?.profilePic}
								alt={user.userName}
								className="rounded-full w-20 h-20 "
							/>
						</div>
					) : (
						<IoPersonCircleOutline className="text-5xl text-gray-500" />
					)}

					{/* details */}
					<h4 className="font-semibold mt-4 capitalize flex items-center gap-1">
						<MdPerson className="text-red-600" />
						{user?.userName}
					</h4>
					<p className="text-sm flex items-center gap-1">
						<HiOutlineMail className="text-red-600" />
						{user?.email}
					</p>
					<div className="flex text-sm mt-2 gap-2 items-center">
						<p className="font-semibold">Gender :</p>
						<div>
							{user?.gender === "male" ? (
								<p className="flex item-center gap-1 text-green-700">
									<IoMale className="mt-0.5" />
									<span>{user?.gender}</span>
								</p>
							) : (
								<p className="flex items-center gap-1 text-primary">
									<IoFemale className="mt-0.5" />
									<span>{user?.gender}</span>
								</p>
							)}
						</div>
					</div>
					<div className="mt-6 flex items-center shadow-md bg-white w-full px-4 rounded-full py-3 justify-between">
						<p className="text-sm font-semibold text-gray-500">
							ROLE
						</p>
						<p className="px-4 py-1 bg-bg-soft rounded-full uppercase text-xs text-red-600 shadow-md">
							{user?.role}
						</p>
					</div>
					<div className="mt-6 flex items-center shadow-md bg-white w-full px-4 rounded-full py-3 justify-between ">
						<p className="text-sm font-semibold text-gray-500">
							STATUS
						</p>

						<div className="flex items-center gap-1 px-4 py-1 bg-bg-soft rounded-full uppercase text-xs text-green-600 shadow-md">
							<div className="w-2 h-2 rounded-full bg-green-600 animate-pulse" />
							ACTIVE
						</div>
					</div>

					<button
						className="flex mt-12 items-center gap-2 bg-green-100 px-6 py-2 rounded-full text-green-700 cursor-pointer hover:bg-green-200 transition-colors duration-300"
						onClick={() => navigate("/edit-profile")}
					>
						Edit Details
						<FaEdit />
					</button>
				</div>

				{/* right side */}
				<div className="flex-2 flex flex-col justify-between gap-5">
					<div className="flex flex-col md:flex-row justify-between gap-5">
						{/* join date */}
						<div className="flex-1 shadow-md flex items-center justify-between p-6 rounded-2xl bg-linear-to-bl from-green-100 via-purple-50 to-white">
							<div className="flex flex-col gap-2">
								<span className="flex items-center text-xs gap-1 text-primary font-semibold">
									<CiCalendar className="text-lg font-semibold text-primary" />
									JOINED
								</span>
								<span className="text-sm font-semibold">
									{new Date(
										user?.createdAt,
									).toLocaleDateString("en-GB")}
								</span>
							</div>
							<div>
								<CiCalendar className="text-5xl text-gray-400" />
							</div>
						</div>

						{/* last profile update date */}
						<div className="flex-1 shadow-md flex items-center justify-between p-6 rounded-2xl bg-linear-to-bl from-green-100 via-purple-50 to-white">
							<div className="flex flex-col gap-2">
								<span className="flex items-center text-xs gap-1 text-secondary font-semibold">
									<CiStopwatch className="text-lg font-semibold text-secondary" />
									LAST UPDATE
								</span>
								<span className="text-sm font-semibold uppercase">
									{new Date(user?.updatedAt).toLocaleString(
										"en-GB",
										{
											day: "2-digit",
											month: "2-digit",
											year: "numeric",
											hour: "2-digit",
											minute: "2-digit",
											hour12: true,
										},
									)}
								</span>
								<span className="text-xs text-gray-400">
									Last profile details updated
								</span>
							</div>
							<div>
								<CiStopwatch className="text-5xl text-gray-400" />
							</div>
						</div>
					</div>

					{/* security alert section */}
					<div
						className={`shadow-md h-full rounded-2xl bg-linear-to-bl  ${user?.isSecure ? "bg-green-100" : "from-red-100"} via-40% via-white  to-white p-8 flex flex-col justify-between mb-6 md:mb-0`}
					>
						<div>
							<div className="flex justify-between">
								<div className="flex flex-col gap-2">
									<div className="flex items-center gap-2">
										<MdSecurity
											className={`${user?.isSecure ? "text-green-600" : "text-red-600"} text-2xl`}
										/>

										<span className="text-2xl font-semibold">
											Security Center
										</span>
									</div>
									<p className="text-sm text-gray-400">
										Manage your account security & access
										permission
									</p>
								</div>
								<div>
									{user?.isSecure ? (
										<button className="shadow-md bg-white flex items-center text-xs px-3 py-1 rounded-full text-green-600 font-semibold gap-1">
											<GrSecure className="text-sm" />
											SECURE
										</button>
									) : (
										<button className="shadow-md bg-white flex items-center text-xs px-3 py-1 rounded-full text-red-600 font-semibold gap-1">
											<CiWarning className="text-sm" /> AT
											RISK
										</button>
									)}
								</div>
							</div>

							<div className="flex mt-4 gap-4">
								<div className="p-4 rounded-full shadow-md bg-bg-soft">
									<IoMdKey className="text-4xl text-gray-400" />
								</div>
								<div className="flex flex-col justify-center">
									<span className="text-sm font-semibold">
										Password protection
									</span>
									{user?.isSecure ? (
										<span className="text-xs text-gray-400">
											Your account is fully secured
										</span>
									) : (
										<span className="text-xs text-gray-400">
											Your account has no password set
											password now
										</span>
									)}
								</div>
							</div>
						</div>
						<div className="flex justify-end">
							{user?.isSecure ? (
								<button
									className="flex items-center px-6 py-2 gap-1 bg-green-100 rounded-full text-green-700 cursor-pointer hover:bg-green-200 transition-colors duration-200"
									onClick={() => navigate("/add-password")}
								>
									<CiLock />
									Change Password
								</button>
							) : (
								<button
									className="flex items-center px-6 py-2 gap-1 bg-red-100 rounded-full text-red-700 cursor-pointer hover:bg-red-200 transition-colors duration-200"
									onClick={() => navigate("/add-password")}
								>
									<CiLock />
									Enable protection
								</button>
							)}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Profile;
