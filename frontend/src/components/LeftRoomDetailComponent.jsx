import { useWSConnection } from "../contexts/WSContext.jsx";
const LeftRoomDetailComponent = () => {
    const { roomData } = useWSConnection();
    return (
        <div className="w-1/5 p-4  border-[#1E3A8A] text-[#3B82F6]">
            <h2 className="text-lg font-bold mb-2">Roomname:</h2>
            <p className="text-white font-medium mb-4">{roomData.roomname}</p>
            <h2 className="text-lg font-bold mb-2">Roomcode:</h2>
            <p className="text-white font-mono">{roomData.roomId}</p>
        </div>
    )
}

export default LeftRoomDetailComponent;
