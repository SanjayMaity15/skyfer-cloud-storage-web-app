import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema(
	{
		userName: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			unique: true,
			required: true,
		},
		password: {
			type: String,
			default: null,
			
		},
		profilePic: {
			type: String,
			default: null,
		},
		public_id: {
			type: String
		},
		gender: {
			type: String,
			enum:["male", "female"],
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
		isDeleted: {
			type: Boolean,
			default: false
		}
		
	},
	{
		timestamps: true,
		optimisticConcurrency: true,
		virtuals: {
			isSecure: {
				get() {
					return this.password !== null 
				}
			}
		},
		toJSON: {
			virtuals: true
		}
	},
);

userSchema.pre("save", async function () {
	try {
		if (!this.isModified("password")) return;

		this.password = await bcrypt.hash(this.password, 14);
	} catch (error) {
		console.log(error);
	}
});

const User = model("User", userSchema);
export default User;
