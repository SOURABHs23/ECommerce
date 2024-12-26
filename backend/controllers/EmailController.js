import { sendEmail } from "../utilities/HelperFunction.js";

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
