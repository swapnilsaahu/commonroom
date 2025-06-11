import { useEffect, useRef } from "react";
import { useWSConnection } from "../contexts/WSContext.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";

const UserList = ({ roomId }) => {
    const { sendMessage, roomData } = useWSConnection();
    const { users, usersInARoomDB } = useAuth();
    const calledRef = useRef(false);

    useEffect(() => {
        if (calledRef.current) return;
        calledRef.current = true;
        usersInARoomDB(roomData?.roomId);
    }, []);
    return (
        <div className="w-1/5 p-4 border-l">
            <h2 className="text-lg font-bold text-black mb-4">Users:</h2>
            <div className="space-y-2">
                {users.map((user, index) => (
                    <div key={index} className="text-black py-2 px-3 rounded-l text-center font-medium">
                        {user.username}
                    </div>
                ))}
            </div>
        </div>

    )
}

export default UserList;
