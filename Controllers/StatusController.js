import Status from "../Model/Status.js";
import User from "../Model/User.js";


export const StatusServices = {
    statusUpload: async (req, resp) => {
      try {
        const userId = req.user.id;
  
        const fileUrl = req.file ? req.file.filename : null;
  
        const user = await User.findById(userId);
        if (!user) {
          return resp.status(404).json({ message: "User not found" });
        }
  
        if (!fileUrl) {
          return resp.status(400).json({ message: "Missing file" });
        }
  
        const newStatus = new Status({
          userId: user._id,
          fileUrl,
        });
  
        await newStatus.save();
  
        return resp.status(200).json({
          message: "Status uploaded successfully",
          status: newStatus,
        });
      } catch (error) {
        console.error("Error uploading status:", error);
        return resp.status(500).json({ message: "Internal Server Error" });
      }
    },
  };