import { useEffect, useRef } from "react";
import { useWSConnection } from "../contexts/WSContext.jsx";
const UserList = ({ roomId }) => {
    const { sendMessage, users } = useWSConnection();
    const calledRef = useRef(false);
    const getUsers = () => {
        const msgObject = {
            type: "getUsers",
            roomId: roomId
        }
        sendMessage(msgObject);
    }
    useEffect(() => {
        if (calledRef.current) return;
        calledRef.current = true;
        getUsers();
    }, []);
    return (
        <div className="w-1/5 p-4 border-l border-[#1E3A8A]">
            <h2 className="text-lg font-bold text-[#3B82F6] mb-4">Users:</h2>
            <div className="space-y-2">
                {users.map((user, index) => (
                    <div key={index} className="bg-[#1E3A8A] text-white py-2 px-3 rounded-xl text-center font-medium hover:bg-blue-700 transition">
                        {user}
                    </div>
                ))}
            </div>
        </div>

    )
}

export default UserList;
