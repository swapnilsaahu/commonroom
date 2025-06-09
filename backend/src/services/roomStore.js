import { getClient } from "../db/client.js";
import { Rooms } from "../models/roomsModel.js";
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
        const roomnameFromDB = roomExistsInDB.roomname;
        console.log("inside createOrGetRoomRedis", roomId, roomname);
        if (roomExists) {
            return await getRoom(roomId);
        }
        else {
            await client.hSet(roomKey, {
                roomname: roomname || roomnameFromDB,
                usercount: '0',
                lastActivity: lastActivity
            });
            await client.expire(roomKey, 24 * 60 * 60);
        }
        return await getRoom(roomId);
    }
    catch (error) {
        console.error("error while creating room in db", error);
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
        const userDocDB = await User.findOne({ username: username });
        const addUserToRoomDB = await Rooms.findOneAndUpdate(
            { roomId: roomId },
            { $addToSet: { users: userDocDB._id } },
            { new: true }
        )
        if (!addUserToRoomDB) {
            console.error("unable to update the room with user in db", error);
            return;
        }

        const client = getClient();
        const userListKey = `${getRoomKey(roomId)}:users`;
        // If users doesnt exist
        const userExists = await client.sIsMember(userListKey, username);
        if (!userExists) {
            await client.sAdd(userListKey, username);
            await client.hIncrBy(getRoomKey(roomId), 'usercount', 1);
        }
        return username;
    } catch (error) {
        console.error("error while adding user to db", error);
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
