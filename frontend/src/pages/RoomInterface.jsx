import NavBar from "../components/NavBar";
import { IoMdSend } from "react-icons/io";
import { useWSConnection } from "../contexts/WSContext";
import { useAuth } from "../contexts/AuthContext.jsx"
import { useState, useEffect, useRef } from "react";
import SendMessageBar from "../components/SendMessageBar.jsx";
import MessageDisplay from "../components/MessageDisplay.jsx";
const RoomInterface = () => {
    const [currentMessage, setCurrentMsg] = useState('');
    const [messages, setRoomMessages] = useState([]);
    const { sendMessage, roomData } = useWSConnection();
    const { username } = useAuth();

    const messagesEndRef = useRef(null);
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

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    return (
        <div className="h-screen flex flex-col">
            <header className="w-full flex-shrink-0 bg-blue-600 text-white text-center p-2 text-xl ">
                topbar
            </header>
            <main className="flex flex-1 min-h-0">
                <div className="bg-gray-100 flex-[1]">
                    col 1
                </div>
                <div className="bg-gray-200 flex-[3] flex flex-col min-h-0 border">
                    <div className="overflow-y-auto p-4 flex-1 min-h-0">
                        <MessageDisplay messages={messages} />

                        <div ref={messagesEndRef} />
                    </div>
                    <div className="flex-shrink-0">

                        <SendMessageBar handleSendMessage={handleSendMessage} setMessageValue={setMessageValue} currentMessage={currentMessage} />

                    </div>
                </div>
                <div className="bg-gray-300 flex-[1]">
                    col 3
                </div>
            </main >
        </div >
    )
}

export default RoomInterface;
