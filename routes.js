import express from "express";
const router = express();
import { AuthServices } from "./Controllers/AuthController.js";

router.post("/register", AuthServices.register);
router.post("/login",AuthServices.login);



export default router;