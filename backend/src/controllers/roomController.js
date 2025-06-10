import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Rooms } from "../models/roomsModel.js";


const usersList = asyncHandler(async (req, res) => {
    console.log(req.query, "inside user list api endpoint");
    const { roomId } = req.query;
    const user = await Rooms.findOne({ roomId: roomId }).select('roomId users').populate({
        path: 'users',
        select: 'username -_id'
    });
    const userList = user.users;
    return res.status(200).json(
        new ApiResponse(200, { "users": userList }, "users fetched successfully")
    )

})

export {
    usersList
}
