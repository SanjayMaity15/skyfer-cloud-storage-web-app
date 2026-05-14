import mongoose from "mongoose";

const planSchema = new mongoose.Schema(
	{
		planName: {
			type: String,
			required: true,
			trim: true,
		},

		price: {
			type: Number,
			required: true,
		},

		billingCycle: {
			type: String,

			enum: ["monthly", "yearly"],

			required: true,
		},

		
		storageLimit: {
			type: Number,
			required: true,
		},

		features: [
			{
				type: String,
			},
		],

		razorpayPlanId: {
			type: String,
			required: true,
		},
	},

	{
		timestamps: true,
	},
);

const Plan = mongoose.model("Plan", planSchema);

export default Plan;
