import express from "express";
import dotenv from "dotenv";
import router from "./routes/route.js";
import fileUpload from "express-fileupload";
import cors from "cors";
import http from "http";
import { fileURLToPath } from "url";
import path from "path";
import { initSocket } from "./config/Socket.js";
const app = express();
const server = http.createServer(app);
initSocket(server);

dotenv.config();

app.use(async (req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, "../public")));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: false }));
app.use(cors(
  "http://192.168.56.1:5173/"
));


app.use(
  fileUpload({
    limits: { fileSize: 100 * 1024 * 1024 },
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
app.use("/api/v1", router);

app.use((req, res) => {
  res.status(404).json({ status: false, error: "Resource not found" });
});

export { app, server };
