import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USER,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
  },
});

transporter.verify((error) => {
  if (error) {
    console.error("❌ Email service error:", error.message);
  } else {
    console.log("Email service is ready");
  }
});

export async function sendEmail({ to, subject, html, text }) {
  try {
    await transporter.sendMail({
      from: `"AI Answer Engine" <${process.env.EMAIL_USER}>`, 
      to,
      subject,
      html,
      text,
    });

    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error("Error sending email:", error.message);
  }
}