import { z } from "zod";

export const contactFormSchema = z.object({
	name: z.string().min(3, "Minimum 3 charcter needed"),
	email: z.email({ message: "Invalid email" }),
	subject: z.string().min(4, "Minimum 4 character needed"),
	message: z.string().min(1, "Message field is required"),
});
