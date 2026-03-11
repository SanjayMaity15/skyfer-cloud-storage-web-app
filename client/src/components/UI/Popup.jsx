import  { useState } from "react";
import ButtonLoader from "./ButtonLoader";

const Popup = ({ isOpen, heading, text, btn1, btn2, onCancel, onConfirm }) => {
	if (!isOpen) return null;

	const [loading, setLoading] = useState(false)
	

	return (
		<section
			className="flex fixed w-screen top-0 left-0 backdrop:blur-sm z-50  justify-center items-center h-screen bg-black/80"
			onClick={() => {
				onCancel()
			}}
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
						className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700/80 cursor-pointer tracking-wider w-30"
						onClick={() => onCancel()}
					>
						{btn1}
					</button>
					<button
						className="bg-green-600 hover:bg-green-700/80 cursor-pointer text-white px-6 py-2 rounded-full tracking-wider w-30 text-center"
						disabled={loading}
						onClick={async () => {
							setLoading(true);
							await onConfirm();
							setLoading(false)
							onCancel()
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
