import mongoose, { Mongoose } from "mongoose";
import bcrypt from "bcrypt";
import { sendMailUsingNodeMailer } from "../services/sendMailNodeMailer.js";
import Otp from "../models/Otp.js";
import User from "../models/User.js";
import {
	loginSchema,
	otpSchema,
	registrationSchema,
} from "../validators/authValidators.js";
import Directory from "../models/Directory.js";
import Session from "../models/Session.js";

/*
=========================================

		Registration Controller

=========================================
*/

export const register = async (req, res) => {
	const mongooseSession = await mongoose.startSession();
	try {
		const { success, data } = registrationSchema.safeParse(req.body);

		if (!success) {
			return res.status(400).json({
				success: false,
				message: "Something went wrong",
			});
		}

		const { userName, email, password, otp } = data;

		const isOTPMatch = await Otp.findOne({ email, otp });

		if (!isOTPMatch) {
			return res.status(400).json({
				success: false,
				message: "Invalid OTP",
			});
		}

		const userId = new mongoose.Types.ObjectId();
		const dirId = new mongoose.Types.ObjectId();

		// here start transaction
		mongooseSession.startTransaction();

		const newUser = new User({
			_id: userId,
			userName,
			email,
			password,
			rootDirId: dirId,
		});

		const newDirectory = new Directory({
			_id: dirId,
			dirName: `root-${email}`,
			owner: userId,
		});

		await newUser.save({ session: mongooseSession });
		await newDirectory.save({ session: mongooseSession });
		// save all changes permanently
		await mongooseSession.commitTransaction();
		mongooseSession.endSession();

		return res.status(201).json({
			success: true,
			newUser,
			newDirectory,
		});
	} catch (error) {
		console.log(error);
		await mongooseSession.abortTransaction();
		mongooseSession.endSession();
		return res.status(500).json({
			success: false,
			message: error.message || "Something went wrong",
		});
	}
};

/*
=========================================

		Login controller

=========================================
*/

export const login = async (req, res) => {
	try {
		const { success, data } = loginSchema.safeParse(req.body);

		if (!success) {
			return res.status(400).json({
				success: false,
				message: "All fields are required",
			});
		}

		const { email, password } = data;

		const user = await User.findOne({ email })

		if (!user) {
			return res.status(401).json({
				success: false,
				message: "User not exists",
			});
		}

		if (user.password === null) {
			return res.status(401).json({
				success: false,
				message: "Invalid credential",
			});
		}

		const isPasswordMatch = await bcrypt.compare(password, user.password);

		if (!isPasswordMatch) {
			return res.status(401).json({
				success: false,
				message: "Invalid credential",
			});
		}

		const existingSession = await Session.findOne({ userId: user._id });
		if (existingSession) {
			await existingSession.deleteOne();
		}

		const session = await Session.create({ userId: user._id });

		// send user details to frontend
		const userDetails = {
			_id: user._id,
			userName: user.userName,
			email: user.email,
			profilePic: user.profilePic,
			role: user.role,
			rootDirId: user.rootDirId,
			isSecure: user.isSecure
		};

		const payload = session._id.toString();
		res.cookie("SID", payload, {
			httpOnly: true,
			maxAge: 30 * 24 * 60 * 60 * 1000,
		});

		return res.status(200).json({
			success: true,
			message: "Login successfull",
			user: userDetails,
		});
	} catch (error) {}
};

/*
=========================================

		Send Otp controller

=========================================
*/

export const sendOTP = async (req, res) => {
	try {
		const { success, data } = otpSchema.safeParse(req.body);

		if (!success) {
			return res.status(400).json({
				success: false,
				message: "Invalid email",
			});
		}

		const { email } = data;

		const existingUser = await User.findOne({ email });

		if (existingUser) {
			return res.status(409).json({
				success: false,
				message: "User already exists",
			});
		}

		const otp = Math.floor(Math.random() * 9000 + 1000);

		await Otp.findOneAndUpdate(
			{ email },
			{ $set: { email, otp } },
			{ upsert: true, new: true },
		);

		await sendMailUsingNodeMailer(email, "Registration OTP", otp);
		return res.status(200).json({
			success: true,
			message: "OTP Send Successfully",
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			message: error.message || "Failed to send OTP",
		});
	}
};

/*
=========================================

		Get current user controller

=========================================
*/

export const getCurrentUser = async (req, res) => {
	try {
		console.log(req.user.isSecure);
		return res.status(200).json({
			success: true,
			user: req.user,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Something went wrong",
		});
	}
};

/*
=========================================

		Logout controller

=========================================
*/

export const logout = async (req, res) => {
	try {
		const session = await Session.findOneAndDelete({
			userId: req.user._id,
		});
		res.clearCookie("SID");
		return res.status(200).json({
			success: true,
			message: "Logout successfully",
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Logout failed",
		});
	}
};
