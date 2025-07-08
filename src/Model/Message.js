import mongoose from "mongoose";
const MessageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    message: String,
    attachments:{
      type: Array,
      default: []
    },
    seen: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  });
  
const Message = mongoose.model("Message", MessageSchema);
export default Message;