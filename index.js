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
const users = {}; // Store connected users and their socket IDs

const io = new Server(server, {
        cors: { origin: "*",   
        methods: ["GET", "POST"]
    },
  });

  // ✅ Socket Connection
io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.onAny((event, data) => {
        console.log(`📩 Received event: ${event}`, data);
    });
  
    socket.on("register", (userId) => {
        console.log("🛑 Received register event with userId:", userId); // Debugging log

        if (!userId) {
            console.log("⚠️ No userId received!");
            return;
        }

        users[userId] = socket.id;
        console.log(`✅ User ${userId} registered with socket ${socket.id}`);

        // Send confirmation back
        socket.emit("registered", { message: "Registered successfully" });
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
        for (const [userId, socketId] of Object.entries(users)) {
            if (socketId === socket.id) {
                delete users[userId];
                break;
            }
        }
    });
  });


app.use(express.json());
app.use("/api", router);

// Function to emit messages only to a specific user
export function sendMessageToUser(receiverId, messageData) {
    const receiverSocketId = activeSockets[receiverId];
    console.log(`Sending message to ${receiverId}:`, messageData);
    if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", messageData);
    }
}

server.listen(process.env.PORT, () => {
    console.log(`🚀 Server running on http://localhost:${process.env.PORT}`);
});

