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
import { PiFileJsxFill, PiMicrosoftExcelLogoFill, PiMicrosoftPowerpointLogoFill } from "react-icons/pi";
import { SiTypescript } from "react-icons/si";
import { TbBrandCpp } from "react-icons/tb";
import { VscJson } from "react-icons/vsc";



// Return icon component based on extension
export const getFileIcon = (fileExt) => {
	const extension = fileExt.slice(1)
	const iconMap = {
		// PDF
		pdf: { icon: FaFilePdf, color: "text-red-500" },

		// Word
		doc: { icon: FaFileWord, color: "text-blue-600" },
		docx: { icon: FaFileWord, color: "text-blue-600" },
        
        // pptx
        
		ppt: { icon: PiMicrosoftPowerpointLogoFill, color: "text-orange-600" },
		pptx: { icon: PiMicrosoftPowerpointLogoFill, color: "text-orange-600" },

		// Excel
		xls: { icon: PiMicrosoftExcelLogoFill, color: "text-green-600" },
		xlsx: { icon: PiMicrosoftExcelLogoFill, color: "text-green-600" },

		// Images
		jpg: { icon: FaImage, color: "text-pink-500" },
		jpeg: { icon: FaImage, color: "text-pink-500" },
		png: { icon: FaImage, color: "text-pink-500" },
		gif: { icon: FaImage, color: "text-pink-500" },
		webp: { icon: FaImage, color: "text-pink-500" },

		// Archive
		zip: { icon: FaFileZipper, color: "text-yellow-600" },
		rar: { icon: FaFileZipper, color: "text-yellow-600" },

		// Video
		mp4: { icon: FaVideo, color: "text-purple-600" },
		mov: { icon: FaVideo, color: "text-purple-600" },
		avi: { icon: FaVideo, color: "text-purple-600" },

		// Audio
		mp3: { icon: FaFileAudio, color: "text-indigo-600" },
		wav: { icon: FaFileAudio, color: "text-indigo-600" },

		// Code
		js: { icon: FaJs, color: "text-yellow-500" },
		jsx: { icon: PiFileJsxFill, color: "text-indigo-500" },
		ts: { icon: SiTypescript, color: "text-blue-500" },
		json: { icon: VscJson, color: "text-yellow-600" },
		html: { icon: FaHtml5, color: "text-orange-600" },
		css: { icon: FaCss3, color: "text-blue-600" },
		py: { icon: FaPython, color: "text-blue-800" },
		cpp: { icon: TbBrandCpp, color: "text-blue-600" },
	};

    console.log(extension)
	return iconMap[extension] || { icon: FaFileAlt, color: "text-gray-500" };
};
