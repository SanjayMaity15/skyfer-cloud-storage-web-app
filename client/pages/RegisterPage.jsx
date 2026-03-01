import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { getImageUrl } from "../src/utils/getImageUrl";
import { registrationSchema } from "../validators/authValidator";
import { useState } from "react";
import { api } from "../api/axiosInstance";
import ButtonLoader from "../components/UI/ButtonLoader";
import { toast } from "react-toastify";

const RegisterPage = () => {
	const { register, handleSubmit } = useForm({
		defaultValues: {
			userName: "Sanjay Maity",
			email: "sanjaydummy18@gmail.com",
			password: "123456",
		},
	});

	const [loading, setLoading] = useState(false)

	// naviagte
	const navigate = useNavigate()

	// Error state
	const [errors, setErrors] = useState({});

	const handleRegisterForm = async (registrationData) => {
		const { success, data, error } =
			registrationSchema.safeParse(registrationData);

		if (!success) {
			const regFormError = {};

			error.issues.forEach(
				(err) => (regFormError[err.path[0]] = err.message),
			);

			setErrors(regFormError);
		}

		try {
			setLoading(true)
			const { email } = data;
			const result = await api.post("/auth/send-otp", { email }, { withCredentials: true });
			toast.success(result?.data?.message)
			navigate("/otp", { state: data })
			setLoading(false)
		} catch (error) {
			console.log(error);
			setLoading(false)
		}
	};

	console.log(errors);

	return (
		<div className="min-h-screen flex bg-bg-soft">
			{/* LEFT SIDE */}
			<div className="hidden md:flex w-1/2 bg-linear-to-br from-primary/80 to-secondary/80 text-white flex-col justify-start gap-4 items-start p-12 rounded-r-full">
				{/* Logo */}
				<div className="flex items-center justify-start mt-6">
					<img
						src={getImageUrl("brand.png")}
						alt="skyfer cloud storage app"
						className="lg:w-50 md:w-40 -ml-12"
					/>
					<span className="lg:text-5xl md:text-4xl font-extrabold -ml-8 text-white font-lobster">
						Skyfer
					</span>
				</div>

				{/* Content */}
				<div>
					<h1 className="lg:text-4xl md:text-3xl font-bold leading-tight">
						Create Your Account
						<br />
						Start Your Cloud Journey
					</h1>

					<p className="mt-4 text-white/80 lg:w-3/4">
						Store, sync, and access your files securely with
						lightning-fast performance. Your data, anytime anywhere.
					</p>
				</div>
			</div>

			{/* RIGHT SIDE */}
			<div className="w-full md:w-1/2 flex items-center justify-center bg-bg-soft px-6">
				<div className="w-full max-w-md">
					{/* Title */}
					<h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
						Register
					</h2>

					{/* Form */}
					<form
						className="space-y-4"
						onSubmit={handleSubmit(handleRegisterForm)}
					>
						<div>
							<input
								type="text"
								placeholder="Enter full name..."
								className="w-full p-2 px-4 rounded-full bg-white shadow-md focus:ring-1 focus:ring-primary focus:outline-none"
								{...register("userName")}
							/>
							{errors.userName && (
								<p className="text-red-500 pl-4 text-sm mt-1">
									{errors.userName}
								</p>
							)}
						</div>

						<div>
							<input
								type="email"
								placeholder="Enter email Address..."
								className="w-full p-2  px-4 rounded-full bg-white shadow-md  focus:ring-1 focus:ring-primary focus:outline-none"
								{...register("email")}
							/>
							{errors.email && (
								<p className="text-red-500 pl-4 text-sm mt-1">
									{errors.email}
								</p>
							)}
						</div>

						<div>
							<input
								type="password"
								placeholder="Enter password..."
								className="w-full p-2 px-4 rounded-full bg-white shadow-md focus:ring-1 focus:ring-primary focus:outline-none"
								{...register("password")}
							/>
							{errors.password && (
								<p className="text-red-500 pl-4 text-sm mt-1">
									{errors.password}
								</p>
							)}
						</div>

						{/* Button */}
						<button
							type="submit"
							className="w-full py-4 rounded-full font-semibold text-white bg-linear-to-r from-primary to-secondary hover:opacity-90 transition cursor-pointer"
							disabled={loading}
						>
							{loading ? <ButtonLoader text="Please wait"/> : "Create Account"}
						</button>
					</form>

					{/* Login link */}
					<p className="text-center mt-6 text-gray-500">
						Already have an account?{" "}
						<Link
							to="/login"
							className="text-primary font-semibold cursor-pointer"
						>
							Login
						</Link>
					</p>

					{/* Divider */}
					<div className="flex items-center gap-4 my-6">
						<div className="flex-1 h-px bg-gray-300"></div>
						<span className="text-gray-400 text-sm">or</span>
						<div className="flex-1 h-px bg-gray-300"></div>
					</div>

					{/* Google Button */}
					<button className="w-full flex items-center justify-center gap-3 py-3 rounded-full bg-white shadow cursor-pointer">
						<img
							src="https://www.svgrepo.com/show/475656/google-color.svg"
							alt="google"
							className="w-5 h-5"
						/>
						<span className="text-sm font-medium text-gray-700 ">
							Continue with Google
						</span>
					</button>
				</div>
			</div>
		</div>
	);
};

export default RegisterPage;
