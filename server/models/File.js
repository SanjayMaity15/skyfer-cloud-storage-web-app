import { Schema, model } from "mongoose";

const fileSchema = new Schema({
	fileName: {
		type: String,
		required: true,
	},
	extension: {
		type: String,
		required: true,
	},
	size: {
		type: Number,
		required: true,
	},
	owner: {
		type: Schema.Types.ObjectId,
		require: true,
	},
	parentDirId: {
		type: Schema.Types.ObjectId,
		ref: "Directory",
	},
});

const File = model("File", fileSchema);
export default File;
