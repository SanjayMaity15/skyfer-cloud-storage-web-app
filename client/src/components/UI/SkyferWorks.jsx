import { FaUserPlus, FaUpload } from "react-icons/fa";

export default function HowSkyferWorks() {
	return (
		<section className="py-24 bg-white">
			<div className="max-w-7xl mx-auto px-6">
				<h2 className="text-4xl font-bold mb-2">How Skyfer works</h2>

				<p className="text-gray-500 mb-14">
					Two simple steps to secure cloud storage.
				</p>

				<div className="grid md:grid-cols-2 gap-8">
					{/* Step 1 */}
					<div className="bg-gray-50 p-10 rounded-2xl relative">
						<FaUserPlus className="text-blue-500 text-2xl mb-4" />

						<span className="absolute right-8 top-6 text-5xl font-bold text-gray-200">
							01
						</span>

						<h3 className="text-xl font-semibold">
							Create Account
						</h3>

						<p className="text-gray-500 mt-3 text-sm">
							Sign up in seconds with Skyfer. No credit card
							required. Your encrypted storage space is created
							instantly.
						</p>

						<div className="mt-4 text-green-600 text-sm font-medium">
							✔ Account verified instantly
						</div>
					</div>

					{/* Step 2 */}
					<div className="bg-slate-900 text-white p-10 rounded-2xl relative">
						<FaUpload className="text-xl mb-4" />

						<span className="absolute right-8 top-6 text-5xl font-bold text-gray-600">
							02
						</span>

						<h3 className="text-xl font-semibold">
							Upload & Access Files
						</h3>

						<p className="text-gray-300 mt-3 text-sm">
							Drag and drop your files securely. Access them
							anytime and share with secure links from any device.
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}
