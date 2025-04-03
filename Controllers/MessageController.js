import Message from "../Model/Message.js";
import Lang from "../Lang/en.js";
import ResponseBuilder from "../Response/ResponseBuilder.js";
import User from "../Model/User.js";
import BlockUser from "../Model/BlockUser.js";
import { sendMessageToUser } from "../index.js";  // 🟢 Import `io` from index.js


export const MessageServices = {

    send: async(req,resp)  => {
        try{
            const { receiverId, message } = req.body;
            if (!receiverId || !message) {
                return resp.status(400).json({ message: "Receiver and message are required" });
            }
            const receiver = await User.findById(receiverId);
            if (!receiver) {
            return resp.status(404).json({ message: "Receiver not found" });
            }

            // Check if the sender is blocked by the receiver
        const isBlocked = await BlockUser.findOne({ blockerId: receiverId, blockedId: req.user.id, status: 1 });

        if (isBlocked) {
            return resp.status(403).json({ message: `${receiver.name} blocked you` });
        }

            const newMessage = new Message({
            sender: req.user.id,
            receiver: receiverId,
            message
            });
            await newMessage.save();


             // Emit message only to the intended user
             sendMessageToUser(receiverId, {
                senderId: req.user.id,
                receiverId,
                message,
                timestamp: new Date().toISOString()
            });


            return ResponseBuilder.successMessage(Lang.SUCCESS.MESSAGE_SEND, 201, newMessage).build(resp);

        }catch(error){
            resp.status(500).json({ message: "Error sending message", error });

        }
    },

    conversations: async(req,resp)  => {
            try{
                const { userId } = req.params;
                if (!userId) {
                return resp.status(400).json({ message: "User ID is required" });
                }
                 //Fetch Messages (Both Sides)
                const messages = await Message.find({
                    $or: [
                    { sender: req.user.id, receiver: userId }, // Aap → Other User
                    { sender: userId, receiver: req.user.id }  // Other User → Aap
                    ]
                }).sort({ createdAt: 1 }).populate("sender", "name");

                const formattedMessages = messages.map(msg => ({
                    name: msg.sender.name,
                    message: msg.message,
                    time: msg.createdAt
                  }));

                resp.json(formattedMessages);

            }catch(error){
                resp.status(500).json({ message: "Error fetching message", error });
            }
    },

    chatList: async(req,resp)   => {
        try {
            const userList = await User.find({}, { name: 1, email: 1, _id: 1 });
    
            if (!userList.length) {
                return resp.status(200).json({ message: "No users found" });
            }
    
            resp.status(200).json({ users: userList });
    
        } catch (error) {
            console.error("Error fetching user list:", error);
            resp.status(500).json({ message: "Error fetching user list", error });
        }
    },

    blockUnblock: async (req, resp) => {
        try {
            const { blockerId, blockedId, status } = req.body;
    
            // Validate input
            if (!blockerId || !blockedId || status === undefined) {
                return resp.status(400).json({ message: "Blocker ID, Blocked ID, and status are required" });
            }
    
            // Check if users exist
            const blocker = await User.findById(blockerId);
            const blockedUser = await User.findById(blockedId);
            if (!blocker || !blockedUser) {
                return resp.status(404).json({ message: "One or both users not found" });
            }
      
            // Check if already exists
            let blockEntry = await BlockUser.findOne({ blockerId, blockedId });
    
            if (status === 1) {
                // Block User
                if (!blockEntry) {
                    blockEntry = new BlockUser({ blockerId, blockedId, status });
                } else {
                    blockEntry.status = 1; // Update to blocked
                }
                await blockEntry.save();
    
                return resp.status(200).json({ message: "User blocked successfully", blockEntry });
            } else {
                // Unblock User
                if (blockEntry) {
                    blockEntry.status = 0;
                    await blockEntry.save();
    
                    return resp.status(200).json({ message: "User unblocked successfully" });
                } else {
                    return resp.status(400).json({ message: "User is not blocked" });
                }
            }
        } catch (error) {
            console.error("Error in block/unblock:", error);
            resp.status(500).json({ message: "Error in block/unblock", error });
        }
    }
    
};  