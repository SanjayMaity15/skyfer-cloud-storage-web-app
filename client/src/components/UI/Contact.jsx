import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { contactFormSchema } from "../../../validators/contactFormValidation";
import { useState } from "react";
import { api } from "../../../api/axiosInstance";
import { toast } from "react-toastify";
import ButtonLoader from "./ButtonLoader";

export default function Contact() {
	const { register, handleSubmit, reset } = useForm();
	const [errors, setErrors] = useState({});
	const [loading, setLoading] = useState(false);

	const handleContactForm = async(formData) => {
		const { success, data, error } = contactFormSchema.safeParse(formData);

		if (!success) {
			const newErrors = {};

			error.issues.forEach(
				(err) => (newErrors[err.path[0]] = err.message),
			);

			setErrors(newErrors);

			return;
		}

		try {
			setLoading(true);
			const result = await api.post("/contact/send", data);
			toast.success(result?.data?.message);
            setLoading(false);
            reset()
		} catch (error) {
			setLoading(false);
			toast.error(error?.response?.data?.message);
		}
	};

	console.log(errors);

	return (
		<section className="py-24 bg-gray-50">
			<div className="max-w-7xl mx-auto px-6">
				<div className="grid lg:grid-cols-2 gap-16 items-start">
					{/* Left Content */}
					<div>
						<p className="text-pink-500 font-semibold tracking-wider">
							CONTACT SKYFER
						</p>

						<h2 className="text-4xl font-bold mt-3 leading-tight">
							Let’s talk about your{" "}
							<span className="text-pink-500">
								cloud storage needs
							</span>
						</h2>

						<p className="text-gray-500 mt-6 max-w-md">
							Have questions about Skyfer? Want help integrating
							secure cloud storage into your workflow? Our team is
							here to help you every step of the way.
						</p>

						{/* Contact Info */}
						<div className="space-y-6 mt-10">
							<div className="flex items-center gap-4">
								<div className="bg-pink-100 text-pink-600 p-4 rounded-lg">
									<FaEnvelope />
								</div>

								<div>
									<p className="font-semibold">Email</p>
									<p className="text-gray-500 text-sm">
										support@skyfer.com
									</p>
								</div>
							</div>

							<div className="flex items-center gap-4">
								<div className="bg-purple-100 text-purple-600 p-4 rounded-lg">
									<FaPhoneAlt />
								</div>

								<div>
									<p className="font-semibold">Phone</p>
									<p className="text-gray-500 text-sm">
										+91 90000 00000
									</p>
								</div>
							</div>

							<div className="flex items-center gap-4">
								<div className="bg-blue-100 text-blue-600 p-4 rounded-lg">
									<FaMapMarkerAlt />
								</div>

								<div>
									<p className="font-semibold">Location</p>
									<p className="text-gray-500 text-sm">
										Kolkata, India
									</p>
								</div>
							</div>
						</div>
					</div>

					{/* Contact Form */}
					<div className="bg-white p-10 rounded-2xl shadow-sm border">
						<h3 className="text-2xl font-semibold mb-6">
							Send us a message
						</h3>

						<form
							className="space-y-5"
							onSubmit={handleSubmit(handleContactForm)}
						>
							<div className="grid md:grid-cols-2 gap-5">
								<div>
									<input
										type="text"
										placeholder="Your Name"
										className="border rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-pink-500 outline-none"
										{...register("name")}
									/>
									{errors.name && (
										<p className="text-red-500 pl-4 text-sm mt-1">
											{errors.name}
										</p>
									)}
								</div>

								<div>
									<input
										type="email"
										placeholder="Your Email"
										className="border rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-pink-500 outline-none"
										{...register("email")}
									/>
									{errors.email && (
										<p className="text-red-500 pl-4 text-sm mt-1">
											{errors.email}
										</p>
									)}
								</div>
							</div>

							<div>
								<input
									type="text"
									placeholder="Subject"
									className="border rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-pink-500 outline-none"
									{...register("subject")}
								/>
								{errors.subject && (
									<p className="text-red-500 pl-4 text-sm mt-1">
										{errors.subject}
									</p>
								)}
							</div>
							<div>
								<textarea
									rows="5"
									placeholder="Your Message"
									className="border rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-pink-500 outline-none"
									{...register("message")}
								/>
								{errors.message && (
									<p className="text-red-500 pl-4 text-sm mt-1">
										{errors.message}
									</p>
								)}
							</div>
							<button
								type="submit"
								className="w-full bg-linear-to-r from-pink-500 to-purple-600 text-white py-3 rounded-lg font-medium hover:opacity-90 transition cursor-pointer"
								disabled={loading}
							>
								{loading ? (
									<ButtonLoader text="Sending" />
								) : (
									"Send Message"
								)}
							</button>
						</form>
					</div>
				</div>
			</div>
		</section>
	);
}
