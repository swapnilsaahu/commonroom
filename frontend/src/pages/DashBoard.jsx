import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useWSConnection } from "../contexts/WSContext";
import AfterAuthNavBar from "../components/AfterAuthNavBar.jsx";
import { useEffect } from "react";
import AvailableRooms from "../components/AvailableRooms.jsx";
const DashBoard = () => {
    const navigate = useNavigate();
    const { username, roomsFromDB, rooms } = useAuth();
    const { clearRoom } = useWSConnection();
    const createRoomHandle = async () => {
        navigate('/createroom');
    }
    const joinRoomHandle = async () => {
        navigate('/joinroom');
    }

    useEffect(() => {
        clearRoom();
    }, [])
    return (
        <section>
            <AfterAuthNavBar />
            <div className="h-screen bg-gray-50 text-black py-20" >

                <div className="flex text-black flex-col items-center justify-center gap-2">
                    <div className="text-white rounded-2xl">
                        <button type="button" className="bg-black text-2xl p-4 m-4 hover:bg-gray-600 " onClick={createRoomHandle}>Create Server</button>
                        <button type="button" onClick={joinRoomHandle} className="bg-black text-2xl m-4 p-4 hover:bg-gray-600">Join server</button>
                    </div>
                    <div>
                        <AvailableRooms />
                    </div>
                </div>
            </div >
        </section>
    )
}
export default DashBoard;
