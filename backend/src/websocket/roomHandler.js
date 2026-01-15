import {
    addUserToRoom,
    createOrGetRoom,
    getRoom,
    getUsersInRoom,
} from "../services/roomStore.js";
import { Rooms } from "../models/roomsModel.js"

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
// WebSocket ready states constants
const WEBSOCKET_READY_STATE = {
    CONNECTING: 0,
    OPEN: 1,
    CLOSING: 2,
    CLOSED: 3
};

const createRoom = async (roomStore, roomId, roomname, username) => {
    try {
        const lastActivity = new Date().toISOString();

        if (!roomStore[roomId]) {
            roomStore[roomId] = {
                users: {},
                usercount: 0,
                roomname: roomname,
                lastActivity: lastActivity
            };
        }
        console.log(roomStore);
        const res = await createOrGetRoom(roomId, roomname, lastActivity);
        return res;
    } catch (error) {
        console.error("Error in createRoom:", error);
        throw error;
    }
};

const addUserToRoomInMemory = async (roomStore, roomId, roomname, username, ws) => {
    try {
        // If room doesn't exist, create it
        if (!roomStore[roomId]) {
            await createRoom(roomStore, roomId, roomname, username);
        }

        // Add properties to WebSocket for easier cleanup later
        ws.roomId = roomId;
        ws.username = username;
        ws.roomname = roomname;

        // Check if user is already in the room
        if (roomStore[roomId].users[username]) {
            console.log(`User ${username} already in room ${roomId}, updating connection`);
            // Close the old connection if it exists and is different
            const oldWs = roomStore[roomId].users[username];
            if (oldWs !== ws && oldWs.readyState === WEBSOCKET_READY_STATE.OPEN) {
                oldWs.close(1000, "New connection established");
            }
        }

        // Store WebSocket connection in memory only
        roomStore[roomId].users[username] = ws;
        const userCount = Object.keys(roomStore[roomId].users).length;
        roomStore[roomId].usercount = userCount;
        roomStore[roomId].lastActivity = new Date().toISOString();

        // Only store username and metadata in MongoDB (NOT the WebSocket object)
        const res = await addUserToRoom(roomId, username);

        // Return the username for consistency
        return username;
    } catch (error) {
        console.error("Error in addUserToRoom:", error);
        throw error; // Re-throw to handle in calling function
    }
};
const createRoomMessage = async (ws, data, roomStore) => {
    try {
        const { username, roomname } = data;

        // Validate required parameters
        if (!username || !roomname) {
            ws.close(1008, "Missing required username or roomname parameters");
            return;
        }

        const roomId = getId(roomStore);

        const resRoomId = await createRoom(roomStore, roomId, roomname, username);
        const resUsername = await addUserToRoomInMemory(roomStore, roomId, roomname, username, ws);

        console.log(roomStore);
        console.log(`Creator ${resUsername} created roomID ${resRoomId}`);

        // Send response only if connection is still open
        if (ws.readyState === WEBSOCKET_READY_STATE.OPEN) {
            ws.send(JSON.stringify({
                success: true,
                roomId: roomId,
                type: "created",
                roomname: roomname,
                usercount: roomStore[roomId].usercount,
                msg: "Room created successfully"
            }));
        }
    } catch (error) {
        console.error("Error creating room:", error);
        if (ws.readyState === WEBSOCKET_READY_STATE.OPEN) {
            ws.close(1011, "Internal server error");
        }
    }
};

