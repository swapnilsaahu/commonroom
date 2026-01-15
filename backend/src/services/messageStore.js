import { Message } from "../models/messageModel.js";
import { Rooms } from "../models/roomsModel.js";

// In-memory cache for recent messages (last 20 per room)
const messageCache = new Map();

const addMessage = async (roomId, message) => {
    try {
        const updateLastActivity = new Date();

        // Save message to MongoDB immediately
        const savedMessage = await Message.create({
            id: message.id,
            roomId: roomId,
            username: message.username,
            timestamp: message.timestamp,
            message: message.message,
            profiepic: message.profiepic
        });

        // Update room's last activity
        await Rooms.findOneAndUpdate(
            { roomId: roomId },
            { $set: { lastActivity: updateLastActivity } }
        );

        // Update in-memory cache (keep last 20 messages)
        if (!messageCache.has(roomId)) {
            messageCache.set(roomId, []);
        }
        const cachedMessages = messageCache.get(roomId);
        cachedMessages.push(message);
        
        // Keep only last 20 messages in cache
        if (cachedMessages.length > 20) {
            cachedMessages.shift(); // Remove oldest message
        }

        return message;
    } catch (error) {
        console.error("Error while adding message:", error);
        throw error;
    }
};

const getLastNMessages = async (roomId, limit = 20) => {
    try {
        // Check cache first
        if (messageCache.has(roomId)) {
            const cachedMessages = messageCache.get(roomId);
            if (cachedMessages.length >= limit) {
                return cachedMessages.slice(-limit);
            }
        }

        // If cache doesn't have enough messages, fetch from MongoDB
        const messages = await Message.find({ roomId: roomId })
            .sort({ timestamp: -1 })
            .limit(limit)
            .lean(); // Use lean() for better performance

        // Reverse to get chronological order (oldest first)
        const sortedMessages = messages.reverse();

        // Update cache
        messageCache.set(roomId, sortedMessages.slice(-20));

        return sortedMessages;
    } catch (error) {
        console.error("Error while getting last N messages:", error);
        throw error;
    }
};

const batchStoreMessageDB = async (roomId) => {
    // Messages are now saved immediately, so this function is no longer needed
    // Keeping it for backward compatibility
    console.log(`batchStoreMessageDB called for room ${roomId} - messages are now saved immediately`);
    return Promise.resolve();
};

export {
    addMessage,
    getLastNMessages,
    batchStoreMessageDB
}
