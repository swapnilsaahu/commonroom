import { getClient } from "../db/client.js";

const getRoomKey = (roomId) => {
    return `room:${roomId}`;
}

const createOrGetRoomRedis = async (roomId, roomname, createdAt) => {
    const client = getClient();
    const roomKey = getRoomKey(roomId);
    const roomExists = await client.exists(roomKey);
    console.log("inside createOrGetRoomRedis", roomId, roomname);
    if (!roomExists) {
        await client.hSet(roomKey, {
            roomname,
            usercount: '0',
            createdAt: createdAt
        });
        await client.expire(roomKey, 24 * 60 * 60);
    }
    return await getRoom(roomId);
};

const getRoom = async (roomId) => {
    const client = getClient();
    const roomKey = getRoomKey(roomId);
    const data = await client.hGetAll(roomKey);

    if (Object.keys(data).length === 0) return null;

    return {
        roomname: data.roomname,
        usercount: parseInt(data.usercount) || 0,
        createdAt: data.createdAt
    }
};
//add users to room, redis only supports string,binary data no array or object so thats
//why usercount is stored as string and 
//lastmessages is  string convert using json parse and then again converted to string
const addUserToRoomRedis = async (roomId, username) => {
    const client = getClient();
    const userListKey = `${getRoomKey(roomId)}:users`;

    const userExists = await client.lRange(userListKey, 0, -1);
    // If users exist
    if (!userExists.includes(username)) {
        await client.rPush(userListKey, username);
        await client.hIncrBy(getRoomKey(roomId), 'usercount', 1);
    }
    return username;
}
//to get all users in a room
const getUsersInRoom = async (roomId) => {
    const client = getClient();
    const userListKey = `${getRoomKey(roomId)}:users`;
    return await client.lRange(userListKey, 0, -1);
}
const addMessage = async (roomId, message) => {
    const client = getClient();
    const messageListKey = `${getRoomKey(roomId)}:messages`;

    // add message to the start of the list
    await client.lPush(messageListKey, JSON.stringify(message));

    // trim the list to only the last 10 messages
    await client.lTrim(messageListKey, 0, 9); // Keeps only first 10 items (most recent)

    return message;
};

const getMessages = async (roomId) => {
    const client = getClient();
    const messageListKey = `${getRoomKey(roomId)}:messages`;

    const messages = await client.lRange(messageListKey, 0, -1); // Get all messages
    return messages.map(msg => JSON.parse(msg)); // Parse each stringified message
};


export {
    createOrGetRoomRedis,
    getRoom,
    addUserToRoomRedis,
    getUsersInRoom,
    addMessage,
    getMessages
}
