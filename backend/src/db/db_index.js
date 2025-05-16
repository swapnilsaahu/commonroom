
import dotenv from "dotenv"
import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";
dotenv.config();
const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n mongodb connected`)
    } catch (error) {
        console.log("error while connecting to db", error);
        process.exit(1);
    }
}
export default connectDB;
