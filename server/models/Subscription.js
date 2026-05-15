import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},

		planId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Plan",
			required: true,
		},

		subscriptionId: {
			type: String,
			required: true,
			unique: true,
		},

		customerId: {
			type: String,
		},

		lastPaymentId: {
			type: String,
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
                "paused",
                "failed",
				"cancelled",
				"expired",
			],
			default: "created",
		},

		currency: {
			type: String,
			default: "INR",
		},

		startAt: Date,
		endAt: Date,
		nextChargeAt: Date,
		paymentMethod: String,

		cancelAtPeriodEnd: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	},
);

const Subscription = mongoose.model("Subscription", subscriptionSchema);
export default Subscription;
