
import { getClient } from "../db/client.js";
import { getRoomKey } from "./roomStore.js";
import { Message } from "../models/messageModel.js";

const addMessage = async (roomId, message) => {
    const client = getClient();
    const messageListKey = `${getRoomKey(roomId)}:messages`;
    const unsavedMessageListKey = `${getRoomKey(roomId)}:unsaved_messages`;

    // add message to the start of the list
    await client.lPush(messageListKey, JSON.stringify(message));
    await client.lPush(unsavedMessageListKey, JSON.stringify(message));
    // trim the list to only the last 20 messages
    await client.lTrim(messageListKey, 0, 19); // Keeps only first 20 items (most recent)

    return message;
};


const getLastNMessages = async (roomId) => {
    const client = getClient();
    const messageListKey = `${getRoomKey(roomId)}:messages`;

    const messages = await client.lRange(messageListKey, 0, -1); // Get all messages
    return messages.map(msg => JSON.parse(msg)); // Parse each stringified message
};

const batchStoreMessageDB = async (roomId) => {
    const client = getClient();
    const unsaved_messagesListKey = `${getRoomKey(roomId)}:unsaved_messages`;
    const processingKey = `${getRoomKey(roomId)}: processing_messages`;
    // add message to the start of the list
    const batch = [];

    for (let i = 0; i < 20; i++) {
        const message = await client.rPopLPush(unsaved_messagesListKey, processingKey);
        if (!message) break;
        batch.push(JSON.parse(message));
    }
    try {
        const batchSuccess = await Message.insertMany(batch);
        if (batchSuccess) {
            console.log("saved to db successfully");
        }
        else {
            console.error("error while saving the data to db");
        }
        await client.del(processingKey);
    }
    catch (error) {
        console.error("failed to save to db");
    }
}

export {
    addMessage,
    getLastNMessages,
    batchStoreMessageDB
}
