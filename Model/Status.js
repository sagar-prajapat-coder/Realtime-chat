import mongoose from "mongoose";
const statusSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    fileUrl: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 86400 } // auto delete after 24 hours
  });
  
const Status = mongoose.model('Status', statusSchema);
export default Status;