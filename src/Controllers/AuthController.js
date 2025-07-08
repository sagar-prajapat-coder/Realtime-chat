import bcrypt from "bcryptjs";
import Lang from "../Lang/en.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import ResponseBuilder from "../utils/ResponseBuilder.js";
import User from "../Model/User.js";
import { validationResult } from "express-validator";
dotenv.config();

export const AuthServices = {
  register: async (req, resp) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return ResponseBuilder.error(errors.array()[0].msg, 400).build(resp);
    try {
      const { name, email, password } = req.body;
      const sanetizeEmail = email.trim().toLowerCase();
      const exist = await User.findOne({ email: sanetizeEmail });

      if (exist) {
        return ResponseBuilder.errorMessage("Email already exists", 400).build(
          resp
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new User({
        name,
        email: sanetizeEmail,
        password: hashedPassword,
      });

      await user.save();
      return ResponseBuilder.success(
        user,
        Lang.SUCCESS.USER_CREATED,
        201
      ).build(resp);
    } catch (error) {
      console.error("Error creating user:", error);
      return resp.status(500).json({ error: "Internal Server Error" });
    }
  },

  login: async (req, resp) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return ResponseBuilder.error(errors.array()[0].msg, 400).build(resp);
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return resp.status(404).json({ message: "User not found" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return resp.status(400).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      return ResponseBuilder.successWithToken(
        token,
        user,
        Lang.SUCCESS.LOGIN_SUCCESS,
        200
      ).build(resp);
    } catch (error) {
      console.error("Error login user:", error);
      return resp.status(500).json({ error: "Internal Server Error" });
    }
  },

  logout: async (req, resp) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token)
        return resp.status(400).json({ message: "No token provided" });

      // Set token expiration time to 1 hour
      await client.set(token, "blacklisted", { EX: 3600 });

      return resp.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      return resp.status(500).json({ message: "Logout failed", error });
    }
  },
};
