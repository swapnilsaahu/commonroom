import url from "url";

const randomId = () => {
    return Math.random().toString(36).substring(2, 10);
}

const checkId = (id, object) => {
    for (const key in object) {
        if (key === id) {
            return false;
        }
    }
    return true;
};

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

const addUsersToRoom = (roomStore, roomId, username, ws, roomname = 'default') => {
    roomStore[roomId] = roomStore[roomId] || {
        users: { users: {}, count: 0 },
        roomname: roomname,
        messages: [],
        createdAt: new Date()
    };
    /*   
    roomStore = {
       "room123": {
           users: {
               users: {
                   "swapnil": WebSocketConnection1,
                   "john": WebSocketConnection2
               },
               count: 2
           },
           messages: [],
           createdAt: 2025-05-22T10:30:00.000Z
       }
   }
   
   */
    // Add user
    roomStore[roomId].users.users[username] = ws;
    roomStore[roomId].users.count = Object.keys(roomStore[roomId].users.users).length;
}

const createRoomMessage = (ws, data, roomStore) => {
    //const { query } = url.parse(req.url, true);
    //const { username } = query;
    const { username, roomname } = data;
    if (!username) {
        ws.close(1008, "Missing required query parameters."); //1008 because it recived wrong inputs policy violations and closes the ws
        return;
    }
    //const { roomname } = query;
    //console.log("typeOfMessage", typeOfMessage);
    const roomId = getId(roomStore);

    addUsersToRoom(roomStore, roomId, username, ws, roomname);
    // Save user's websocket connection
    roomStore[roomId].users.users[username] = ws;
    console.log(roomStore);
    console.log(`Creator ${username} created roomID ${roomId}`);
    //below gets all the connected clients to the websocket server 
    const clients = Object.values(roomStore[roomId].users.users);
    for (const client of clients) {
        if (client.readyState === ws.OPEN) {
            client.send(`${username},created the room. ${roomId}: roomId`);
        }
    }
}

const joinRoomMessage = (ws, data, roomStore) => {

    //const { query } = url.parse(req.url, true);
    const { roomId, username } = data;
    if (!roomId && !username) {
        ws.close(1008, "please provide proper details");
        return;
    };

    addUsersToRoom(roomStore, roomId, username, ws);

    roomStore[roomId].users.users[username] = ws;
    console.log(roomStore);
    console.log(`user ${username} joined roomID ${roomId}`);
    //below gets all the connected clients to the websocket server 
    const clients = Object.values(roomStore[roomId].users.users);
    for (const client of clients) {
        if (client.readyState === ws.OPEN) {
            client.send(`${username},joined the room. ${roomId}: roomId`);
        }
    }
}
export {
    createRoomMessage, joinRoomMessage
}
