import {
	FaFilePdf,
	FaFileWord,
	FaFileExcel,
	FaFileImage,
	FaFileArchive,
	FaFileVideo,
	FaFileAudio,
	FaFileCode,
	FaFileAlt,
	FaFilePowerpoint,
	FaImage,
	FaJs,
	FaHtml5,
	FaVideo,
	FaPython,
} from "react-icons/fa";
import { FaCss3, FaFileZipper } from "react-icons/fa6";
import {
	PiFileJsxFill,
	PiMicrosoftExcelLogoFill,
	PiMicrosoftPowerpointLogoFill,
} from "react-icons/pi";
import { SiTypescript } from "react-icons/si";
import { TbBrandCpp } from "react-icons/tb";
import { VscJson } from "react-icons/vsc";

// Return icon component based on extension
export const getFileIcon = (fileExt) => {
	const extension = fileExt.slice(1);
	const iconMap = {
		// PDF
		pdf: {
			icon: FaFilePdf,
			color: "text-red-500",
			bg: "bg-red-100",
			border: "border-red-300",
		},

		// Word
		doc: {
			icon: FaFileWord,
			color: "text-blue-600",
			bg: "bg-blue-100",
			border: "border-blue-300",
		},
		docx: {
			icon: FaFileWord,
			color: "text-blue-600",
			bg: "bg-blue-100",
			border: "border-blue-300",
		},

		// pptx

		ppt: {
			icon: PiMicrosoftPowerpointLogoFill,
			color: "text-orange-600",
			bg: "bg-orange-100",
			border: "border-orange-300",
		},
		pptx: {
			icon: PiMicrosoftPowerpointLogoFill,
			color: "text-orange-600",
			bg: "bg-orange-100",
			border: "border-orange-300",
		},

		// Excel
		xls: {
			icon: PiMicrosoftExcelLogoFill,
			color: "text-green-600",
			bg: "bg-green-100",
			border: "border-green-300",
		},
		xlsx: {
			icon: PiMicrosoftExcelLogoFill,
			color: "text-green-600",
			bg: "bg-green-100",
			border: "border-green-300",
		},

		// Images
		jpg: {
			icon: FaImage,
			color: "text-pink-500",
			bg: "bg-pink-100",
			border: "border-pink-300",
		},
		webp: {
			icon: FaImage,
			color: "text-pink-500",
			bg: "bg-pink-100",
			border: "border-pink-300",
		},
		gif: {
			icon: FaImage,
			color: "text-pink-500",
			bg: "bg-pink-100",
			border: "border-pink-300",
		},
		png: {
			icon: FaImage,
			color: "text-pink-500",
			bg: "bg-pink-100",
			border: "border-pink-300",
		},
		jpeg: {
			icon: FaImage,
			color: "text-pink-500",
			bg: "bg-pink-100",
			border: "border-pink-300",
		},

		// Archive
		zip: {
			icon: FaFileZipper,
			color: "text-yellow-600",
			bg: "bg-yellow-100",
			border: "border-yellow-300",
		},
		rar: {
			icon: FaFileZipper,
			color: "text-yellow-600",
			bg: "bg-yellow-100",
			border: "border-yellow-300",
		},

		// Video
		mp4: {
			icon: FaVideo,
			color: "text-purple-600",
			bg: "bg-purple-100",
			border: "border-purple-300",
		},
		mov: {
			icon: FaVideo,
			color: "text-purple-600",
			bg: "bg-purple-100",
			border: "border-purple-300",
		},
		avi: {
			icon: FaVideo,
			color: "text-purple-600",
			bg: "bg-purple-100",
			border: "border-purple-300",
		},

		// Audio
		mp3: {
			icon: FaFileAudio,
			color: "text-indigo-600",
			bg: "bg-indigo-100",
			border: "border-indigo-300",
		},
		wav: {
			icon: FaFileAudio,
			color: "text-indigo-600",
			bg: "bg-indigo-100",
			border: "border-indigo-300",
		},

		// Code
		js: {
			icon: FaJs,
			color: "text-yellow-500",
			bg: "bg-yellow-100",
			border: "border-yellow-300",
		},
		jsx: {
			icon: PiFileJsxFill,
			color: "text-indigo-500",
			bg: "bg-indigo-100",
			border: "border-indigo-300",
		},
		ts: {
			icon: SiTypescript,
			color: "text-blue-500",
			bg: "bg-blue-100",
			border: "border-blue-300",
		},
		json: {
			icon: VscJson,
			color: "text-yellow-600",
			bg: "bg-yellow-100",
			border: "border-yellow-300",
		},
		html: {
			icon: FaHtml5,
			color: "text-orange-600",
			bg: "bg-orange-100",
			border: "border-orange-300",
		},
		css: {
			icon: FaCss3,
			color: "text-blue-600",
			bg: "bg-blue-100",
			border: "border-blue-300",
		},
		py: {
			icon: FaPython,
			color: "text-blue-800",
			bg: "bg-blue-100",
			border: "border-blue-300",
		},
		cpp: {
			icon: TbBrandCpp,
			color: "text-blue-600",
			bg: "bg-blue-100",
			border: "border-blue-300",
		},
	};

	console.log(extension);
	return iconMap[extension] || { icon: FaFileAlt, color: "text-gray-500" };
};
