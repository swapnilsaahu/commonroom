import { Rooms } from "../models/roomsModel.js";
import { User } from "../models/userModelDB.js"

/**
 * @param {string} roomId - 
 * @param {string} roomname - Name of the room
 * @param {string} lastActivity 
 * @returns {Promise<Object>} Room object with roomname, usercount, and lastActivity
 */
const createOrGetRoom = async (roomId, roomname, lastActivity) => {
    try {
        // Check if room exists in database
        let room = await Rooms.findOne({ roomId: roomId });
        
        if (!room) {
            // Create new room
            room = await Rooms.create({
                roomId: roomId,
                roomname: roomname,
                memberscount: 0,
                activeUsers: [],
                lastActivity: lastActivity || new Date()
            });
            console.log("Room created successfully:", room.roomId);
        } else {
            // Update last activity if provided
            if (lastActivity) {
                room.lastActivity = new Date(lastActivity);
                await room.save();
            }
        }

        return {
            roomname: room.roomname,
            usercount: room.activeUsers ? room.activeUsers.length : 0,
            lastActivity: room.lastActivity ? room.lastActivity.toISOString() : new Date().toISOString()
        };
    } catch (error) {
        console.error("Error while creating/getting room in DB:", error);
        throw error;
    }
};

/**
 * @param {string} roomId 
 * @returns {Promise<Object|null>} 
 */
const getRoom = async (roomId) => {
    try {
        const room = await Rooms.findOne({ roomId: roomId });
        
        if (!room) {
            return null;
        }

        return {
            roomname: room.roomname,
            usercount: room.activeUsers ? room.activeUsers.length : 0,
            lastActivity: room.lastActivity ? room.lastActivity.toISOString() : new Date().toISOString()
        };
    } catch (error) {
        console.error("Error while getting room:", error);
        throw error;
    }
};

/**
 * @param {string} roomId 
 * @param {string} username -
 * @returns {Promise<string>} Username that was added
 */
const addUserToRoom = async (roomId, username) => {
    try {
        const userDocDB = await User.findOne({ username: username });
        if (!userDocDB) {
            throw new Error(`User ${username} not found in database`);
        }

        const roomDocDB = await Rooms.findOne({ roomId: roomId });
        if (!roomDocDB) {
            throw new Error(`Room ${roomId} not found in database`);
        }

        // Add user to room's users array
        const updatedRoom = await Rooms.findOneAndUpdate(
            { roomId: roomId },
            {
                $addToSet: { 
                    users: userDocDB._id,
                    activeUsers: username
                },
                $set: { lastActivity: new Date() }
            },
            { new: true }
        );

        // Add room to user's rooms list
        await User.findOneAndUpdate(
            { username: username },
            { $addToSet: { rooms: updatedRoom._id } },
            { new: true }
        );

        console.log(`User ${username} added to room ${roomId}`);
        return username;
    } catch (error) {
        console.error("Error while adding user to room:", error);
        throw error;
    }
};

/**
 * @param {string} roomId - Unique room identifier
 * @returns {Promise<Array<string>>} Array of usernames
 */
const getUsersInRoom = async (roomId) => {
    try {
        const room = await Rooms.findOne({ roomId: roomId }).select('activeUsers');
        return room && room.activeUsers ? room.activeUsers : [];
    } catch (error) {
        console.error("Error while getting users in room:", error);
        throw error;
    }
};

/**
 * @param {string} roomId - Unique room identifier
 * @param {string} username - Username to remove
 * @returns {Promise<void>}
 */
const removeUserInRoom = async (roomId, username) => {
    try {
        const room = await Rooms.findOne({ roomId: roomId });
        
        if (!room) {
            console.log(`Room ${roomId} not found`);
            return;
        }

        // Check if user exists in activeUsers
        if (room.activeUsers && room.activeUsers.includes(username)) {
            await Rooms.findOneAndUpdate(
                { roomId: roomId },
                {
                    $pull: { activeUsers: username },
                    $set: { lastActivity: new Date() }
                }
            );
            console.log(`User ${username} removed from room ${roomId}`);
        } else {
            console.log(`User ${username} doesn't exist in room ${roomId}`);
        }
    } catch (error) {
        console.error("Error while removing user:", error);
        throw error;
    }
};

export {
    createOrGetRoom,
    getRoom,
    addUserToRoom,
    getUsersInRoom,
    removeUserInRoom
}
