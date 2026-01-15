import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
    },
    roomId: {
        type: String,
        index: true,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Number,
        required: true,
        index: true
    },
    message: {
        type: String
    },
    profiepic: {
        type: String
    }
}, { timestamps: true });

// Compound index for efficient queries by roomId and timestamp
messageSchema.index({ roomId: 1, timestamp: -1 });

export const Message = mongoose.model("Message", messageSchema);
