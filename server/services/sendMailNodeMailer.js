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

export const sendMailUsingNodeMailer = async (email, subject, text, otp = null) => {
	const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${subject}</title>
  <style>
    body {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      background-color: #f3f4f6;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 8px 20px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(90deg, #db2777, #7e22ce); /* pink-600 → purple-600 */
      padding: 30px;
      text-align: center;
      color: white;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .content {
      padding: 30px;
      text-align: center;
      color: #1f2937;
    }
    .content p {
      font-size: 16px;
      margin-bottom: 20px;
    }
    .otp {
      display: inline-block;
      font-size: 32px;
      font-weight: bold;
      color: #7e22ce;
      background-color: #fce7f3;
      padding: 15px 30px;
      border-radius: 12px;
      letter-spacing: 5px;
      margin: 20px 0;
    }
    .footer {
      background-color: #f3f4f6;
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #6b7280;
    }
    @media (max-width: 600px) {
      .otp {
        font-size: 28px;
        padding: 12px 20px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${subject}</h1>
    </div>
    <div class="content">
      <p>Hello,</p>
      <p>Use the following OTP to complete your ${text} on Skyfer:</p>
      <div class="otp">${otp}</div>
      <p>This OTP is valid for 5 minutes. Do not share it with anyone.</p>
      <p>Welcome aboard! 🚀</p>
    </div>
    <div class="footer">
      <p>If you didn’t request this, please ignore this email.</p>
      <p>© 2026 Skyfer. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;
  
  const htmlTemplate2 = "Thanks for contact us"

	const info = await transporter.sendMail({
		from: `"Skyfer" <${process.env.EMAIL_USER}>`,
		to: email,
		subject: subject,
		html: otp ? htmlTemplate : htmlTemplate2,
	});
};
