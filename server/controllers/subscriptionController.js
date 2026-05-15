import { razorpay } from "../config/razorpay.js";
import Plan from "../models/Plan.js";
import Subscription from "../models/Subscription.js"
import crypto from "node:crypto";
import User from "../models/User.js";

export const createSubscription = async (req, res) => {
	try {
		const { razorpayPlanId } = req.body;
		// console.log(req.user);
		// console.log(razorpayPlanId);

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
			notes: {
				userId: req.user._id.toString(),
				planId: selectedPlan._id.toString(),
			},
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

export const skyferWebhookRazorpay = async (req, res) => {
	try {
		/*
    ========================================
    VERIFY WEBHOOK SIGNATURE
    ========================================
    */

		const razorpaySignature = req.headers["x-razorpay-signature"];

		const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

		const body = JSON.stringify(req.body); // IMPORTANT (raw body)

		const generatedSignature = crypto
			.createHmac("sha256", secret)
			.update(body)
			.digest("hex");

		if (generatedSignature !== razorpaySignature) {
			return res.status(400).json({
				success: false,
				message: "Invalid signature",
			});
		}

		const event = JSON.parse(body);

		const subscription = event.payload.subscription.entity;
		console.log(subscription);
		/*
    ========================================
    SUBSCRIPTION ACTIVATED
    ========================================
    */

		if (event.event === "subscription.activated") {
			const sub = event.payload.subscription.entity;

			const dbSub = await Subscription.findOne({
				subscriptionId: sub.id,
			});

			if (!dbSub) {
				console.log("Subscription not found in DB");
				return res.status(200).json({ success: true });
			}

			const plan = await Plan.findById(dbSub.planId);

			if (!plan) {
				console.log("Plan not found");
				return res.status(200).json({ success: true });
			}

			// update subscription
			await Subscription.findOneAndUpdate(
				{ subscriptionId: sub.id },
				{
					status: "active",
					startAt: sub.start_at
						? new Date(sub.start_at * 1000)
						: null,
					endAt: sub.end_at ? new Date(sub.end_at * 1000) : null,
					nextChargeAt: sub.charge_at
						? new Date(sub.charge_at * 1000)
						: null,
				},
			);

			// =========================
			// 🔥 STORAGE UNLOCK
			// =========================
			await User.findByIdAndUpdate(dbSub.userId, {
				storageLimit: plan.storageLimit,
				subscriptionStatus: "active",
			});

			console.log("Subscription activated + storage updated");
		}

		/*
    ========================================
    SUBSCRIPTION CHARGED (SUCCESS PAYMENT)
    ========================================
    */

		if (event.event === "payment.captured") {
			const payment = event.payload.payment.entity;

			await Subscription.findOneAndUpdate(
				{ subscriptionId: payment.subscription_id },
				{
					status: "active",
					lastPaymentId: payment.id,
					lastPaymentAt: new Date(),

					// 🔥 extend end date
					endAt: payment.end_at
						? new Date(payment.end_at * 1000)
						: null,
				},
			);
		}

		/*
    ========================================
    PAYMENT FAILED
    ========================================
    */

		if (event.event === "payment.failed") {
			const payment = event.payload.payment.entity;

			await Subscription.findOneAndUpdate(
				{
					subscriptionId: payment.subscription_id,
				},
				{
					status: "failed",
				},
			);

			console.log("Payment failed");
		}

		/*
    ========================================
    SUBSCRIPTION CANCELLED
    ========================================
    */

		if (event.event === "subscription.cancelled") {
			const subscription = event.payload.subscription.entity;

			await Subscription.findOneAndUpdate(
				{
					subscriptionId: subscription.id,
				},
				{
					status: "cancelled",
					endAt: subscription.end_at
						? new Date(subscription.end_at * 1000)
						: null,
				},
			);

			console.log("Subscription cancelled");
		}

		return res.status(200).json({
			success: true,
		});
	} catch (err) {
		console.log(err);

		return res.status(500).json({
			success: false,
			message: "Webhook error",
		});
	}
};
