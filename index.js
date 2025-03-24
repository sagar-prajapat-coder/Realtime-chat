import config from "./config.js";
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import http from "http";
import router from "./routes.js";

const app = express();
const server = http.createServer(app);
app.use(express.json());
app.use("/api", router);


server.listen(process.env.PORT, () => {
    console.log(`🚀 Server running on http://localhost:${process.env.PORT}`);
});

