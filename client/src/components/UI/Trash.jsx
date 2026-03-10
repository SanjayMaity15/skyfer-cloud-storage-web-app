import React, { useEffect, useState } from "react";
import { api } from "../../../api/axiosInstance";
import { getFileIcon } from "../../utils/getFileIcons";
import { toast } from "react-toastify";
import ButtonLoader from "./ButtonLoader";

const Trash = () => {
    const [trashFiles, setTrashFiles] = useState([]);
    const [loading, setLoading] = useState(false)
    const [loading1, setLoading1] = useState(false)
	// handle delete file
	const fetchTrashFile = async () => {
		try {
			const result = await api.get("/file/trash-file", {
				withCredentials: true,
			});
			setTrashFiles(result.data.files);
		} catch (error) {
			console.log(error);
		}
	};

	// permant delete

	// handle delete file
	const handlePermantDelete = async (id) => {
        try {
            setLoading(true)
			const result = await api.delete(`/file/permanant-delete/${id}`, {
				withCredentials: true,
            });
			fetchTrashFile()
            toast.success(result?.data?.message);
            setLoading(false)
		} catch (error) {
            toast.error(error?.response?.data?.message);
            setLoading(false)
		}
    };
    
	// handle delete file
	const handleRecoverFile = async (id) => {
        try {
            setLoading1(true)
			const result = await api.post(`/file/recover-file/${id}`, {}, {
				withCredentials: true,
            });
			fetchTrashFile()
            toast.success(result?.data?.message);
            setLoading1(false)
		} catch (error) {
            toast.error(error?.response?.data?.message);
            setLoading1(false)
		}
	};

	useEffect(() => {
		fetchTrashFile();
	}, []);

	console.log(trashFiles);

	return (
		<section>
			<div>
				<h2 className="text-center text-2xl uppercase my-6 font-semibold">
					Trash files
				</h2>

				<div className="flex flex-col gap-2 p-6">
					{trashFiles.length === 0 ? (
						<p className="text-center text-xl text-gray-400">No files available</p>
					) : (
						trashFiles?.map((file) => {
							const {
								icon: Icon,
								color,
								bg,
								border,
							} = getFileIcon(file.extension);

							return (
								<div className="bg-white p-2 flex items-center justify-between">
									<div className="flex items-center gap-2">
										{/* icon */}
										<div
											className={`${color} ${bg} ${border}`}
										>
											<Icon />
										</div>
										{/* name */}
										<p>{file.fileName}</p>
									</div>

									<div className="flex items-center gap-5 text-sm">
                                        <button className="bg-green-100 px-4 py-1 rounded-full text-green-700 border cursor-pointer"
                                        onClick={() => handleRecoverFile(file._id)}
                                        >
                                            {
                                                loading1 ? <ButtonLoader text="Recovering"/> : "Retrive"
                                            }
										</button>

										<button
											className="bg-red-100 px-4 py-1 rounded-full text-red-700 border cursor-pointer"
											onClick={() =>
												handlePermantDelete(file._id)
											}
										>
                                            {
                                                loading ? <ButtonLoader text="Deleting"/> : "Permanant delete"
                                            }
										</button>
									</div>
								</div>
							);
						})
					)}
				</div>
			</div>
		</section>
	);
};;

export default Trash;
