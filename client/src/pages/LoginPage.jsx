import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { getImageUrl } from "../utils/getImageUrl";
import { loginSchema } from "../../validators/authValidator";
import { useEffect, useState } from "react";
import { api } from "../../api/axiosInstance";
import ButtonLoader from "../components/UI/ButtonLoader";
import { useDispatch } from "react-redux";
import { setUser } from "../features/userSlice";
import { toast } from "react-toastify";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

const LoginPage = () => {
	const { register, handleSubmit } = useForm({
		defaultValues: {
			email: "sanjaydummy18@gmail.com",
			password: "123456",
		},
	});

	const dispatch = useDispatch();

	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const [showPass, setShowPass] = useState(false);

	// login errors
	const [errors, setErrors] = useState({});

	const handleLoginForm = async (loginData) => {
		const { success, data, error } = loginSchema.safeParse(loginData);

		if (!success) {
			const loginErrors = {};

			error.issues.forEach(
				(err) => (loginErrors[err.path[0]] = err.message),
			);

			setErrors(loginErrors);
			return;
		}

		try {
			setLoading(true);
			const result = await api.post("/auth/login", loginData, {
				withCredentials: true,
			});
			toast.success(result?.data?.message);
			dispatch(setUser(result?.data?.user));
			navigate("/dashboard");
			setLoading(false);
		} catch (error) {
			toast.error(error?.response?.data?.message);
			setLoading(false);
		}
	};

	// login with google

	const handleLoginWithGoogle = async () => {
		try {
			const result = window.open(
				`${import.meta.env.VITE_BASE_URL}/auth/google`,
				"googleLoginPopup",
				"width=500,height=600",
			);
			console.log(result);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		const handleMessage = (event) => {
			if (event.origin !== "http://localhost:8000") return;

			if (event.data.type === "GOOGLE_AUTH_SUCCESS") {
				dispatch(setUser(event.data.data));
				toast.success("LoggedIn successfully");
				navigate("/dashboard");
			}
		};

		window.addEventListener("message", handleMessage);

		// Cleanup on unmount
		return () => {
			window.removeEventListener("message", handleMessage);
		};
	}, []);

	return (
		<div className="min-h-screen flex bg-bg-soft container">
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
					<h1 className="lg:text-4xl md:text-2xl  font-bold leading-tight">
						Welcome Back
						<br />
						Access Your Files Instantly
					</h1>

					<p className="mt-4 text-white/80 md:w-3/4">
						Log in to your secure cloud storage and manage your
						files with speed and ease anytime, anywhere.
					</p>
				</div>
			</div>

			{/* RIGHT SIDE */}
			<div className="w-full md:w-1/2 flex pt-12 md:pt-0 md:items-center justify-center bg-bg-soft px-6">
				<div className="w-full max-w-md">
					{/* Title */}
					<h2 className="text-3xl font-bold text-gray-900 mb-6 text-center tracking-wide">
						Login
					</h2>

					{/* Form */}
					<form
						className="space-y-4"
						onSubmit={handleSubmit(handleLoginForm)}
					>
						<div>
							<input
								type="email"
								placeholder="Enter email Address..."
								className="w-full p-2 px-4 rounded-full bg-white shadow-md focus:ring-1 focus:ring-primary focus:outline-none"
								{...register("email")}
							/>
							{errors.email && (
								<p className="text-red-500 pl-4 text-sm mt-1">
									{errors.email}
								</p>
							)}
						</div>

						<div className="relative">
							<input
								type={showPass ? "text" : "password"}
								placeholder="Enter password..."
								className="w-full p-2 px-4 rounded-full bg-white shadow-md focus:ring-1 focus:ring-primary focus:outline-none"
								{...register("password")}
							/>
							<button
								type="button"
								onClick={() => setShowPass((prev) => !prev)}
								className="cursor-pointer absolute top-3 right-4"
							>
								{showPass ? <FaRegEye /> : <FaRegEyeSlash />}
							</button>
							{errors.password && (
								<p className="text-red-500 pl-4 text-sm mt-1">
									{errors.password}
								</p>
							)}
						</div>

						<div className="flex justify-end mr-2 text-xs text-primary">
							<Link
								to="/reset-password"
								className="hover:underline"
								title="Click to reset password"
							>
								Forgot password
							</Link>
						</div>

						{/* Button */}
						<button
							type="submit"
							className="w-full py-4 rounded-full font-semibold text-white bg-linear-to-r from-primary to-secondary hover:opacity-90 transition cursor-pointer "
							disabled={loading}
						>
							{loading ? (
								<ButtonLoader text="Please wait" />
							) : (
								"Login"
							)}
						</button>
					</form>

					{/* Register link */}
					<p className="text-center mt-6 text-gray-500">
						Don’t have an account?{" "}
						<Link
							to="/register"
							className="text-primary font-semibold cursor-pointer"
						>
							Register
						</Link>
					</p>

					{/* Divider */}
					<div className="flex items-center gap-4 my-6">
						<div className="flex-1 h-px bg-gray-300"></div>
						<span className="text-gray-400 text-sm">or</span>
						<div className="flex-1 h-px bg-gray-300"></div>
					</div>

					{/* Google Button */}
					<button
						className="w-full flex items-center justify-center gap-3 py-3 rounded-full bg-white shadow cursor-pointer"
						onClick={handleLoginWithGoogle}
					>
						<img
							src="https://www.svgrepo.com/show/475656/google-color.svg"
							alt="google"
							className="w-5 h-5"
						/>
						<span className="text-sm font-medium text-gray-700">
							Continue with Google
						</span>
					</button>
				</div>
			</div>
		</div>
	);
};

export default LoginPage;
