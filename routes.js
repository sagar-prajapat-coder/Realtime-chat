import express from "express";
const router = express();
import { AuthServices } from "./Controllers/AuthController.js";
import { MessageServices } from "./Controllers/MessageController.js";
import authMiddleware from "./Middlewares/AuthMiddleware.js";

router.post("/register", AuthServices.register);
router.post("/login",AuthServices.login);

// Protected Routes (Apply middleware to all routes inside this group)
router.use(authMiddleware);
router.post("/send",MessageServices.send);
router.get("/conversation/:userId",MessageServices.conversations);


export default router; 