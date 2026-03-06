import { useRef, useState } from "react";
import { OTP_LENGTH } from "../../constant/constant";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../../api/axiosInstance";
import ButtonLoader from "../components/UI/ButtonLoader";
import { toast } from "react-toastify";

const OtpPage = () => {
	const [loading, setLoading] = useState(false);
	const location = useLocation();
	const registrationData = location.state;
	const navigate = useNavigate();
	const [otpInputBox, setOtpInputBox] = useState(
		new Array(OTP_LENGTH).fill(""),
	);

	const [focusIndex, setFocusIndex] = useState(null);

	const otpRef = useRef([]);

	const handleOTPInputChange = (index, value) => {
		if (isNaN(value)) {
			return;
		}

		const newOTPvalue = [...otpInputBox];
		newOTPvalue[index] = value;
		setOtpInputBox(newOTPvalue);

		if (value !== "" && index < OTP_LENGTH - 1) {
			otpRef.current[index + 1].focus();
		}
	};

	const handleBack = (key, index) => {
		if (key === "Backspace") {
			const newOTPvalue = [...otpInputBox];

			if (newOTPvalue[index] !== "") {
				// If current input has value, just clear it
				newOTPvalue[index] = "";
				setOtpInputBox(newOTPvalue);
			} else if (index > 0) {
				// If current input is empty, move to previous and clear it
				newOTPvalue[index - 1] = "";
				setOtpInputBox(newOTPvalue);
				otpRef.current[index - 1].focus();
			}
		}
	};

	const handleVerifyOTPandRegister = async () => {
		setLoading(true);
		try {
			registrationData.otp = otpInputBox.join("");
			const result = await api.post("/auth/register", registrationData, {
				withCredentials: true,
			});
			console.log(result);
			toast.success(result?.data?.message);
			setLoading(false);
			navigate("/login");
		} catch (error) {
			toast.error(error?.response?.data?.message);
			setLoading(false);
		}
	};

	return (
		<div className="h-screen flex justify-center items-center">
			<div className="md:w-md w-66 md:h-76 h-66 p-4 bg-white rounded-2xl shadow-md ">
				<h3 className="text-center font-semibold md:text-2xl text-xl md:mt-6 mt-3">
					OTP VERIFICATION
				</h3>
				<div className="flex flex-col items-center text-sm text-gray-500 mt-2">
					<p>Enter OTP send to your </p>
					<p> {registrationData.email}</p>
				</div>

				<div className="flex justify-center gap-4 mt-6">
					{otpInputBox.map((el, index) => (
						<input
							key={index}
							type="text"
							maxLength={1}
							value={el}
							className={`md:w-10 md:h-10 w-8 h-8 outline-none border-none ring-2 ring-gray-500 rounded-sm text-center text-2xl ${focusIndex === index && "ring-primary ring-2"}`}
							onFocus={() => setFocusIndex(index)}
							ref={(el) => (otpRef.current[index] = el)}
							autoFocus={index === 0}
							onChange={(e) =>
								handleOTPInputChange(index, e.target.value)
							}
							onKeyDown={(e) => handleBack(e.key, index)}
						></input>
					))}
				</div>

				<div className="mt-6 flex justify-center">
					<button
						className="px-8 py-3 rounded-full bg-linear-to-r from-primary to-secondary text-white w-[70%] cursor-pointer"
						onClick={handleVerifyOTPandRegister}
						disabled={loading}
					>
						{loading ? (
							<ButtonLoader text="Verifying" />
						) : (
							"Verify OTP"
						)}
					</button>
				</div>
			</div>
		</div>
	);
};

export default OtpPage;
