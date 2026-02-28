import { Schema, model } from "mongoose";

const userSchema = new Schema({
	userName: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
	},
	profilePic: {
		type: String,
		default: null,
	},
	rootDirId: {
		type: Schema.Types.ObjectId,
		ref: "Directory",
		required: true,
	},
	role: {
		type: String,
		enum: ["admin", "user"],
		default: "user",
	},
});

const User = model("User", userSchema);
export default User;
