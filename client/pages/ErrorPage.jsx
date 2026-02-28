import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const ErrorPage = () => {
	const navigate = useNavigate();

	return (
		<div className="min-h-screen flex items-center justify-center bg-bg-soft px-4 relative overflow-hidden">
			<h2 className="lg:text-[500px] tracking-widest absolute -rotate-12 text-gray-200">
				404
			</h2>
			{/* Background Blur Shape */}
			<div className="absolute w-125 h-125 bg-linear-to-br from-primary/20 to-secondary/20 blur-3xl rounded-full top-10 left-10"></div>
			<div className="absolute w-100 h-100 bg-linear-to-tr from-secondary/20 to-primary/20 blur-3xl rounded-full bottom-10 right-10"></div>

			{/* Card */}
			<div className="relative z-10 bg-white/70 backdrop-blur-xl shadow-xl rounded-3xl p-10 max-w-md w-full text-center">
				{/* Icon */}
				<div className="w-20 h-20 mx-auto flex items-center justify-center rounded-full bg-white shadow-md mb-6">
					<FaArrowLeft className="text-3xl text-primary" />
				</div>

				{/* Title */}
				<h1 className="text-3xl font-bold text-gray-900">
					Page not found
				</h1>

				{/* Description */}
				<p className="mt-3 text-gray-500">
					Oops! The file or folder you’re looking for has disappeared
					into the cloud.
				</p>

				{/* Buttons */}
				<div className="flex items-center justify-center gap-4 mt-6">
					{/* Go Back */}
					<button
						onClick={() => navigate(-1)}
						className="flex items-center gap-2 px-5 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
					>
						<FaArrowLeft />
						Go Back
					</button>

					{/* Dashboard */}
					<Link
						to="/dashboard"
						className="px-6 py-2 rounded-full text-white font-semibold bg-linear-to-r from-primary to-secondary shadow-lg hover:opacity-90 transition"
					>
						Dashboard
					</Link>
				</div>

				{/* Footer */}
				<p className="mt-6 text-sm text-gray-400">
					Error Code: 404 • Skyfer Cloud Storage
				</p>
			</div>
		</div>
	);
};

export default ErrorPage;
