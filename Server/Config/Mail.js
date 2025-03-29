import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const sendMail = async (email, otp, subject, title, message) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
      },
    });
    let mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: subject,
      text: title,
      html: message + otp,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  } catch (error) {
    console.log("Main error from Mail: ", error.message);
    console.log("Error from Mail: ", error);
  }
};

export const sendVerificationEmail = async (email, otp) => {
  const subject = "Verify your account";
  const title = "Account Verification";
  const message = `<h1>Welcome to our HealthPlus!</h1><p>Your OTP is: `;
  await sendMail(email, otp, subject, title, message);
};
