
import url from "url"
import { WebSocketServer } from "ws";
import { createRoomMessage, joinRoomMessage } from "../controllers/messageController.js";



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
            //"broadcastMessage": broadcastMessage
        }
        //console.log("inside connection in ws", req.url);
        ws.on('error', console.error);


        // Handle messages from the user
        ws.on("message", (data) => {
            //createRoomMessage(ws, data, req, rooms)
            const msg = JSON.parse(data);
            const { type } = msg;

            console.log(type);
            connectionMapping[type]?.(ws, msg, roomStore) || handleUnkownError(ws)
        });

        ws.send('Hello from WebSocket server!');
    });
};




