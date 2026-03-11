import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// Create a transporter using Ethereal test credentials.
// For production, replace with your actual SMTP server details.


const transporter = nodemailer.createTransport({
	host: "smtp.gmail.com",
	port: 465,
	secure: true,
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_APP_PASS,
	},
});

// Send an email using async/await

export const sendMailUsingNodeMailer = async (
	email,
	subject,
	text,
	otp = null,
) => {
	try {
		// Simple HTML template using the 4 parameters
		const htmlContent = otp
			? `
        <h2>${subject}</h2>
        <p>Hello,</p>
        <p>Use the following OTP to complete your ${text} on Skyfer:</p>
        <h1>${otp}</h1>
        <p>This OTP is valid for 5 minutes. Do not share it with anyone.</p>
        <p>Thank you,<br/>Skyfer Team</p>
      `
			: `<p>${text}</p><p>Thanks,<br/>Skyfer Team</p>`;

		const info = await transporter.sendMail({
			from: `"Skyfer" <${process.env.EMAIL_USER}>`,
			to: email,
			subject: subject,
			html: htmlContent,
		});

		console.log("Mail sent:", info.messageId);
	} catch (error) {
		console.log("Mail send error:", error);
	}
};
