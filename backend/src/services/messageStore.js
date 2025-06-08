
import { getClient } from "../db/client.js";
import { getRoomKey } from "./roomStore.js";
import { Message } from "../models/messageModel.js";

const addMessage = async (roomId, message) => {
    const client = getClient();
    const messageListKey = `${getRoomKey(roomId)}:messages`;
    const unsavedMessageListKey = `${getRoomKey(roomId)}:unsaved_messages`;

    // add message to the start of the list
    await client.rPush(messageListKey, JSON.stringify(message));
    await client.rPush(unsavedMessageListKey, JSON.stringify(message));
    const lengthOfUnsavedMessages = await client.lLen(unsavedMessageListKey);
    if (lengthOfUnsavedMessages > 4) {
        await batchStoreMessageDB(roomId);

    }
    // trim the list to only the last 20 messages
    await client.lTrim(messageListKey, -20, -1); // Keeps only first 20 items (most recent)

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
    const unsavedMessagesListKey = `${getRoomKey(roomId)}:unsaved_messages`;
    const processingKey = `${getRoomKey(roomId)}:processing_messages`;

    let totalProcessed = 0;

    while (true) {
        const batch = [];

        // Move up to 20 messages from unsaved to processing
        for (let i = 0; i < 20; i++) {
            const message = await client.rPopLPush(unsavedMessagesListKey, processingKey);
            if (!message) break;
            batch.push(JSON.parse(message));
        }

        // No more messages to process
        if (batch.length === 0) {
            console.log(`Finished processing. Total messages saved: ${totalProcessed}`);
            break;
        }

        try {
            const savedMessages = await Message.insertMany(batch);
            console.log(`Saved batch of ${savedMessages.length} messages`);
            totalProcessed += savedMessages.length;

            // Clear processing key after successful save
            await client.del(processingKey);
            await client.del(unsavedMessagesListKey);

        } catch (error) {
            console.error("Failed to save batch:", error);
        }
    }
};

export {
    addMessage,
    getLastNMessages,
    batchStoreMessageDB
}
