import { addMessage, getLastNMessages, batchStoreMessageDB } from "../services/messageStore.js";
const sendRoomMessage = async (ws, data, roomStore) => {
    const { message, roomId, username, timestamp, id } = data;
    const result = await addMessage(roomId, data);
    if (result) console.log("message added successfully");

    if (!roomStore[roomId]) roomStore[roomId] = { users: {} };
    roomStore[roomId].users[username] = ws;

    console.log("inside sendRoomMessage");
    const clients = Object.values(roomStore[roomId].users);
    //console.log("why the hell this is not defined", clients);

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

const getLastNMessagesOnMount = async (ws, data) => {
    const { roomId, username } = data;
    const result = await getLastNMessages(roomId);
    if (ws.readyState === ws.OPEN) {
        ws.send(JSON.stringify({
            success: true,
            message: result,
            type: "onMountMessages",
            msg: "messages retrieved on mount successfully",
            roomId: roomId,
            username: username
        }))
    }
}

const getOlderMessages = async (ws, data) => {
    try {
        const { roomId, lastTimestampBeforeOldMessages } = data;
        const query = lastTimestampBeforeOldMessages ? { timestamp: { $lt: lastTimestampBeforeOldMessages } } : {};

        const olderMessages = await Message.find(query)
            .sort({ timestamp: -1 })
            .limit(20)

        olderMessages.reverse();

        if (ws.readyState === ws.OPEN) {
            ws.send(JSON.stringify({
                roomId: roomId,
                messages: olderMessages,
                type: "olderMessages",
                msg: "retrieved sucessfully",
                success: true
            }))
        }
    }
    catch (error) {
        console.error("error while retreiving messages", error);
    }
}
export { sendRoomMessage, getLastNMessagesOnMount, getOlderMessages };
