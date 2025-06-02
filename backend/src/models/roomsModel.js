
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
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    memberscount: {
        type: Number
    },
    admin: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    messages: [{
        type: Schema.Types.ObjectId,
        ref: 'Message',
        required: true
    }]
}, { timestamp: true });

roomSchema.pre('validate', function(next) {
    this.memberscount = this.users.lenght;
    next();
});

export const Rooms = mongoose.model('Rooms', roomSchema);
