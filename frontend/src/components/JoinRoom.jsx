import { useEffect, useState } from "react";

import { useAuth } from "../contexts/AuthContext";
import { useWSConnection } from "../contexts/WSContext";
import { useNavigate } from "react-router-dom";
import AfterAuthNavBar from "./AfterAuthNavBar";
const JoinRoom = () => {
    const { username } = useAuth();
    const { sendMessage, roomData, clearRoom } = useWSConnection();

    const [roomId, setRoomId] = useState('');
    const navigate = useNavigate();
    const joinRoomMessage = async () => {
        sendMessage({
            username: username,
            roomId: roomId,
            type: "join"
        })
    }

    useEffect(() => {
        if (roomData?.success) {
            navigate('/room');
        }
    }, [roomData, navigate]);

    useEffect(() => {
        clearRoom();
    }, [])
    return (
        <section>
            <AfterAuthNavBar />
            <div className="flex flex-col justify-center items-center mt-10">
                <input type="text" name="" onChange={(e) => setRoomId(e.target.value)} value={roomId} className="rounded border bg-gray-50 p-5" />
                <button type="button" onClick={joinRoomMessage} className="bg-black text-white p-5 m-5 hover:bg-gray-500">join room</button>
            </div>
        </section>
    )
}

export default JoinRoom;
