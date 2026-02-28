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
