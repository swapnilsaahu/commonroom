import mongoose from "mongoose"

const roomSchema = new mongoose.Schema({
    roomId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    roomname: {
        type: String,
        required: true
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    activeUsers: [{
        type: String, // Store usernames for active sessions
        required: false
    }],
    memberscount: {
        type: Number,
        default: 0
    },
    lastActivity: {
        type: Date,
        default: Date.now,
        index: true
    }
}, { timestamps: true });

roomSchema.pre('validate', function(next) {
    this.memberscount = this.users.length;
    next();
});

// Index for faster queries
roomSchema.index({ roomId: 1 });
roomSchema.index({ lastActivity: -1 });

export const Rooms = mongoose.model('Rooms', roomSchema);
