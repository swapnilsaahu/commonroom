import { addUserToRoomRedis, createOrGetRoomRedis, getRoom, getUsersInRoom } from "../services/roomStore.js";

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
const createRoom = async (roomStore, roomId, roomname) => {

    const createdAt = new Date().toISOString();
    roomStore[roomId] = {
        users: {},
        usercount: 0,
        roomname: roomname,
        createdAt: createdAt
    }
    console.log(roomStore);
    const res = await createOrGetRoomRedis(roomId, roomname, createdAt);
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
        ws.close(1008, "Missing required query parameters."); //1008 because it recived wrong inputs policy violations and closes the ws
        return;
    }
    const roomId = getId(roomStore); //random unique
    try {
        const resRoomId = await createRoom(roomStore, roomId, roomname);
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
        ws.close(1008, "Room does not exist");
        return;
    }
    if (!roomStore[roomId]) {
        roomStore[roomId] = {
            users: {},
            usercount: 0,
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


export {
    createRoomMessage, joinRoomMessage, getUsers
}
