import nodemailer from "nodemailer";

// Create a transporter object
export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // Use your email service provider
  port: 587,
  secure: false,
  auth: {
    user: "sourabhgarg523@gmail.com", // Your email address
    pass: "", // Your email password
  },
});

transporter.verify((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Ready to send emails");
  }
});

//oitsvochtnrlcyvd
