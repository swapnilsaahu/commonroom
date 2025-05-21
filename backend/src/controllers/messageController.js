import url from "url";
import { WebSocketServer } from "ws";




const createRoomMessage = (ws, data, req, rooms) => {
    const { query } = url.parse(req.url, true);
    const { roomUUID, roomID, username } = query;
    console.log(roomUUID);
    if (!roomUUID || !roomID || !username) {
        ws.close(1008, "Missing required query parameters."); //1008 because it recived wrong inputs policy violations and closes the ws
        return;
    }
    /* 
        rooms = {
        roomUUID: {
            roomID: {
            Alice: WebSocketConnectionObject,
            Bob: WebSocketConnectionObject
            }
        }
        };
    */
    //add new room to the rooms data Object
    if (!rooms[roomUUID]) rooms[roomUUID] = {};
    // Save user's websocket connection
    rooms[roomUUID][roomID][username] = ws;
    console.log(rooms);
    console.log(`Creator ${username} created roomID ${roomID} in roomUUID ${roomUUID}`);
    //below gets all the connected clients to the websocket server 
    const clients = Object.values(rooms[roomUUID][roomID]);
    for (const client of clients) {
        if (client.readyState === ws.OPEN) {
            client.send(`${username},created the room. Message from creator: ${data}`);
        }
    }
}

const joinRoomMessage = (ws, data, req, rooms) => {
    const { query } = url.parse(req.url, true);
    const { roomUUID, roomID, username } = query;
    if (!rooms[roomUUID]) { };
}

export {
    createRoomMessage
}
