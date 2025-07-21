import mongoose from "mongoose"

const roomSchema = new mongoose.Schema({
    roomId: {
        type: String,
        required: true,
        unique: true
    },
    roomname: {
        type: String,
        required: true
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    memberscount: {
        type: Number
    }
}, { timestamp: true });

roomSchema.pre('validate', function(next) {
    this.memberscount = this.users.length;
    next();
});

export const Rooms = mongoose.model('Rooms', roomSchema);
