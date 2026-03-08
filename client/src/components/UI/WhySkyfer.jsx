
import { whySkyfer } from "../../utils/whySkyfer";

export default function WhySkyfer() {
	
	console.log(whySkyfer)

	return (
		<section className="py-24 bg-gray-50">
			<div className="max-w-7xl mx-auto px-6 text-center">
				<p className="text-pink-500 font-semibold tracking-wide">
					WHY SKYFER?
				</p>

				<h2 className="text-4xl font-bold mt-2">
					Engineered for{" "}
					<span className="text-pink-500">Scale & Security</span>
				</h2>

				<p className="text-gray-500 mt-4 mb-12 max-w-xl mx-auto">
					Skyfer removes complexity and focuses on the features that
					matter most to developers and teams.
				</p>

				<div className="grid md:grid-cols-3 gap-8">
					{whySkyfer.map((feature, index) => {
						const Icon = feature.icon;

						return (
							<div
								key={index}
								className={`bg-white p-8 rounded-xl border shadow-sm transition  ${feature.hover} flex flex-col items-center`}
							>
								<div
									className={`w-12 h-12 flex items-center justify-center text-white rounded-full ${feature.color} mb-5`}
								>
									<Icon />
								</div>

								<h3 className="font-semibold text-lg">
									{feature.title}
								</h3>

								<p className="text-gray-500 text-sm mt-2">
									{feature.desc}
								</p>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}


