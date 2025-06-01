import NavBar from "../components/NavBar";
import { IoMdSend } from "react-icons/io";
import { useWSConnection } from "../contexts/WSContext";
import { useAuth } from "../contexts/AuthContext.jsx"
import { useState } from "react";
import SendMessageBar from "../components/SendMessageBar.jsx";
import MessageDisplay from "../components/MessageDisplay.jsx";
const RoomInterface = () => {
    const [currentMessage, setCurrentMsg] = useState('');
    const [messages, setRoomMessages] = useState([]);
    const { sendMessage, roomData } = useWSConnection();
    const { username } = useAuth();
    const setMessageValue = (value) => {
        setCurrentMsg(value);
    }
    const handleSendMessage = () => {
        const msgObject = {
            type: "sendMessage",
            roomId: roomData.roomId,
            username: username,
            message: currentMessage,
            roomname: roomData.roomname,
            timestamp: + new Date(),
            id: Date.now()
        }

        setRoomMessages(prevMessages => [
            ...prevMessages, msgObject
        ]);
        sendMessage(msgObject);
        console.log(messages);
        setCurrentMsg('');
    }
    return (
        <div className="h-screen overflow-hidden flex flex-col">
            <header className="w-full bg-blue-600 text-white text-center p-2 text-xl ">
                topbar
            </header>
            <main className="flex flex-1">
                <div className="bg-gray-100 flex-[1]">
                    col 1
                </div>
                <div className="bg-gray-200 flex-[3] flex flex-col relative border">
                    col 2
                    <div className="overflow-y-auto flex-1">
                        <MessageDisplay messages={messages} />
                    </div>
                    <SendMessageBar handleSendMessage={handleSendMessage} setMessageValue={setMessageValue} currentMessage={currentMessage} />

                </div>
                <div className="bg-gray-300 flex-[1]">
                    col 3
                </div>
            </main>
        </div>
    )
}

export default RoomInterface;
