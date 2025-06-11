import { getClient } from "../db/client.js";
import { Rooms } from "../models/roomsModel.js";
import { User } from "../models/userModelDB.js"
const getRoomKey = (roomId) => {
    return `room:${roomId}`;
}

const createOrGetRoomRedis = async (roomId, roomname, lastActivity) => {

    try {
        //already checked if room exists or not, now save the room for persistence in db
        const roomExistsInDB = await Rooms.findOne({ roomId: roomId });
        if (!roomExistsInDB) {
            const isRoomCreated = await Rooms.create({
                roomId: roomId,
                roomname: roomname,
                memberscount: 0
            })
            console.log("room created successfulllllllly", isRoomCreated);
        }
        const client = getClient();
        const roomKey = getRoomKey(roomId);
        const roomExists = await client.exists(roomKey);
        //console.log("inside createOrGetRoomRedis", roomId, roomname);
        if (roomExists) {
            return await getRoom(roomId);
        }
        else {
            await client.hSet(roomKey, {
                roomname: roomname || roomExistsInDB.roomname,
                usercount: '0',
                lastActivity: lastActivity
            });
            await client.expire(roomKey, 24 * 60 * 60);
        }
        return await getRoom(roomId);
    }
    catch (error) {
        console.error("error while creating room in db", error);
        throw error;
    }

};

const getRoom = async (roomId) => {
    const client = getClient();
    const roomKey = getRoomKey(roomId);
    const data = await client.hGetAll(roomKey);

    if (Object.keys(data).length === 0) return null;

    return {
        roomname: data.roomname,
        usercount: parseInt(data.usercount) || 0,
        lastActivity: data.lastActivity
    }
};
//add users to room, redis only supports string,binary data no array or object so thats
//why usercount is stored as string and 
//lastmessages is  string convert using json parse and then again converted to string
const addUserToRoomRedis = async (roomId, username) => {
    try {
        // Find user in database
        const userDocDB = await User.findOne({ username: username });
        if (!userDocDB) {
            throw new Error(`User ${username} not found in database`);
        }

        // Find room in database
        const roomDocDB = await Rooms.findOne({ roomId: roomId });
        if (!roomDocDB) {
            throw new Error(`Room ${roomId} not found in database`);
        }
        // Add user to room in database (avoid duplicates with $addToSet)
        const addUserToRoomDB = await Rooms.findOneAndUpdate(
            { roomId: roomId },
            {
                $addToSet: { users: userDocDB._id }
            },
            { new: true }
        );

        // Add room to user's rooms list
        await User.findOneAndUpdate(
            { username: username },
            { $addToSet: { rooms: addUserToRoomDB._id } },
            { new: true }
        );

        // Add user to Redis
        const client = getClient();
        const userListKey = `${getRoomKey(roomId)}:users`;

        // Check if user already exists in Redis
        const userExists = await client.sIsMember(userListKey, username);
        if (!userExists) {
            // Add user to Redis set
            await client.sAdd(userListKey, username);
            // Increment user count
            await client.hIncrBy(getRoomKey(roomId), 'usercount', 1);
            console.log(`User ${username} added to room ${roomId} in Redis`);
        } else {
            console.log(`User ${username} already exists in room ${roomId} in Redis`);
        }

        // Update last activity
        await client.hSet(getRoomKey(roomId), 'lastActivity', new Date().toISOString());

        return username;
    } catch (error) {
        console.error("Error while adding user to room:", error);
        throw error; // Re-throw to handle in calling function
    }
}
//to get all users in a room
const getUsersInRoom = async (roomId) => {
    const client = getClient();
    const userListKey = `${getRoomKey(roomId)}:users`;
    return await client.sMembers(userListKey);
}

const removeUserInRoom = async (roomId, username) => {
    try {
        const client = getClient();
        const userListKey = `${getRoomKey(roomId)}:users`;
        const userExists = await client.sIsMember(userListKey, username);
        if (userExists) {
            const userRemoved = await client.sRem(userListKey, username);
            await client.hIncrBy(getRoomKey(roomId), 'usercount', -1);
            console.log("user removed", userRemoved);
        }
        else {
            console.log(`${username} doesnt exists`);
        }
        return;

    } catch (error) {
        console.error("error while removing user", error);
    }
}

export {
    getRoomKey,
    createOrGetRoomRedis,
    getRoom,
    addUserToRoomRedis,
    getUsersInRoom,
    removeUserInRoom
}
