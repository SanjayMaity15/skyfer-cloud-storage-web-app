import React, { useEffect, useState } from "react";
import { api } from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { convertBytes } from "../../utils/digitalUnitConverter";
import { toast } from "react-toastify";
import ButtonLoader from "./ButtonLoader";

const PlanCard = ({ plan, onSelect }) => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false)
	const loadRazorpayScript = () => {
		return new Promise((resolve) => {
			const existingScript = document.getElementById("razorpay-script");

			if (existingScript) {
				resolve(true);
				return;
			}

			const script = document.createElement("script");
			script.id = "razorpay-script";
			script.src = "https://checkout.razorpay.com/v1/checkout.js";
			script.async = true;

			script.onload = () => resolve(true);
			script.onerror = () => resolve(false);

			document.body.appendChild(script);
		});
	};

	async function openRazorPayPopup(subscriptionId) {
		const options = {
			key: import.meta.env.VITE_RAZORPAY_KEY,

			subscription_id: subscriptionId,

			name: "Skyfer",

			// description: "Premium Plan",

			handler: async function (response) {
				try {
					const { data } = await api.post(
						"/subscription/verify-payment",
						response,
						{ withCredentials: true },
					);

					console.log(data);
					toast.success("Payment successfully verified");
					navigate("/dashboard");
				} catch (error) {
					console.log(error);
				}
			},
		};

		const razorpay = new Razorpay(options);

		razorpay.open();
	}

	async function handlePlanSelect(plan) {
		try {
			setLoading(true)

			const razorpayPlanId = plan.razorpayPlanId;

			const response = await api.post(
				"/subscription/create",
				{ razorpayPlanId },
				{ withCredentials: true },
			);

			const { subscriptionId } = response.data;

			openRazorPayPopup(subscriptionId);

			setLoading(false)
		} catch (error) {
			setLoading(false)
			toast.warn(error.response.data.message)
		}
	}

	useEffect(() => {
		loadRazorpayScript();
	}, []);

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

				{plan.billingCycle === "yearly" && (
					<p className="bg-green-100 px-4 py-1 rounded-full text-xs border border-green-500">
						2 Month off
					</p>
				)}
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
				{convertBytes(plan.storageLimit)}
			</p>

			{/* FEATURES */}
			<div className="mt-5 space-y-2">
				{plan.features.map((f, i) => (
					<div
						key={i}
						className="flex items-center gap-2 text-gray-600"
					>
						<span className="text-green-600">✔</span>
						<span>{f}</span>
					</div>
				))}
			</div>

			{/* BUTTON */}
			<button
				onClick={() => handlePlanSelect(plan)}
				disabled={loading}
				className="w-full bg-linear-to-r from-primary to-secondary text-white py-3 rounded-lg font-medium hover:opacity-90 transition cursor-pointer mt-6"
			>
				{loading ? <ButtonLoader /> : "Get Started"}
			</button>
		</div>
	);
};

export default PlanCard;
