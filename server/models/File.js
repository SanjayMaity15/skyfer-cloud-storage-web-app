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
	url: {
		type: String,
		required: true
	},
	public_id: {
		type: String	
	},
	resource_type: {
		type: String	
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
	isDeleted: {
		type: Boolean,
		default: false
	}
}, {
    timestamps: true,
    optimisticConcurrency: true
});

const File = model("File", fileSchema);
export default File;
