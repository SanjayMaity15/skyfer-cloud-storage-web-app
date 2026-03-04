import React, { useState } from "react";
import { resetPasswordSchema } from "../../validators/passResetValidators";
import { api } from "../../api/axiosInstance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ButtonLoader from "./ButtonLoader";

const EnablenewPass = () => {
	const [newPass, setNewPass] = useState("");
	const [confirmPass, setConfirmPass] = useState("");
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState({});
  const navigate = useNavigate()


	const handleAddnewPass = async () => {
		const { success, data, error } = resetPasswordSchema.safeParse({
			newPass,
			confirmPass,
		});

		if (!success) {
			const newError = {};
			error.issues.forEach(
				(err) => (newError[err.path[0]] = err.message),
			);
			setErrors(newError);
			return;
		}

    try {
      setLoading(true)
      const result = await api.post("/auth/google/add-password", data, { withCredentials: true })
      toast.success(result?.data?.message)
      setLoading(false)
      navigate(-1)
    } catch (error) {
      setLoading(false)
      toast.error(error?.response?.data?.message)
    }
	};

	return (
		<div className="h-screen flex justify-center items-center">
			<div className="w-md py-8 bg-white/50 flex flex-col gap-4 rounded-2xl shadow-md p-4">
				<h4 className="capitalize text-center mt-4 text-xl font-semibold">
					Create or Change Password
				</h4>

				<div className="flex flex-col gap-4 mt-4 px-12">
					<div>
						<input
							type="text"
							placeholder="Password"
							className="w-full p-2 px-4 rounded-full bg-white shadow-md focus:ring-1 focus:ring-primary focus:outline-none"
							onChange={(e) => setNewPass(e.target.value)}
							value={newPass}
						/>
						{errors.newPass && (
							<p className="text-sm pl-4 mt-1 text-red-600">
								{errors.newPass}
							</p>
						)}
					</div>
					<div>
						{" "}
						<input
							type="text"
							placeholder="Confirm Password"
							className="w-full p-2 px-4 rounded-full bg-white shadow-md focus:ring-1 focus:ring-primary focus:outline-none"
							onChange={(e) => setConfirmPass(e.target.value)}
							value={confirmPass}
						/>
						{errors.confirmPass && (
							<p className="text-sm pl-4 mt-1 text-red-600">
								{errors.confirmPass}
							</p>
						)}
					</div>
				</div>

				{/* Button */}
				<div className="flex justify-center px-12">
					<button
						type="submit"
						className="w-full py-2 rounded-full font-semibold text-white bg-linear-to-r from-primary to-secondary hover:opacity-90 transition cursor-pointer "
						onClick={handleAddnewPass}
						disabled={loading}
					>
						{loading ? (
							<ButtonLoader text="Saving password" />
						) : (
							"Save password"
						)}
					</button>
				</div>
			</div>
		</div>
	);
};

export default EnablenewPass;
