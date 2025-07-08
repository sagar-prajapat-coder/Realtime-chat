import express from "express";
import { AuthServices } from "../Controllers/AuthController.js";
import { MessageServices } from "../Controllers/MessageController.js";
import authMiddleware from "../Middlewares/AuthMiddleware.js";
import { StatusServices } from "../Controllers/StatusController.js";
import upload from "../Middlewares/Multer.js";
import { LoginValidator, registerValidator } from "../Middlewares/rules/auth.rule.js";
import { conversationValidator, sendMessageValidator } from "../Middlewares/rules/message.rule.js";
import { ContactController } from "../Controllers/ContactController.js";
import { ContactValidator } from "../Middlewares/rules/contact.rule.js";
const router = express();


router.post("/register", registerValidator,AuthServices.register);
router.post("/login",LoginValidator,AuthServices.login);
// portfolio route
router.post("/contact",ContactValidator,ContactController.sendContactInfo)

// Protected Routes (Apply middleware to all routes inside this group)
router.use(authMiddleware);
router.post("/send",sendMessageValidator,MessageServices.send);
router.get("/conversation/:userId",conversationValidator,MessageServices.conversations);
router.get("/chat-list",MessageServices.chatList);
router.post('/block-unblock',MessageServices.blockUnblock);
router.post("/logout",AuthServices.logout);

// message routes
router.post("/messages/seen",MessageServices.messageSeen);

// status routes here
router.post("/status-upload",upload,StatusServices.statusUpload);


export default router;      