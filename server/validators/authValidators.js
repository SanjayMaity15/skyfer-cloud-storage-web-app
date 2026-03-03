import { email, z } from "zod";

// registration validation schema

export const registrationSchema = z.object({
	userName: z
		.string()
		.min(3, "Minimum 3 character need")
		.max(50, "Maximum 50 character allowed"),
	email: z.email({ message: "Invalid email" }),
	password: z.string().min(6, "Minimum 6 password need"),
	otp: z.string().min(4, "OTP must be 4 digit"),
});

// login validation schema

export const loginSchema = z.object({
	email: z.email({ message: "Invalid credential" }),
	password: z.string().min(6, "Invalid credential"),
});

// otp validation schema
export const otpSchema = z.object({
	email: z.email({ message: "Email is required" }),
});

export const editProfileSchema = z.object({
	userName: z
		.string()
		.min(1, "Username is required")
		.min(3, "Minimum 3 characters needed"),

	gender: z.enum(["male", "female"], {
		errorMap: () => ({ message: "Gender is required" }),
	}),
});