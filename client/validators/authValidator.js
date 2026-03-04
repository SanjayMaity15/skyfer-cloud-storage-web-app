import { z } from "zod";

export const registrationSchema = z.object({
	userName: z.string().min(3, "Minimum 3 character need"),
	email: z.email("invalid email"),
	password: z.string().min(6, "Password must be 6 char or more"),
});

export const loginSchema = z.object({
	email: z.email("invalid email"),
	password: z.string().min(6, "Password must be 6 char or more"),
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