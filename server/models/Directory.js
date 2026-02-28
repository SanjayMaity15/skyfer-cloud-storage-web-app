import { Schema, model } from "mongoose";

const directorySchema = new Schema({
	dirName: {
		type: String,
		required: true,
	},
	owner: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	parentDirId: {
		type: Schema.Types.ObjectId,
		required: true,
		default: null,
	},
});

const Directory = model("Directory", directorySchema);
export default Directory;
