import { sendSms } from "../utilities/HelperFunction.js";

export const sendSmsController = async (req, res) => {
  try {
    console.log(req.body);
    const { mobiles } = req.body;
    const response = await sendSms(mobiles);
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
