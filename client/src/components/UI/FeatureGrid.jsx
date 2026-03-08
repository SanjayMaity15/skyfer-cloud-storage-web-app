import { FaDatabase, FaShieldAlt, FaGlobe, FaMobileAlt } from "react-icons/fa";

export default function SkyferFeaturesGrid() {
	return (
		<section className="py-24 bg-gray-100">
			<div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-3 gap-8">
				{/* Smart Storage */}
				<div className="bg-white rounded-3xl p-10 shadow-sm border flex flex-col justify-between">
					<div>
						<div className="w-12 h-12 bg-indigo-100 text-indigo-600 flex items-center justify-center rounded-xl mb-6 text-xl">
							<FaDatabase />
						</div>

						<div className="flex items-center justify-between mb-4">
							<h3 className="text-2xl font-semibold">
								Smart Storage
							</h3>
							<span className="text-green-600 bg-green-100 text-sm px-3 py-1 rounded-full">
								+24% Growth
							</span>
						</div>

						<p className="text-gray-500">
							Automatically optimizes your files for speed and
							efficiency.
						</p>
					</div>

					<div className="flex justify-between text-gray-400 text-sm mt-10">
						<span>Mon</span>
						<span>Tue</span>
						<span>Wed</span>
						<span>Thu</span>
						<span>Fri</span>
						<span>Sat</span>
					</div>
				</div>

				{/* Vault Security */}
				<div className="rounded-3xl p-10 bg-linear-to-br from-[#0b1a3a] to-[#0a1230] text-white shadow-lg relative overflow-hidden">
					<div className="w-12 h-12 bg-white/10 flex items-center justify-center rounded-xl mb-6 text-green-400">
						<FaShieldAlt />
					</div>

					<h3 className="text-2xl font-semibold mb-3">
						Vault Security
					</h3>

					<p className="text-gray-300 mb-10">
						Enterprise-grade encryption by default. Your keys, your
						data.
					</p>

					<div className="bg-black rounded-xl p-4 text-xs font-mono">
						<div className="flex gap-2 mb-2">
							<span className="w-3 h-3 bg-red-500 rounded-full"></span>
							<span className="w-3 h-3 bg-yellow-400 rounded-full"></span>
							<span className="w-3 h-3 bg-green-500 rounded-full"></span>
						</div>

						<p className="text-gray-300">auth.verify(token)</p>

						<p className="text-green-400 mt-2">
							200 OK – Access Granted
						</p>

						<div className="w-full bg-gray-700 h-1 rounded mt-3">
							<div className="bg-green-400 h-1 w-2/3 rounded"></div>
						</div>
					</div>
				</div>

				{/* Edge Network */}
				<div className="bg-white rounded-3xl p-8 border shadow-sm relative overflow-hidden">
					<div>
						<div className="flex items-center gap-3 mb-4">
							<FaGlobe className="text-indigo-600" />
							<span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full">
								GLOBAL
							</span>
						</div>

						<h3 className="text-xl font-semibold mb-2">
							Edge Network
						</h3>

						<p className="text-gray-500">
							Lightning fast access from anywhere on earth.
						</p>
					</div>

                    <div className="flex justify-end items-end">
                        <div className="w-42 h-42 rounded-full border-16 flex justify-center items-center border-pink-100 border-t-pink-300 animate-[spin_5s_linear_infinite]">
                            <div className="w-24 h-24 rounded-full border-16 border-t-purple-300 border-purple-100 animate-[spin_3s_linear_infinite_reverse]"></div>
                        </div>
                    </div>
				</div>
			</div>
		</section>
	);
}
