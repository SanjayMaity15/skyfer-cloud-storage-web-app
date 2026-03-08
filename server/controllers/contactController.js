import { success } from "zod";
import Contact from "../models/Contact.js";
import { sendMailUsingNodeMailer } from "../services/sendMailNodeMailer.js";
import { contactFormSchema } from "../validators/contactValidators.js";

export const sendContactUsMsg = async (req, res) => {
	try {
		const { success, data } = contactFormSchema.safeParse(req.body);

		if (!success) {
			return res.status(400).json({
				success: false,
				message: "All fields must be filled",
			});
		}

		const { name, subject, email, message } = data;

		await Contact.create({
			name,
			subject,
			email,
			message,
        });
        
        await sendMailUsingNodeMailer(email, "Contact form recived", "", "")

        return res.status(201).json({
            success: true,
            message: "Form submitted successfully"
        })

    } catch (error) {
        return res.status(500).josn({
            success: false,
            message: "Server error"
        })
    }
};
