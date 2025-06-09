
import { WebSocketServer } from "ws";
import { createRoomMessage, getUsers, joinRoomMessage, reconnectRoom } from "../websocket/roomHandler.js";
import { getLastNMessagesOnMount, sendRoomMessage } from "../websocket/messageHandler.js";



const roomStore = {};

const handleUnkownError = (ws) => {
    ws.send(JSON.stringify(
        {
            type: 'error',
            message: "not a valid request for websocket"
        }
    ));
}
export const startWebSocketServer = (httpServer) => {
    const wss = new WebSocketServer({ server: httpServer });
    console.log("websocket server running");
    wss.on('connection', (ws) => {
        console.log("recived msg");
        //const { query } = url.parse(req.url, true);
        //const { typeOfMessage } = query;
        const connectionMapping = {
            "create": createRoomMessage,
            "join": joinRoomMessage,
            "sendMessage": sendRoomMessage,
            "onMountMessages": getLastNMessagesOnMount,
            "getUsers": getUsers,
            "reconnect": reconnectRoom
        }
        //console.log("inside connection in ws", req.url);
        ws.on('error', console.error);


        // Handle messages from the user
        ws.on("message", (data) => {
            //createRoomMessage(ws, data, req, rooms)
            try {
                const msg = JSON.parse(data);
                const { type } = msg;
                console.log(type, "on message");
                const handler = connectionMapping[type]
                if (handler) {
                    handler(ws, msg, roomStore);
                }
                else {
                    handleUnkownError(ws);
                }
            }
            catch (error) {
                handleUnkownError(ws);
            }
        });

        ws.send('Hello from WebSocket server!');
    });
};




