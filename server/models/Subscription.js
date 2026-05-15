import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},

		// Your internal plan identifier
		planId: {
			type: String,
			required: true,
		},

		// Razorpay subscription id
		subscriptionId: {
			type: String,
			required: true,
			unique: true,
		},

		amount: {
			type: Number,
			required: true,
		},

		status: {
			type: String,
			enum: [
				"created",
				"authenticated",
				"active",
				"pending",
				"halted",
				"cancelled",
				"completed",
				"expired",
			],
			default: "created",
		},

		currency: {
			type: String,
			default: "INR",
		},

		startAt: {
			type: Date,
		},

		endAt: {
			type: Date,
		},

		nextChargeAt: {
			type: Date,
		},

		paymentMethod: {
			type: String,
		},
	},
	{
		timestamps: true,
	},
);

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
