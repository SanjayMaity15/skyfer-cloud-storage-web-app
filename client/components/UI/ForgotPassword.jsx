import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { OTP_LENGTH } from "../../constant/constant";
import { passResetEmailSchema, resetPasswordSchema } from "../../validators/passResetValidators";

const ForgotPassword = () => {
	const [forgotPassStep, setForgotPassStep] = useState(3);
    // reset passemail

    const [emailForPassReset, setEmailForPassReset] = useState("")

    const [newPass, setNewPass] = useState("")
    const [confirmPass, setConfirmPass] = useState("")

    const [errors, setErrors] = useState({})

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
    
    // Handle password reset function first step send OTP

    const handlePassResetOTP = async () => {
        const { success, data, error } = passResetEmailSchema.safeParse({emailForPassReset})
        
        if (!success) {
            const passResetError = {}

            error.issues.forEach((err) => passResetError[err.path[0]] = err.message)

            setErrors(passResetError)
        }
        
    }

    // step 2 otp verification functionality

    const handlePassResetOTPVerification = async () => {
        const formatOTP = otpInputBox.join("")
        if (formatOTP.length < 4) return
        
    }

    // Step 3 generate new password and save in DB
    
    const handleResetUserPassword = async () => {
        const { success, data, error } = resetPasswordSchema.safeParse({ newPass, confirmPass })
        
        if (!success) {
            const newResetPassErrors = {}
            error.issues.forEach((err) => newResetPassErrors[err.path[0]] = err.message)

            setErrors(newResetPassErrors)
        }
    }

    console.log(errors);


	return (
		<section className="h-screen w-full flex justify-center items-center">
			{/* step - 1 */}
			{forgotPassStep === 1 && (
				<div className="w-md h-66 bg-white/50 flex flex-col gap-4 rounded-2xl shadow-md p-4">
					<h4 className="capitalize text-center mt-4 text-2xl font-semibold">
						Enter registered email
					</h4>

					<div className="flex flex-col mt-4 px-12">
						<input
							type="email"
							placeholder="Enter registered email"
							className="w-full p-2 px-4 rounded-full bg-white shadow-md focus:ring-1 focus:ring-primary focus:outline-none"
							onChange={(e) =>
								setEmailForPassReset(e.target.value)
							}
							value={emailForPassReset}
						/>
						{errors.emailForPassReset && (
							<p className="text-sm pl-4 mt-1 text-red-600">
								{errors.emailForPassReset}
							</p>
						)}
					</div>

					{/* Button */}
					<div className="flex justify-center px-12">
						<button
							type="submit"
							className="w-full py-2 rounded-full font-semibold text-white bg-linear-to-r from-primary to-secondary hover:opacity-90 transition cursor-pointer"
							onClick={handlePassResetOTP}
						>
							Send OTP
						</button>
					</div>
				</div>
			)}

			{/* step - 2 */}
			{forgotPassStep === 2 && (
				<div className="md:w-md w-66 md:h-76 h-66 p-4 bg-white rounded-2xl shadow-md ">
					<h3 className="text-center font-semibold md:text-2xl text-xl md:mt-6 mt-3">
						OTP VERIFICATION
					</h3>
					<div className="flex flex-col items-center text-sm text-gray-500 mt-2">
						<p>Enter OTP send to your </p>
						<p> {"sanjay@gmail.com"}</p>
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
							onClick={handlePassResetOTPVerification}
						>
							Verify OTP
						</button>
					</div>
				</div>
			)}

			{/* step- 3 */}
			{forgotPassStep === 3 && (
				<div className="w-md py-8 bg-white/50 flex flex-col gap-4 rounded-2xl shadow-md p-4">
					<h4 className="capitalize text-center mt-4 text-2xl font-semibold">
						Set New Password
					</h4>

					<div className="flex flex-col gap-4 mt-4 px-12">
						<div>
							<input
								type="text"
								placeholder="New password"
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
								placeholder="Confirm password"
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
							onClick={handleResetUserPassword}
						>
							Reset Password
						</button>
					</div>
				</div>
			)}
		</section>
	);
};

export default ForgotPassword;
