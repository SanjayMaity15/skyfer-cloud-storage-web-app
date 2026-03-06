import React from "react";
import { Link } from "react-router-dom";

const HeroSection = () => {
	return (
		<section>
			<div className="container min-h-screen text-center flex flex-col items-center justify-center">
				{/* Badge */}
				<div className="inline-flex items-center gap-2 bg-white px-4 py-1 rounded-full shadow-md mb-6 -mt-18">
					<span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
					<span className="text-sm font-medium text-gray-600">
						LIVE PREVIEW
					</span>
				</div>

				{/* Heading */}
				<h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
					Store, sync & access your
					<br />
					<span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-secondary to-primary">
						cloud files instantly.
					</span>
				</h1>

				{/* Paragraph */}
				<p className="mt-6 text-lg text-gray-500 max-w-2xl mx-auto">
					Skyfer lets you upload, manage, and share your files
					securely with lightning-fast performance. Access your data
					anytime, anywhere — simple, safe, and seamless.
				</p>

				{/* Button */}
				<div className="mt-8">
					<Link
						to="/login"
						className="bg-gray-900 text-white px-6 py-3 rounded-full cursor-pointer font-semibold shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 mx-auto"
					>
						Get Started Free →
					</Link>
				</div>
			</div>
		</section>
	);
};

export default HeroSection;
