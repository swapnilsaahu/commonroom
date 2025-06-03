import { addMessage, getLastNMessages, batchStoreMessageDB } from "../services/messageStore.js";
const sendRoomMessage = async (ws, data, roomStore) => {
    const { message, roomId, username, timestamp, id } = data;
    const result = await addMessage(roomId, data);
    if (result) console.log("message added successfully");

    console.log("inside sendRoomMessage");
    const clients = Object.values(roomStore[roomId].users);

    console.log({
        success: true,
        roomId: roomId,
        message: message,
        type: "onmessage",
        msg: "message sent successfully",
        roomId: roomId,
        username: username,
        timestamp: timestamp,
        id: id
    })
    for (const client of clients) {
        if (client.readyState === ws.OPEN) {
            client.send(JSON.stringify({
                success: true,
                roomId: roomId,
                message: message,
                type: "onmessage",
                msg: "message sent successfully",
                roomId: roomId,
                username: username,
                timestamp: timestamp,
                id: id
            }));
        }
    }
}

export { sendRoomMessage };
