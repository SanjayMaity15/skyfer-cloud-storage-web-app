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

	isUploaded: {
		type: String,
		enum: ["pending", "completed", "failed"],
		default: "pending"
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
