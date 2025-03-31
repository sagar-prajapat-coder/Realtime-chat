import config from "./config.js";
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import http from "http";
import router from "./routes.js";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const activeSockets = {};  

const io = new Server(server, {
    cors: { origin: "*" }  // 🟢 Allow CORS for testing
  });

  // ✅ Socket Connection
io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);
  
    socket.on("register", (userId) => {
      activeSockets[userId] = socket.id;
      console.log(`User ${userId} connected with socketId: ${socket.id}`);
  });

      socket.on("disconnect", () => {
        for (let userId in activeSockets) {
            if (activeSockets[userId] === socket.id) {
                delete activeSockets[userId];
                console.log(`User ${userId} disconnected`);
            }
        }
    });
  });


app.use(express.json());
app.use("/api", router);

// Function to emit messages only to a specific user
export function sendMessageToUser(receiverId, messageData) {
    const receiverSocketId = activeSockets[receiverId];
    if (receiverSocketId) {
        io.to(receiverSocketId).emit("receiveMessage", messageData);
    }
}

server.listen(process.env.PORT, () => {
    console.log(`🚀 Server running on http://localhost:${process.env.PORT}`);
});

