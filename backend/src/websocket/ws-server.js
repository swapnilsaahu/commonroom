
import { WebSocketServer } from "ws";
import { createRoomMessage, joinRoomMessage, sendRoomMessage } from "../websocket/roomHandler.js";



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
            "sendMessage": sendRoomMessage
        }
        //console.log("inside connection in ws", req.url);
        ws.on('error', console.error);


        // Handle messages from the user
        ws.on("message", (data) => {
            //createRoomMessage(ws, data, req, rooms)
            try {
                const msg = JSON.parse(data);
                const { type } = msg;
                console.log(type);
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




