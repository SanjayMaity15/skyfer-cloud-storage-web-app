import { email, z } from "zod";

export const passResetEmailSchema = z.object({
	emailForPassReset: z.email({ message: "Invalid email" }),
});



export const resetPasswordSchema = z
	.object({
		newPass: z.string().min(6, "Password must be at least 6 characters"),

		confirmPass: z
			.string()
			.min(6, "Confirm password must be at least 6 characters"),
	})
	.refine((data) => data.newPass === data.confirmPass, {
		message: "Passwords do not match",
		path: ["confirmPass"], // show error under confirmPassword
	});