import mongoose from "mongoose";
import { Schema } from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    mobile: { type: Number, required: true },
    sessionToken: { type: String },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  const user = this;
  // Only hash the password if it has been modified or is new
  console.log(user.isModified("password"), user.isNew);
  if (!user.isModified("password")) return next();
  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    // Hash the password using the salt
    user.password = await bcrypt.hash(user.password, salt);
    console.log(user.password);
    next();
  } catch (err) {
    next(err);
  }
});

export const User = mongoose.model("User", UserSchema);
