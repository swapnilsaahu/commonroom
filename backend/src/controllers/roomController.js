import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/userModelDB.js";
import { z } from "zod";
import { createRoomAPISchema } from "../zodSchema/userZodSSchema.js";
import { v4 as uuidv4 } from 'uuid';
import { startWebSocketServer } from "../websocket/ws-server.js";


let roomStore = {};

const randomId = () => {
    return Math.random().toString(36).substring(2, 10);
}

const checkId = (id, object) => {
    for (const key in obj) {
        if (key === id) {
            return false;
        }
    }
    return true;
};

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
const createRoomAPI = asyncHandler(async (req, res) => {
    //console.log(req.body);
    const receivedUserData = await createRoomAPISchema.safeParseAsync(req.body);
    if (!receivedUserData.success) {
        throw new ApiError(400, "give a proper name");
    }
    console.log(receivedUserData.data);

    const { roomname, typeOfMessage, username } = receivedUserData.data;
    const userUUID = uuidv4();

    console.log("global varibale stores room info", roomStore);
    const roomId = getId(roomStore);
    console.log("new room id: ", roomId);

    /*
    const roomInfo = {
        "roomname": roomname,
        "role": role,
        "username": username,
        "userUUID": userUUID,
        "roomUUID": roomUUID,
        "roomID": roomID
    };
    */
    roomStore = [...roomStore, roomInfo];
    console.log(roomStore)
    return res.status(201).json({
        roomname,
        roomID,
        roomUUID,
        username,
        role,
        userUUID
    }
    );
    //body - roomname,username,limitMembers
    //assign a uuid 
    //return roomdid,role,shareable code 

})

//const joinRoom = asyncHandler(async(req,res)=>{

//})
export {
    createRoomAPI, roomStore
}
