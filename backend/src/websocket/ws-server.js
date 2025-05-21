
import url from "url"
import { WebSocketServer } from "ws";
import express from "express";
import cors from "cors";
import { createRoomMessage } from "../controllers/messageController.js";

const app = express();
app.use(cors());
const httpServer = app.listen(5000, () => {
    console.log("httpServer running on port 5000");
});

const rooms = {};

const wss = new WebSocketServer({ server: httpServer });

const handlUnkownError = (ws) => {
    ws.send(JSON.stringify(
        {
            type: 'error',
            message: "not a valid request for websocket"
        }
    ));
}



wss.on('connection', (ws, req) => {

    const { query } = url.parse(req.url, true);
    const { typeOfMessage } = query;
    const connectionMapping = {
        "create": createRoomMessage,
        "join": joinRoomMessage,
        "broadcastMessage": broadcastMessage
    }
    console.log("inside connection in ws", req.url);
    ws.on('error', console.error);


    // Handle messages from the user
    ws.on("message", (data) => {
        connectionMapping[typeOfMessage]?.(ws, data, req, rooms) || handlUnkownError(ws)
        //createRoomMessage(ws, data, req, rooms)
    });

    ws.send('Hello from WebSocket server!');
});




