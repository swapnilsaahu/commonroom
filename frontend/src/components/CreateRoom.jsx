import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useWSConnection } from "../contexts/WSContext";
import AfterAuthNavBar from "./AfterAuthNavBar";
const CreateRoom = () => {
    const [roomname, setroomname] = useState('');
    const [roomCode, setRoomCode] = useState('');
    const { username } = useAuth();
    const { sendMessage, roomData, clearRoom } = useWSConnection();
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

    useEffect(() => {
        clearRoom();
    }, [])
    return (
        <section>
            <AfterAuthNavBar />
            <div className="flex flex-col justify-center items-center mt-10">
                <input type="text" name="RoomName" onChange={storeRoomName} className="bg-gray-100 p-5 m-3 rounded border"></input>
                <button type="button" onClick={sendCreateReq} className="bg-black text-white p-4 m-4 hover:bg-gray-500">Create Room</button>
            </div>
        </section>
    )
}


export default CreateRoom;
