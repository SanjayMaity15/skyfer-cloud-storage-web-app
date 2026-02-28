import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// Create a transporter using Ethereal test credentials.
// For production, replace with your actual SMTP server details.
const transporter = nodemailer.createTransport({
	host: "smtp.gmail.com",
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_APP_PASS,
	},
});

// Send an email using async/await

export const sendMailUsingNodeMailer = async (email, subject, otp = null) => {
	const info = await transporter.sendMail({
		from: `"Skyfer" <${process.env.EMAIL_USER}>`,
		to: email,
		subject: subject,
		html: `<p>Your registration <b>OTP : ${otp}</b> for Skyfer</p>`,
	});
};
