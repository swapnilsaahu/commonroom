import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
const app = express();

app.use(
    cors({
        origin: true, // Allow all origins
        credentials: true, // Allow cookies/auth headers
    })
);
app.use(bodyParser.json());
app.use(express.json()); //can use limit to limit the filesize for the recivable from user
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());


//routes import
import userRouter from "./routes/userRoutes.js"
import roomRouter from "./routes/roomRoutes.js";

//routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/room", roomRouter);

export { app };
