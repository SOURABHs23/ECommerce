import { sendEmail } from "../utilities/HelperFunction.js";
import { User } from "../schemas/UserSchema.js";
import { sendSms } from "../utilities/HelperFunction.js";
import { Otp } from "../schemas/otpSchema.js";

export const sendEmailController = async (req, res) => {
  try {
    console.log(req.body);
    const { emails, subject, message } = req.body;
    await sendEmail(emails, subject, message);
    res.status(200).send("Email sent successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send("There is some server error");
  }
};

const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000);
};

export const sendSmsController = async (req, res) => {
  try {
    const OTP = generateOTP();
    console.log(OTP);
    console.log(req.body);
    let mobiles = req.body.mobiles;

    if (!mobiles || mobiles.length === 0) {
      const jwt = req.cookies.auth_token;
      const user = await User.findOne({ sessionToken: jwt });
      mobiles = [user.mobile];
      const otp = new Otp({ jwt, otp: OTP });
      await otp.save();
      setTimeout(async () => {
        await Otp.findOneAndDelete({ jwt });
      }, 30000);
    }
    const response = await sendSms(mobiles, OTP);
    if (!response.Sucess) {
      return res.status(400).send(response.message);
    } else {
      return res.status(200).send(response.message);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("There is some server error");
  }
};

export const verifyOtpController = async (req, res) => {
  try {
    const otp = req.params.otp;
    const jwt = req.cookies.auth_token;
    const otpData = await Otp.findOne({ jwt });
    if (!otpData) {
      return res.status(400).send("OTP expired");
    }
    if (otpData.otp == otp) {
      await User.findOneAndUpdate(
        { sessionToken: jwt },
        { verifyMobile: true }
      );
      await Otp.findOneAndDelete({ jwt });
      return res.status(200).send("OTP verified successfully");
    } else {
      return res.status(400).send("OTP not matched");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("There is some server error");
  }
};
