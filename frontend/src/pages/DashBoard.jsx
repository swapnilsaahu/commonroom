import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useWSConnection } from "../contexts/WSContext";
const DashBoard = () => {
    const navigate = useNavigate();
    const { connectToWs } = useWSConnection();
    const { username } = useAuth();
    const createRoomHandle = async () => {
        navigate('/createroom');
    }
    return (
        <div className="h-screen bg-black text-white" >

            <h1>hello welcome to dashboard</h1>
            <div className="flex text-black flex-col items-center justify-center gap-2">
                <h1 className="bg-white">username:{username}</h1>
                <button type="button" className="bg-white text-2xl p-2 " onClick={createRoomHandle}>Create Server</button>
                <button type="button" className="bg-white text-2xl p-3">Join server</button>
            </div>
        </div >
    )
}
export default DashBoard;