const joinRoomMessage = async (ws, data, roomStore) => {
    try {
        const { roomId, username } = data;

        // Fix: Use OR (||) instead of AND (&&) for validation
        if (!roomId || !username) {
            ws.close(1008, "Missing required roomId or username parameters");
            return;
        }

        // Check if room exists in memory or database
        let roomExists = false;
        let roomname = null;

        if (roomStore[roomId]) {
            roomExists = true;
            roomname = roomStore[roomId].roomname;
        } else {
            // Check database
            const dbRoom = await getRoom(roomId);
            if (dbRoom) {
                roomExists = true;
                roomname = dbRoom.roomname;
            } else {
                // Also check Rooms model directly as fallback
                const roomExistsInDB = await Rooms.findOne({ roomId: roomId });
                if (roomExistsInDB) {
                    roomExists = true;
                    roomname = roomExistsInDB.roomname;
                }
            }
        }

        if (!roomExists) {
            ws.close(1008, "Room does not exist");
            return;
        }

        const resUsername = await addUserToRoomInMemory(roomStore, roomId, roomname, username, ws);
        if (resUsername) {
            console.log(`${resUsername} joined the room with id: ${roomId}`);
        }

        // Notify all users in the room
        const clients = Object.values(roomStore[roomId].users);
        const joinMessage = JSON.stringify({
            success: true,
            roomId: roomId,
            roomname: roomname,
            type: "joined",
            username: username,
            usercount: roomStore[roomId].usercount,
            msg: "User joined successfully"
        });

        for (const client of clients) {
            // Add null check and use correct constant
            if (client && client.readyState === WEBSOCKET_READY_STATE.OPEN) {
                try {
                    client.send(joinMessage);
                } catch (sendError) {
                    console.error("Error sending message to client:", sendError);
                }
            }
        }
    } catch (error) {
        console.error('Error joining the room:', error);
        if (ws.readyState === WEBSOCKET_READY_STATE.OPEN) {
            ws.close(1011, "Internal server error");
        }
    }
};

const getUsers = async (ws, data) => {
    try {
        const { roomId } = data;

        if (!roomId) {
            if (ws.readyState === WEBSOCKET_READY_STATE.OPEN) {
                ws.send(JSON.stringify({
                    success: false,
                    type: "getUsersInRoom",
                    error: "Missing roomId parameter"
                }));
            }
            return;
        }

        const users = await getUsersInRoom(roomId);

        if (ws.readyState === WEBSOCKET_READY_STATE.OPEN) {
            ws.send(JSON.stringify({
                success: true,
                type: "getUsersInRoom",
                users: users,
                roomId: roomId,
                usercount: users ? users.length : 0
            }));
        }
    } catch (error) {
        console.error("Error while fetching users:", error);
        if (ws.readyState === WEBSOCKET_READY_STATE.OPEN) {
            ws.send(JSON.stringify({
                success: false,
                type: "getUsersInRoom",
                error: "Failed to fetch users"
            }));
        }
    }
};

const reconnectRoom = async (ws, data, roomStore) => {
    try {
        const { username, roomId } = data;

        if (!username || !roomId) {
            console.error("Missing required parameters for reconnection");
            ws.close(1008, "Missing required username or roomId parameters");
            return;
        }

        // Get room info from database
        let roomname = null;
        const dbRoom = await getRoom(roomId);
        if (dbRoom) {
            roomname = dbRoom.roomname;
        } else {
            // Also check Rooms model directly as fallback
            const roomExistsInDB = await Rooms.findOne({ roomId: roomId });
            if (roomExistsInDB) {
                roomname = roomExistsInDB.roomname;
            } else {
                ws.close(1008, "Room does not exist");
                return;
            }
        }

        // Recreate room in memory if needed
        if (!roomStore[roomId]) {
            await createRoom(roomStore, roomId, roomname, username);
        }

        const resUsername = await addUserToRoomInMemory(roomStore, roomId, roomname, username, ws);
        console.log(`${resUsername} reconnected to room ${roomId}`);

        // Notify all users in the room
        const clients = Object.values(roomStore[roomId].users);
        const reconnectMessage = JSON.stringify({
            success: true,
            roomId: roomId,
            type: "reconnect",
            username: username,
            roomname: roomname,
            usercount: roomStore[roomId].usercount,
            msg: `${username} reconnected to the room`
        });

        for (const client of clients) {
            if (client && client.readyState === WEBSOCKET_READY_STATE.OPEN) {
                try {
                    client.send(reconnectMessage);
                } catch (sendError) {
                    console.error("Error sending reconnect message to client:", sendError);
                }
            }
        }

    } catch (error) {
        console.error("Error reconnecting to room:", error);
        if (ws.readyState === WEBSOCKET_READY_STATE.OPEN) {
            ws.close(1011, "Internal server error");
        }
    }
};

export {
    createRoomMessage,
    joinRoomMessage,
    getUsers,
    reconnectRoom,
}; 
