import { useEffect, useState } from "react";

import { useAuth } from "../contexts/AuthContext";
import { useWSConnection } from "../contexts/WSContext";
import { useNavigate } from "react-router-dom";
const JoinRoom = () => {
    const { username } = useAuth();
    const { sendMessage, roomData } = useWSConnection();

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
    return (
        <div>
            <input type="text" name="" onChange={(e) => setRoomId(e.target.value)} value={roomId} className=" border bg-gray-50" />
            <button type="button" onClick={joinRoomMessage} className="bg-white text-black">join room</button>
        </div>
    )
}

export default JoinRoom;
