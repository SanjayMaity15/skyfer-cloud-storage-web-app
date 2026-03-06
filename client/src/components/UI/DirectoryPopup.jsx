import { useState } from "react";
import ButtonLoader from "./ButtonLoader";
import { toast } from "react-toastify";
import { FaArrowLeft } from "react-icons/fa";

const DirectoryPopup = ({
	isOpen,
	heading,
	text,
    btn1,
    type,
	btn2,
	onCancel,
	onConfirm,
}) => {
	const [loading, setLoading] = useState(false);
	const [dirName, setDirName] = useState("");
    

	if (!isOpen) return null;

	return (
		<section
			className="fixed inset-0 z-50 flex justify-center items-center bg-black/60"
			onClick={onCancel}
		>
			<div
				onClick={(e) => e.stopPropagation()}
				className="w-sm h-56 bg-white flex flex-col justify-center gap-6 shadow-md rounded-2xl relative"
			>
				<FaArrowLeft className="absolute top-5 left-3 cursor-pointer" onClick={onCancel}/>

				<div>
					<h4 className="text-2xl text-center font-semibold">
						{heading}
					</h4>
					<p className="text-center text-sm text-gray-400">{text}</p>
				</div>

				{type === "input" && (
					<div className="flex justify-center">
						<input
							type="text"
							onChange={(e) => setDirName(e.target.value)}
							value={dirName}
							className="border-none outline-none ring-1 ring-primary rounded-2xl focus:ring-2 px-4 py-1"
							placeholder="Enter folder name"
						/>
					</div>
				)}
				<div className="flex gap-2 justify-center">
					<button
						className="text-white bg-red-600 px-6 py-2 rounded-full hover:bg-red-700/80 w-30 cursor-pointer"
						onClick={onCancel} // ✅ FIXED
					>
								{btn1}
					</button>

					<button
						className="text-white bg-green-600 px-6 py-2 rounded-full hover:bg-green-700 w-30 cursor-pointer"
						disabled={loading}
						onClick={async () => {
							setLoading(true);
							await onConfirm?.(dirName);
							setDirName("")
							setLoading(false);
							onCancel(); // auto close after confirm
						}}
					>
						{loading ? <ButtonLoader /> : btn2}
					</button>
				</div>
			</div>
		</section>
	);
};

export default DirectoryPopup;
