import { razorpay } from "../config/razorpay.js";
import Plan from "../models/Plan.js";
import Subscription from "../models/Subscription.js";
import crypto from "node:crypto";
import User from "../models/User.js";

export const createSubscription = async (req, res) => {
	try {
		const { razorpayPlanId } = req.body;

		let selectedPlan = await Plan.findOne({
			razorpayPlanId,
		});

		if (!selectedPlan) {
			return res.status(404).json({
				success: false,

				message: "Plan not found",
			});
		}

		const subscriptionAlreadyOwn = await Subscription.findOne({
			userId: req.user._id,
			planId: selectedPlan._id,
			status: "active",
		});

		if (subscriptionAlreadyOwn) {
			return res.status(400).json({
				message: "Already have this subscription plan",
			});
		}

		const totalCount = selectedPlan.billingCycle === "yearly" ? 5 : 60; 

		const razorpaySubscription = await razorpay.subscriptions.create({
			plan_id: razorpayPlanId,
			total_count: totalCount,
			customer_notify: 1,
			notes: {
				userId: req.user._id.toString(),
				planId: selectedPlan._id.toString(),
			},
		});

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
		
		res.status(500).json({
			message: "Server error",
			error,
		});
	}
};

/*
========================================
VERIFY PAYMENT
========================================
*/

export const verifySubscriptionPayment = async (req, res) => {
	try {
		const {
			razorpay_payment_id,
			razorpay_subscription_id,
			razorpay_signature,
		} = req.body;

		// 1. create signature string
		const body = razorpay_payment_id + "|" + razorpay_subscription_id;

		const expectedSignature = crypto
			.createHmac("sha256", process.env.RAZORPAY_API_SECRET)
			.update(body.toString())
			.digest("hex");

		// 2. verify signature
		if (expectedSignature !== razorpay_signature) {
			return res.status(400).json({
				success: false,
				message: "Invalid signature",
			});
		}

		// 3. find subscription in DB
		const subscription = await Subscription.findOne({
			subscriptionId: razorpay_subscription_id,
		});

		if (!subscription) {
			return res.status(404).json({
				success: false,
				message: "Subscription not found",
			});
		}

		// 4. OPTIONAL: mark payment verified (do NOT activate here)
		await Subscription.findOneAndUpdate(
			{ subscriptionId: razorpay_subscription_id },
			{
				lastPaymentId: razorpay_payment_id,
				paymentVerified: true,
			},
		);

		return res.status(200).json({
			success: true,
			message: "Payment verified successfully",
		});
	} catch (err) {
		
		return res.status(500).json({
			success: false,
			message: "Server error",
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
				return res.status(200).json({ success: true });
			}

			const plan = await Plan.findById(dbSub.planId);

			if (!plan) {
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
					endAt: sub.current_end
						? new Date(sub.current_end * 1000)
						: null,
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
					endAt: payment.current_end
						? new Date(payment.current_end * 1000)
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
					endAt: subscription.current_end
						? new Date(subscription.current_end * 1000)
						: null,
				},
			);

			
		}

		return res.status(200).json({
			success: true,
		});
	} catch (err) {
		

		return res.status(500).json({
			success: false,
			message: "Webhook error",
		});
	}
};
