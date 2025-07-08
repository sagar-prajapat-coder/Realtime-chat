import { Server } from "socket.io";

let io;
const onlineUsers = new Map();

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("🟢 User connected:", socket.id);

    // User joins their personal room
    socket.on("join", (userId) => {
      socket.join(userId);
      onlineUsers.set(userId, socket.id);
      console.log(`${userId} joined their personal room`);
      socket.broadcast.emit("userOnline", userId);
    });

    // Send message with attachments support
    socket.on("sendMessage", ({ sender, receiver, message, attachments }) => {
      console.log(
        `📤 ${sender} → ${receiver}: ${message || "[No text]"} ${
          attachments ? `(Attachment: ${attachments})` : ""
        }`
      );

      // Emit to receiver
      io.to(receiver).emit("receiveMessage", {
        message,
        attachments,
        fromSelf: false,
        sender,
        receiver,
        createdAt: new Date(),
      });

      // Optionally emit back to sender
      socket.emit("receiveMessage", {
        message,
        attachments,
        fromSelf: true,
        sender,
        receiver,
        createdAt: new Date(),
      });
    });
 
    // Seen status
    socket.on("messagesSeen", ({ sender, receiver }) => {
      io.to(sender).emit("updateSeenStatus", { from: receiver });
      console.log(`👁️‍🗨️ Seen sent to ${sender} from ${receiver}`);
    });

    // Typing indicators
    socket.on("typing", ({ sender, receiver }) => {
      io.to(receiver).emit("userTyping", { from: sender });
    });

    socket.on("stopTyping", ({ sender, receiver }) => {
      io.to(receiver).emit("userStoppedTyping", { from: sender });
    });

    // Disconnect
    socket.on("disconnect", () => {
      console.log("🔴 User disconnected:", socket.id);

      // Find which user ID this socket belonged to
      const userId = [...onlineUsers.entries()].find(
        ([, socketId]) => socketId === socket.id
      )?.[0];

      if (userId) {
        onlineUsers.delete(userId);
        socket.broadcast.emit("userOffline", userId);
      }
    });
  });
};

export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
};

export const getOnlineUsers = () => onlineUsers;
