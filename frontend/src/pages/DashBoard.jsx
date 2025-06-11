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
            <div className="min-h-screen bg-gray-50 text-black py-20 px-4 flex items-center justify-center">
                <div className="w-full max-w-md space-y-8 text-center">

                    <h1 className="text-3xl font-bold text-gray-800">Welcome to CommonRoom</h1>

                    <div className="bg-white shadow-lg rounded-2xl p-8 space-y-4">
                        <button
                            type="button"
                            className="w-full bg-black text-white text-xl py-3 rounded-lg hover:bg-gray-800 transition duration-300"
                            onClick={createRoomHandle}
                        >
                            Create Server
                        </button>

                        <button
                            type="button"
                            onClick={joinRoomHandle}
                            className="w-full bg-black text-white text-xl py-3 rounded-lg hover:bg-gray-800 transition duration-300"
                        >
                            Join Server
                        </button>
                    </div>

                    <div className="mt-6">
                        <AvailableRooms />
                    </div>
                </div>
            </div>
        </section>
    )
}
export default DashBoard;
