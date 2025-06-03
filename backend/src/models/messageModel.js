import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Rooms',
        required: true,
        unique: true
    },
    username: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true
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
