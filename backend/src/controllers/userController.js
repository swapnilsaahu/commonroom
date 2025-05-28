import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/userModelDB.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import zod from "zod";
//import { userZodSchema } from "../zodSchema/userZodSSchema.js";
import { signupSchema, loginSchema } from "../zodSchema/userZodSSchema.js";



const createAccessAndRefreshToken = async (userData) => {
    try {
        const accessToken = await userData.generateAccessToken();
        const refreshToken = await userData.generateRefreshToken();
        console.log(accessToken, refreshToken);
        userData.refreshToken = refreshToken;
        await userData.save();
        return { accessToken, refreshToken };
    }
    catch (error) {
        console.error("there was error while creating tokens", error);
        throw new ApiError(500, "couldn't generate tokens");
    }
}



const registerUser = asyncHandler(async (req, res) => {
    console.log("req body format =>", req.body);
    const recivedUserData = await signupSchema.safeParseAsync(req.body);

    console.log(recivedUserData.success, recivedUserData.data);
    if (!recivedUserData.success) {
        console.log(recivedUserData.error);
        throw new ApiError(400, "invalid inputs check your enteries");
    }

    const { username, email, password, firstName, lastName } = recivedUserData.data;
    const userExists = await User.findOne({ username: username });
    const emailExists = await User.findOne({ email: email });
    if (userExists) {
        throw new ApiError(409, "username already exists");
    }
    else if (emailExists) {
        throw new ApiError(409, "email already exists");
    }
    try {
        await User.create({
            username,
            email,
            password,
            firstName,
            lastName
        })
    }
    catch (error) {
        throw new ApiError(500, "error while creating user");
    }

    return res.status(201).json(
        new ApiResponse(201, "user created successfully")
    );
})


const loginUser = asyncHandler(async (req, res) => {
    //parse data
    //check username exists
    //check password is correct or not 
    //generate access token and refresh token store refresh token in db and send back access and refresh token to user cookies
    //roatate referesh token
    console.log(req.body);
    const recivedUserData = await loginSchema.safeParseAsync(req.body);
    console.log(recivedUserData.success, recivedUserData.data);
    //const { success } = recivedUserData.success;
    if (!recivedUserData.success) {
        console.log("error inside success");
        throw new ApiError(400, "invalid inputs");
    }
    const { username, password } = recivedUserData.data;
    const userExists = await User.findOne({ username: username });
    console.log(userExists);
    if (!userExists) {
        console.log("user doesnt exist");
        throw new ApiError(404, "User not found");
    }

    //check password
    const hashPassFromDB = userExists.password;
    console.log(hashPassFromDB);
    const passwordCheck = await bcrypt.compare(password, hashPassFromDB)
    if (!passwordCheck) {
        throw new ApiError(400, "Password is wrong");
    }
    const { accessToken, refreshToken } = await createAccessAndRefreshToken(userExists);

    return res
        .status(200)
        .cookie("accessToken", accessToken, { httpOnly: true, secure: false, sameSite: 'Lax' })
        .cookie("refreshToken", refreshToken, { httpOnly: true, secure: false, sameSite: 'Lax' })
        .json(
            new ApiResponse(200, {
                "refreshToken": refreshToken,
                "accessToken": accessToken
            }, "user logged in")
        )
})
export {
    registerUser,
    loginUser
}
