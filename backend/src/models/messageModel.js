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
        required: true
    },
    message: {
        type: String
    },
    profiepic: {
        type: String
    }

})

export const Message = mongoose.model("Message", messageSchema);
