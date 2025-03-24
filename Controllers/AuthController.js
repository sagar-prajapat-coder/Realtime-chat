import User from "../Model/User.js";
import bcrypt from "bcryptjs";
import ResponseBuilder from "../Response/ResponseBuilder.js";
import Lang from "../Lang/en.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();


export const AuthServices = {

    register: async(req, resp)  =>  {
        try{
            const {name,email,password} =   req.body;
            if(!name || !email || !password){
                return resp.status(400).json({error: "All fields are required"});
            }
            const sanetizeEmail = email.trim().toLowerCase();
            const exist = await User.findOne({ email: sanetizeEmail });
      
            if (exist) {
              return ResponseBuilder.errorMessage("Email already exists", 400).build(resp);
            }
      
            const hashedPassword = await bcrypt.hash(password, 10);
      
            const user = new User({
              name,
              email: sanetizeEmail,
              password: hashedPassword,
            });
      
            await user.save();
            return ResponseBuilder.successMessage(Lang.SUCCESS.USER_CREATED, 201, user).build(resp);

        }catch(error){
            console.error("Error creating user:", error);
            return resp.status(500).json({ error: "Internal Server Error" });
        }
    },
    
    login: async(req, resp) => {
        try{
            const {email, password} = req.body;
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
        
              return ResponseBuilder.successMessage(Lang.SUCCESS.LOGIN_SUCCESS, 200, { token }).build(resp);

        }catch(error){
            console.error("Error login user:", error);
            return resp.status(500).json({ error: "Internal Server Error" });
        }
    }
};