import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendMailUsingResend = async (email, subject, otp) => {
	try {
		const html = `
		<div style="font-family: Arial, sans-serif; background:#f4f6fb; padding:40px 0;">
			<div style="max-width:600px;margin:auto;background:white;border-radius:10px;overflow:hidden;box-shadow:0 5px 20px rgba(0,0,0,0.1);">
				
				<!-- Header -->
				<div style="background:#4F46E5;color:white;padding:25px;text-align:center;">
					<h1 style="margin:0;">Skyfer</h1>
					<p style="margin:5px 0 0;font-size:14px;opacity:0.9;">Secure Verification</p>
				</div>

				<!-- Body -->
				<div style="padding:35px;text-align:center;">
					<h2 style="margin-bottom:10px;color:#333;">${subject}</h2>
					
					<p style="color:#555;font-size:16px;margin-bottom:25px;">
						Use the verification code below to continue.
					</p>

					<div style="
						display:inline-block;
						background:#f3f4f6;
						padding:18px 35px;
						border-radius:8px;
						font-size:32px;
						font-weight:bold;
						letter-spacing:6px;
						color:#4F46E5;
						border:2px dashed #4F46E5;
					">
						${otp}
					</div>

					<p style="margin-top:25px;color:#666;font-size:14px;">
						This code will expire in <b>5 minutes</b>.
					</p>
				</div>

				<!-- Footer -->
				<div style="background:#f9fafb;padding:20px;text-align:center;font-size:12px;color:#777;">
					If you didn't request this code, you can safely ignore this email.<br/>
					© ${new Date().getFullYear()} Skyfer. All rights reserved.
				</div>

			</div>
		</div>
		`;

		const data = await resend.emails.send({
			from: "Skyfer <otp@sanjaymaity.online>",
			to: [email],
			subject: subject,
			html: html,
		});

		
	} catch (error) {
		console.log("Email error:", error);
	}
};
