import React, { useState } from "react";
import ButtonLoader from "./ButtonLoader";

const Popup = ({ isOpen, setIsOpen, heading, text, btn1, btn2, onCancel, onConfirm }) => {
	if (!isOpen) return null;

	const [loading, setLoading] = useState(false)
	

	return (
		<section
			className="flex fixed w-screen top-0 left-0 backdrop:blur-sm z-50  justify-center items-center h-screen bg-black/60"
			onClick={() => setIsOpen(false)}
		>
			<div
				onClick={(e) => e.stopPropagation()}
				className="w-sm h-56 bg-white flex flex-col justify-center gap-6 shadow-md rounded-2xl"
			>
				<div>
					<h4 className="text-2xl text-center font-semibold">
						{heading}
					</h4>
					<p className="text-center">{text}</p>
				</div>

				<div className="flex gap-2 justify-center">
					<button
						className="text-red-600 bg-red-100 px-6 py-2 rounded-full hover:bg-red-200/80 cursor-pointer tracking-wider w-30"
						onClick={() => onCancel(false)}
					>
						{btn1}
					</button>
					<button
						className="text-green-600 hover:bg-green-200/80 cursor-pointer bg-green-100 px-6 py-2 rounded-full tracking-wider w-30 text-center"
						disabled={loading}
						onClick={() => {
							onConfirm();
							setLoading(true);
						}}
					>
						{loading ? <ButtonLoader look="green"/> : `${ btn2 }`}
					</button>
				</div>
			</div>
		</section>
	);
};

export default Popup;
