import mongoose from "mongoose";
const Blockuserschema   = new mongoose.Schema({
  blockerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // User who blocked
  blockedId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // User being blocked
  status: { type: Number, default: 1 }, // 1 = Blocked, 0 = Unblocked
}, { timestamps: true });

const BlockUser = mongoose.model("BlockUser", Blockuserschema);

export default  BlockUser; 