import { User } from "../schemas/UserSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  try {
    console.log(req.body);
    const isUserPresent = await User.findOne({ email: req.body.email });
    if (isUserPresent) {
      return res.status(400).send("User already there with this emailID");
    }
    const newUser = new User(req.body);
    await newUser.save();
    res.send("signup successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send("Tere is some server error");
  }
};

export const signin = async (req, res) => {
  try {
    console.log(req.body);
    const isUserPresent = await User.findOne({ email: req.body.email });
    if (!isUserPresent) {
      return res.status(400).send("User not there with this emailID");
    }
    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      isUserPresent.password
    );

    if (!isPasswordCorrect) {
      res.status(400).send("Passord and email not matching");
    }
    console.log(isPasswordCorrect);
    const token = jwt.sign(
      { userId: isUserPresent._id, userEmail: isUserPresent.email },
      "My-Seceret",
      {
        expiresIn: "1h",
      }
    );
    // isUserPresent.sessionToken = token;
    // await isUserPresent.save();
    await User.findByIdAndUpdate(
      isUserPresent._id,
      { sessionToken: token },
      { new: true, runValidators: true } // `new: true` returns the updated document
    );

    res.cookie("auth_token", token, { httpOnly: true, MaxAge: 36000 });
    res
      .status(200)
      .send({ sucess: true, message: "Userlogined", token: token });
  } catch (error) {
    console.log(error);
    res.status(500).send("Tere is some server error");
  }
};
