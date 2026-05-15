import { razorpay } from "../config/razorpay.js";
import Plan from "../models/Plan.js";
import Subscription from "../models/Subscription.js";

export const createSubscription = async (req, res) => {
	try {
		const { razorpayPlanId } = req.body;
		console.log(req.user);
		console.log(razorpayPlanId);

		let selectedPlan = await Plan.findOne({
			razorpayPlanId,
		});

		if (!selectedPlan) {
			return res.status(404).json({
				success: false,

				message: "Plan not found",
			});
		}

		const razorpaySubscription = await razorpay.subscriptions.create({
			plan_id: razorpayPlanId,
			total_count: 60,
			customer_notify: 1,
		});

		console.log(razorpaySubscription);

		const subscription = await Subscription.create({
			userId: req.user._id,

			planId: selectedPlan._id,

			subscriptionId: razorpaySubscription.id,

			amount: selectedPlan.price,

			status: razorpaySubscription.status,

		});

		return res.status(201).json({
			success: true,

			message: "Subscription created",

			subscriptionId: razorpaySubscription.id,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "Server error",
			error,
		});
	}
};
