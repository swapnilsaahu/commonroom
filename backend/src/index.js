
import dotenv from "dotenv"
import http from "http"
import connectDB from "./db/db_index.js";
import { app } from "./app.js";
import { startWebSocketServer } from "./websocket/ws-server.js";
dotenv.config();

const server = http.createServer(app);

connectDB()
    .then(async () => {
        startWebSocketServer(server);
        server.listen(process.env.PORT || 8000, () => {
            console.log(`server is running at ${process.env.PORT}`)
        })
    })
    .catch((error) => {
        console.log("mongoDB connection failed")
    })


