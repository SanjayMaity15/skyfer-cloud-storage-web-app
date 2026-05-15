import Plan from "../models/Plan.js";

export const getAllPlans =  async (req, res) => {
	try {
		const plans = await Plan.find({
			razorpayPlanId: "plan_SpWlqxhFdPbGVE",
		});

		res.json({
			success: true,
			data:plans,
		});
	} catch (err) {
		res.status(500).json({
			success: false,
			message: err.message,
		});
	}
}
