// get all users

import Plan from "../models/Plan.js";
import Session from "../models/Session.js";
import User from "../models/User.js";

export const getAllUser = async (req, res) => {
	try {
		const allUsers = await User.find({ role: "user" });
		const session = await Session.find({});

		const users = allUsers.map((user) => {
			const isLoggedIn = session.some(
				(session) => session.userId.toString() === user._id.toString(),
			);

			return {
				_id: user._id,
				name: user.userName,
				email: user.email,
				join: user.createdAt,
				gender: user.gender,
				isDeleted: user.isDeleted,
				isLoggedIn,
			};
		});

		return res.status(200).json({
			success: true,
			data: users,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Server error",
		});
	}
};

// logout user

export const logoutUser = async (req, res) => {
	try {
		const { id } = req.params;

		await Session.findOneAndDelete({ userId: id });

		return res.status(200).json({
			success: true,
			message: "User logout successfully",
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Server error",
		});
	}
};

export const deleteUser = async (req, res) => {
	try {
		const { id } = req.params;

		await User.findOneAndUpdate(
			{ _id: id },
			{
				isDeleted: true,
			},
		);

		await Session.deleteOne({ userId: id });

		return res.status(200).json({
			success: true,
			message: "User deleted successfully",
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Server error",
		});
	}
};
export const restoreUser = async (req, res) => {
	try {
		const { id } = req.params;

		await User.findOneAndUpdate(
			{ _id: id },
			{
				isDeleted: false,
			},
		);

		return res.status(200).json({
			success: true,
			message: "User restore successfully",
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Server error",
		});
	}
};

// add plan

export const addPlan = async (req, res) => {
	try {
		
		const { planName, price, billingCycle, features, storageLimit, razorpayPlanId } = req.body;

		if (!planName || !price || !billingCycle || !features || !storageLimit || !razorpayPlanId) {
			return res.status(400).json({
				message: "Not enough field"
			})
		}

		const createdPlan = await Plan.create({
			planName,
			price,
			billingCycle,
			features,
			storageLimit,
			razorpayPlanId
		})

		res.status(200).json({
			success: true,
			message: "Plan created successfully",
			data: createdPlan
		})

	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Server error",
		});
	}
};
