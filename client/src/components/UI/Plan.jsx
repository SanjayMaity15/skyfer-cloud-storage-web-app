import React, { useEffect, useState } from "react";
import axios from "axios";
import PlanCard from "./PlanCard";
import { api } from "../../api/axiosInstance";

const Plans = () => {
	const [plans, setPlans] = useState([]);
	const [loading, setLoading] = useState(true);

	const [billingCycle, setBillingCycle] = useState("monthly"); // default

	useEffect(() => {
		const getPlans = async () => {
			try {
				const res = await api.get("/plans")

				setPlans(res.data.data);
			} catch (err) {
				console.log(err);
			} finally {
				setLoading(false);
			}
		};

		getPlans();
	}, []);

	if (loading) {
		return <div className="text-center mt-10">Loading plans...</div>;
	}

	// FILTER PLANS
	const filteredPlans = plans.filter(
		(plan) => plan.billingCycle === billingCycle,
	);

	return (
		<div className="min-h-screen bg-bg-soft p-10">
			{/* HEADER */}

			<h2 className="text-4xl text-center mb-6 font-bold mt-2">
				Choose Your {" "}
				<span className="bg-clip-text text-transparent bg-linear-to-r from-primary to-secondary">
					Plan
				</span>
			</h2>

			{/* TOGGLE BUTTON */}
			<div className="flex justify-center mb-10">
				<div className="bg-white shadow-md rounded-full p-1 flex gap-2">
					<button
						onClick={() => setBillingCycle("monthly")}
						className={`px-6 py-2 rounded-full cursor-pointer transition ${
							billingCycle === "monthly"
								? "bg-primary text-white"
								: "text-gray-600"
						}`}
					>
						Monthly
					</button>

					<button
						onClick={() => setBillingCycle("yearly")}
						className={`px-6 py-2 rounded-full cursor-pointer transition ${
							billingCycle === "yearly"
								? "bg-primary text-white"
								: "text-gray-600"
						}`}
					>
						Yearly
					</button>
				</div>
			</div>

			{/* PLAN GRID */}
			<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 justify-items-center">
				{filteredPlans.length > 0 ? (
					filteredPlans.map((plan) => (
						<PlanCard
							key={plan._id}
							plan={plan}
							onSelect={() => console.log(plan)}
						/>
					))
				) : (
					<p className="text-center col-span-full text-gray-500">
						No plans available
					</p>
				)}
			</div>
		</div>
	);
};

export default Plans;
