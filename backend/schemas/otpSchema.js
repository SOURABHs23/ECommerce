import mongoose from "mongoose";
import { Schema } from "mongoose";

const otpSchema = new Schema(
  {
    jwt: { type: String, required: true },
    otp: { type: Number, required: true },
    // createdAt: { type: Date, expires: 10, default: Date.now },
  },
  { timestamps: true }
);

// otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 10 });

export const Otp = mongoose.model("Otp", otpSchema);
