// forgot pass send otp in registerd user email

import { sendMailUsingNodeMailer } from "../services/sendMailNodeMailer.js";
import Otp from "../models/Otp.js";
import User from "../models/User.js";
import {
	otpAndEmailVerificationSchema,
	passResetEmailSchema,
	resetPasswordSchema,
} from "../validators/passResetValidators.js";

export const sendForgotPassOTP = async (req, res) => {
	try {
		

		const { success, data } = passResetEmailSchema.safeParse(req.body);

		if (!success) {
			return res.status(500).json({
				success: false,
				message: "Something went wrong",
			});
		}
		const { emailForPassReset: email } = data;

		const checkUserExistance = await User.findOne({ email });

		if (!checkUserExistance) {
			return res.status(401).json({
				success: false,
				message: "User not registered",
			});
		}

		const otp = Math.floor(Math.random() * 9000 + 1000);

		await Otp.findOneAndUpdate(
			{ email },
			{ $set: { email, otp } },
			{ upsert: true, new: true },
		);

		await sendMailUsingNodeMailer(email, "Password reset OTP", otp);

		return res.status(200).json({
			success: true,
			message: "OTP send successfully in registered email",
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			message: error.message || "Failed to send OTP",
		});
	}
};

export const verifyOTPForPassReset = async (req, res) => {
	try {
		const { success, data } = otpAndEmailVerificationSchema.safeParse(
			req.body,
		);

		if (!success) {
			return res.status(500).json({
				success: false,
				message: "Something went wrong",
			});
		}

		const { email, otp } = data;

		const matchOTP = await Otp.findOne({ email, otp });

		if (!matchOTP) {
			return res.status(400).json({
				success: false,
				message: "Invalid OTP",
			});
		}

		return res.status(200).json({
			success: true,
			message: "OTP verification successful",
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Server Error",
		});
	}
};

// reset pasword

export const resetPassword = async (req, res) => {
	try {
		const { success, data } = resetPasswordSchema.safeParse(req.body);

		if (!success) {
			return res.status(500).json({
				success: false,
				message: "Something went wrong",
			});
		}

		const { newPass: password, emailForPassReset: email } = data;

		const user = await User.findOne({ email });
		user.password = password;
		await user.save();

		return res.status(200).json({
			success: true,
			message: "Password reset successfully",
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Server Error",
		});
	}
};
