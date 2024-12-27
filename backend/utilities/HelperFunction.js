import { transporter } from "../config/nodemailer.js";

export const sendEmail = async (emails, subject, message) => {
  const mailOptions = {
    from: "sourabhgarg523@gmail.com",
    to: emails,
    subject: subject,
    text: message,
    html: `<b>${message}</b>`,
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.log("Error sending email: " + error);
    throw new Error(error);
  }
};

export const sendSms = async (mobiles, otp) => {
  try {
    const API_KEY =
      "NeXEiZ9HdLPfRu7Uky1QMvSIxcsrBJolwjGqY5p0F8C3hzT6bDZP58CmIa6we2xqNtWouzgjbiB9L1FE";

    const response = await fetch(
      `https://www.fast2sms.com/dev/bulkV2?authorization=${API_KEY}&variables_values=${otp}&route=otp&numbers=${mobiles.join(
        ","
      )}`,
      {
        method: "GET",
      }
    );
    const data = await response.json();
    console.log(data);
    return { Sucess: true, message: "OTP sent successfully" };
  } catch (error) {
    console.log("Error sending sms: " + error);
    return { Sucess: false, message: "There is some server error " };
  }
};
