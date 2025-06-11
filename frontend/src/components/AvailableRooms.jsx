import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useWSConnection } from "../contexts/WSContext";
import { useEffect } from "react";
const AvailableRooms = () => {
    const navigate = useNavigate();
    const { username, roomsFromDB, rooms } = useAuth();
    const { roomData, setroomData } = useWSConnection();
    const handleClick = async (room) => {
        setroomData(room);
        sessionStorage.setItem('roomData', JSON.stringify(room));
        navigate('/room');
    }
    useEffect(() => {
        if (username) {
            roomsFromDB(username);
        }
    }, [username])

    return (
        <div>
            <h3 className="font-bold text-3xl p-2 ml-4">Available Rooms:</h3>
            <div>
                {rooms.map((room, index) => (
                    <div key={index} onClick={() => handleClick(room)} className="">
                        <div className="w-full text-white bg-black m-3 px-6 py-2 rounded-2xl cursor-pointer transform transition duration-300 hover:-translate-y-1 hover:shadow-lg ">
                            <div className="font-bold text-2xl">
                                {room.roomname}
                            </div>
                        </div>
                    </div>

                ))}
            </div>
        </div>
    )
}

export default AvailableRooms;
