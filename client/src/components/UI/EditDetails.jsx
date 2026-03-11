import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import ButtonLoader from "./ButtonLoader";
import { editProfileSchema } from "../../validators/authValidator";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { IoCameraOutline, IoPersonCircleOutline } from "react-icons/io5";
import axios from "axios";

const EditDetails = () => {
	const { user } = useSelector((state) => state.user);
	const { register, handleSubmit } = useForm({
		defaultValues: {
			userName: user.userName,
			gender: user.gender,
		},
	});

	const navigate = useNavigate();
	const [errors, setErrors] = useState({});
	const [loading, setLoading] = useState(false);
	const [file, setFile] = useState(null);
	const [profilePreview, setProfilePreview] = useState(user.profilePic || "");

	const handleEditDetails = async (editData) => {
		
		const { success, data, error } = editProfileSchema.safeParse(editData);

		if (!success) {
			const newError = {};
			error.issues.forEach(
				(err) => (newError[err.path[0]] = err.message),
			);

			setErrors(newError);
			return;
		}

		try {
			const formData = new FormData();
			formData.append("userName", data.userName);
			formData.append("profilePic", file);
			formData.append("gender", data.gender);

			
			setLoading(true);
			const result = await axios.post(
				`${import.meta.env.VITE_BASE_URL}/user/edit-profile`,
				formData,
				{ withCredentials: true },
			);
			toast.success(result?.data?.message);
			setLoading(false);
			navigate(-1);
		} catch (error) {
			
			toast.error(error?.response?.data?.message);
			setLoading(false);
			navigate(-1);
		}
	};

	return (
		<div className="min-h-screen flex pt-16 md:pt-0 md:items-center justify-center  p-6">
			<div className="w-full max-w-md h-fit bg-white rounded-3xl shadow-xl p-8">
				<h3 className="text-3xl font-bold text-center text-gray-800 mb-8">
					Edit Profile
				</h3>

				<form
					className="flex flex-col gap-6"
					onSubmit={handleSubmit(handleEditDetails)}
				>
					{/* profile pic */}
					<div className="flex flex-col gap-2 items-center">
						<label
							htmlFor="profilePic"
							className="relative cursor-pointer"
						>
							{profilePreview ? (
								<div className="relative">
									<img
										src={profilePreview}
										alt=""
										className="w-16 h-16 rounded-full"
									/>
									<IoCameraOutline className="absolute top-[70%] left-[75%] text-xl" />
								</div>
							) : (
								<div>
									{" "}
									<IoPersonCircleOutline className="text-6xl text-gray-500" />
									<IoCameraOutline className="text-xl absolute top-[65%] left-[70%]" />
								</div>
							)}
						</label>

						<input
							type="file"
							id="profilePic"
							className="hidden"
							name="profilePic"
							accept="image/*"
							onChange={(e) => {
								setProfilePreview(
									URL.createObjectURL(e.target.files[0]),
								);
								setFile(e.target.files[0]);
							}}
						/>
					</div>
					{/* Username */}
					<div className="flex flex-col gap-2">
						<label
							htmlFor="username"
							className="text-sm font-semibold"
						>
							Enter new username
						</label>

						<input
							type="text"
							id="username"
							placeholder="Enter username..."
							className="w-full px-4 py-2.5 rounded-xl border border-gray-400 
							focus:border-primary focus:ring-2 focus:ring-primary 
							outline-none focus:border-none transition duration-200"
							{...register("userName")}
						/>

						{errors.userName && (
							<p className="text-red-500 text-sm">
								{errors.userName}
							</p>
						)}
					</div>

					{/* Gender */}
					<div className="flex flex-col gap-2">
						<label
							htmlFor="gender"
							className="text-sm font-semibold"
						>
							Choose gender
						</label>

						<select
							id="gender"
							className="w-full px-4 py-2.5 rounded-xl border border-gray-400 
          focus:border-primary focus:border-none focus:ring-2 focus:ring-primary
          outline-none transition duration-200"
							{...register("gender")}
						>
							<option value="">Select gender</option>
							<option value="male">Male</option>
							<option value="female">Female</option>
						</select>

						{errors.gender && (
							<p className="text-red-500 text-sm">
								{errors.gender}
							</p>
						)}
					</div>

					{/* Button */}
					<button
						type="submit"
						className="w-full py-4 rounded-full font-semibold text-white bg-linear-to-r from-primary to-secondary hover:opacity-90 transition cursor-pointer "
						disabled={loading}
					>
						{loading ? (
							<ButtonLoader text="Saving" />
						) : (
							"Save changes"
						)}
					</button>
				</form>
			</div>
		</div>
	);
};

export default EditDetails;
