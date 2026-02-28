import { Schema, model } from "mongoose"

const otpSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
}, {
    timestamps: true,
    optimisticConcurrency: true
})

otpSchema.index({createdAt: 1}, {expireAfterSeconds: 5 * 60})

const Otp = model("Otp", otpSchema)
export default Otp;