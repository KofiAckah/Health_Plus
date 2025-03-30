import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const sendMail = async (email, subject, title, message) => {
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
      html: message,
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
  const message = `<h1>Welcome to HealthPlus!</h1><p>Your OTP is: <strong>${otp}</strong></p> <p>OTP would be deleted after 10 minutes.</p>`;
  await sendMail(email, subject, title, message);
};

export const requestAnotherOTP = async (email, otp) => {
  const subject = "Request another OTP";
  const title = "Request another OTP";
  const message = `<h1>HealthPlus!</h1><p>Your new OTP is: <strong>${otp}</strong></p> <p>OTP would be deleted after 10 minutes.</p>`;
  await sendMail(email, subject, title, message);
};
