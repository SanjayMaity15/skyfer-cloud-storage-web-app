import { Schema, model } from "mongoose";

const sessionSchema = new Schema({
	userId: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	sessionEnd: {
		type: Date,
		createdAt: Date.now,
	},
}, {
    timestamps: true,
    optimisticConcurrency: true
});

// creating TTL(Time to live) index

sessionSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 });

const Session = model("Session", sessionSchema);
export default Session;
