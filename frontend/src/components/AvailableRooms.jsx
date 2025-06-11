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
        <div className="px-4">
            <h3 className="font-bold text-3xl mb-6 text-gray-800">Available Rooms</h3>

            {rooms.length === 0 ? (
                <div className="text-center text-gray-500 text-lg">
                    No rooms available. Try creating one!
                </div>
            ) : (
                <div className="space-y-4">
                    {rooms.map((room, index) => (
                        <div
                            key={index}
                            onClick={() => handleClick(room)}
                            className="bg-black text-white px-6 py-4 rounded-2xl cursor-pointer hover:bg-gray-800 hover:shadow-xl transition transform hover:-translate-y-1"
                        >
                            <div className="font-semibold text-xl">
                                {room?.roomname || "Unnamed Room"}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default AvailableRooms;
