import React from "react";

const formatStorage = (bytes) => {
	if (bytes >= 1024 * 1024 * 1024) {
		return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
	}

	if (bytes >= 1024 * 1024) {
		return `${(bytes / (1024 * 1024)).toFixed(0)} MB`;
	}

	return `${bytes} bytes`;
};

const PlanCard = ({ plan, onSelect }) => {
	return (
		<div
			className="
        w-full
        max-w-sm
        rounded-3xl
        bg-white
        shadow-md
        border
        border-gray-200
        p-6
        transition
        hover:scale-105
        duration-300
      "
		>
			{/* PLAN NAME */}

			<div className="flex items-center justify-between">
				<h2
					className="
          text-2xl
          font-bold
          text-primary
        "
				>
					{plan.planName}
				</h2>

				{plan.billingCycle === "yearly" && <p className="bg-green-100 px-4 py-1 rounded-full text-xs border border-green-500">2 Month off</p>}
			</div>

			{/* PRICE */}
			<p
				className="
          mt-2
          text-3xl
          font-extrabold
          text-secondary
        "
			>
				₹{plan.price}
				<span className="text-sm text-gray-500">
					/{plan.billingCycle}
				</span>
			</p>

			{/* STORAGE */}
			<p className="mt-4 text-gray-700">
				<span className="font-semibold">Storage:</span>{" "}
				{formatStorage(plan.storageLimit)}
			</p>

			{/* FEATURES */}
			<div className="mt-5 space-y-2">
				{plan.features.map((f, i) => (
					<div
						key={i}
						className="flex items-center gap-2 text-gray-600"
					>
						<span className="text-primary">✔</span>
						<span>{f}</span>
					</div>
				))}
			</div>

			{/* BUTTON */}
			<button
				onClick={() => onSelect(plan)}
				className="
          mt-6
          w-full
          rounded-xl
          bg-primary
          cursor-pointer
          text-white
          py-3
          font-semibold
          hover:bg-secondary
          transition
        "
			>
				Get Started
			</button>
		</div>
	);
};

export default PlanCard;
