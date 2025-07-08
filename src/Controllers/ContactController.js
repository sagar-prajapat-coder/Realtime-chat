import { validationResult } from "express-validator";
import { emailContent, sendEmail } from "../utils/emailSender.js";
import ResponseBuilder from "../utils/ResponseBuilder.js";
import { errorHandler } from "../Middlewares/rules/errorhandler.js";

export const ContactController = {
  sendContactInfo: async (req, res) => {
    const { name, email, message } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return ResponseBuilder.error(errors.array()[0].msg, 400).build(res);
    try {
      const template = await emailContent("../view/ContactEmailTemplate.html", {
        NAME: name,
        MESSAGE: message,
        EMAIL:email
      });

      await sendEmail(process.env.MAIL_USERNAME, template, "Sagar's Portfolio Contact Form");

      return ResponseBuilder.success(
        true,
        "Contact information sent successfully",
        200
      ).build(res);
    } catch (error) {
      errorHandler(error,req,res);
    }
  },
};
