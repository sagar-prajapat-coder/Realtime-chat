import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { loadHtmlTemplate } from "./helper.js";

dotenv.config();

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});

const sendEmail = async (recipientEmail, html, sub = "") => {
  var mailOptions = {
    from: {
      name:"CodeWithSagar",
      address: "deveneoxys@gmail.com",
    },
    to: recipientEmail,
    subject: sub,
    html: html,
  };

  try { 
    await transporter.sendMail(mailOptions); 
  } catch (error) {
    throw error;
  }
};
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const emailContent = async (viewpath, valueobj = {}) => {
  const filePath = path.join(__dirname, viewpath);
  const template = await loadHtmlTemplate(filePath, valueobj);
  return template;
};

export { sendEmail,emailContent };
