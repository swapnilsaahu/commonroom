import { addUserToRoomRedis, createOrGetRoomRedis, getRoom, getUsersInRoom } from "../services/roomStore.js";

import { Rooms } from "../models/roomsModel.js"
import { User } from "../models/userModelDB.js"

//gets random number converts them to base 36 and slice the string to remove decimal and make it short
const randomId = () => {
    return Math.random().toString(36).substring(2, 10);
}
//checkid in roomstore to see if user already exists object here is roomstore with all details
const checkId = (id, object) => {
    for (const key in object) {
        if (key === id) {
            return false;
        }
    }
    return true;
};
//does 100 attempt to generate unique id for a room 
const getId = (object) => {
    const limit = 100;
    let attempt = 0;
    let id = false;
    while (!id && attempt < limit) {
        id = randomId();
        if (!checkId(id, object)) {
            id = false;
            attempt++;
        }
    }
    return id;
}
const createRoom = async (roomStore, roomId, roomname, username) => {

    const lastActivity = new Date().toISOString();
    if (!roomStore[roomId]) {
        roomStore[roomId] = {
            users: {},
            usercount: 0,
            roomname: roomname
        }
    }
    console.log(roomStore);
    const res = await createOrGetRoomRedis(roomId, roomname, lastActivity, username);
    return res;

}
const addUserToRoom = async (roomStore, roomId, username, ws) => {
    //if room already exists to add members for join 

    roomStore[roomId].users[username] = ws;
    const userCount = Object.keys(roomStore[roomId].users).length;
    roomStore[roomId].usercount = userCount;

    const res = await addUserToRoomRedis(roomId, username);
    return res;
}

const createRoomMessage = async (ws, data, roomStore) => {
    //was trying query way but realised there are easy ways to send info in websocket
    const { username, roomname } = data;
    if (!username) {
        ws.close(1008, "Missing required username parameters."); //1008 because it recived wrong inputs policy violations and closes the ws
        return;
    }
    const roomId = getId(roomStore);
    //random unique
    try {
        const resRoomId = await createRoom(roomStore, roomId, roomname, username);
        const resUsername = await addUserToRoom(roomStore, roomId, username, ws);


        console.log(roomStore);
        console.log(`Creator ${resUsername} created roomID ${resRoomId}`);
        //below gets all the connected clients to the websocket server 
        if (ws.readyState === ws.OPEN) {
            ws.send(JSON.stringify({
                success: true,
                roomId: roomId,
                type: "created",
                roomname: roomname,
                msg: "room created successfully"
            }));
        }
    }
    catch (error) {
        console.error("error creating room", error);
        ws.close(1011, "internal server error");
    }
}

const joinRoomMessage = async (ws, data, roomStore) => {

    const { roomId, username } = data;
    if (!roomId && !username) {
        ws.close(1008, "please provide proper details");
        return;
    };

    const roomExists = getRoom(roomId);

    if (!roomStore[roomId] && !roomExists) {
        //check in redis if room exists or not 
        console.log("Room does not exist in redis");
        const roomExistsInDB = await Rooms.findOne({ roomId: roomId });
        if (!roomExistsInDB) {
            ws.close(1008, "room doesnt exists");
            return;
        }
    }

    try {
        const resUsername = await addUserToRoom(roomStore, roomId, username, ws);
        if (resUsername) {
            console.log(`${resUsername} joined the rooom with id: ${roomId}`);
        }
        //below gets all the connected clients to the websocket server 
        const clients = Object.values(roomStore[roomId].users);
        for (const client of clients) {
            if (client.readyState === ws.OPEN) {
                client.send(JSON.stringify({
                    success: true,
                    roomId: roomId,
                    type: "joined",
                    msg: "user joined successfully"
                }));
            }
        }
    }
    catch (error) {
        console.error('error joining the room', error);
        ws.close(1011, "internal server error");
    }
}



const getUsers = async (ws, data) => {
    try {
        const { roomId } = data;
        const users = await getUsersInRoom(roomId);
        if (ws.readyState === ws.OPEN) {
            ws.send(JSON.stringify({
                success: true,
                type: "getUsersInRoom",
                users: users,
                roomId: roomId
            }))
        }
    }
    catch (error) {
        console.error("error while fetching users", error);
    }
}

const getRooms = async (ws, data) => {
    const { username } = data;
    const user = await User.findOne({ username: username }).populate('rooms');
    const roomList = user.rooms;
    if (ws.readyState === ws.OPEN) {
        ws.send(JSON.stringify({
            success: true,
            type: "getRooms",
            rooms: roomList
        }))
    }
}

const reconnectRoom = async (ws, data, roomStore) => {
    try {
        const { username, roomId } = data;
        if (!username || !roomId) {
            console.error("invalid params");
            return;
        }

        const resRoomId = await createRoom(roomStore, roomId, roomname, username);
        const resUsername = await addUserToRoom(roomStore, roomId, username, ws);
        console.log(`${resUsername} reconnected to the room`);
        const clients = Object.values(roomStore[roomId].users);
        for (const client of clients) {
            if (client.readyState === ws.OPEN) {
                client.send(JSON.stringify({
                    success: true,
                    roomId: roomId,
                    type: "reconnect",
                    roomname: roomname,
                    msg: "user reconnected successfully"
                }));
            }
        }


    } catch (error) {
        console.error("error while reconnecting to room, check parameters");
    }
}

export {
    createRoomMessage, joinRoomMessage, getUsers, reconnectRoom, getRooms
}
