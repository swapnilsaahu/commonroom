import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useWSConnection } from "../contexts/WSContext";
const CreateRoom = () => {
    const [roomname, setroomname] = useState('');
    const [roomCode, setRoomCode] = useState('');
    const { username } = useAuth();
    const { sendMessage, roomData } = useWSConnection();
    const navigate = useNavigate();
    const storeRoomName = (event) => {
        console.log(event.target.value);
        setroomname(event.target.value);
    }
    const sendCreateReq = async () => {
        sendMessage({
            type: "create",
            username: username,
            roomname: roomname
        });
    }
    useEffect(() => {
        if (roomData?.success) {
            navigate('/room');
        }
        if (roomData?.roomId) {
            setRoomCode(roomData.roomId)
        }
    }, [roomData, navigate]);
    return (
        <div>
            <input type="text" name="RoomName" onChange={storeRoomName}></input>
            <button type="button" onClick={sendCreateReq}>Create Room</button>
            <div>Room Code:-</div>
            <div readOnly value={roomCode}></div>
        </div>
    )
}


export default CreateRoom;
