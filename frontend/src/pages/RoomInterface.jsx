import { useWSConnection } from "../contexts/WSContext";
import { useAuth } from "../contexts/AuthContext.jsx"
import { useState, useEffect, useRef } from "react";
import SendMessageBar from "../components/SendMessageBar.jsx";
import MessageDisplay from "../components/MessageDisplay.jsx";
import UserList from "../components/UserList.jsx";
import LeftRoomDetailComponent from "../components/LeftRoomDetailComponent.jsx"
import AfterAuthNavBar from "../components/AfterAuthNavBar.jsx";


const RoomInterface = () => {
    const [currentMessage, setCurrentMsg] = useState('');
    const { sendMessage, roomData, messages } = useWSConnection();
    const [lastSeenTimestamp, setLastSeenTimestamp] = useState('');
    const { username } = useAuth();
    const calledRef = useRef(false); //using useref to avoid duplication in meesages on mount because react on strict mode runs twice a component to check whether it is a pure fx or ont which means that on same input it should provide same output 
    const messagesEndRef = useRef(null);
    const containerRef = useRef(null);
    const previousScrollHeightRef = useRef(0);


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
            timestamp: Date.now(),
            id: Date.now()
        }

        sendMessage(msgObject);
        setCurrentMsg('');
    }
    const getMessagesOnMount = () => {
        const msgObject = {
            type: "onMountMessages",
            roomId: roomData.roomId,
            username: username,
        }
        sendMessage(msgObject);
    }

    const getOlderMessages = () => {
        const msgObject = {
            type: "getOlderMessages",
            roomId: roomData.roomId,
        }
        sendMessage(msgObject);
    }
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        scrollToBottom();

    }, [messages]);

    useEffect(() => {
        if (calledRef.current) return;
        calledRef.current = true;

        getMessagesOnMount();
    }, []);
    //initially the calledRef is set to false so the getMessagesOnMount runs for first time and sets calledRef to true so that it avoids rerunning on second render useref doesnt rerender on change or update

    return (
        <div className="h-screen flex flex-col">
            <header className="w-full flex-shrink-0 bg-black text-white text-center p-2 text-l ">
                <AfterAuthNavBar />
            </header>
            <main className="flex flex-1 min-h-0">
                <div className="bg-black text-blue-400 font-bold  flex-[1] text-center border">
                    <LeftRoomDetailComponent />
                </div>
                <div className="bg-gray-200 flex-[3] flex flex-col min-h-0">
                    <div className="overflow-y-auto p-4 flex-1 min-h-0 bg-gradient-to-b from-gray-900 to-gray-950">
                        <MessageDisplay messages={messages} />

                        <div ref={messagesEndRef} />
                    </div>
                    <div className="flex-shrink-0">

                        <SendMessageBar handleSendMessage={handleSendMessage} setMessageValue={setMessageValue} currentMessage={currentMessage} />

                    </div>
                </div>
                <div className="bg-black text-white flex-[1] text-center border">
                    <UserList roomId={roomData.roomId} />
                </div>
            </main >
        </div >
    )
}

export default RoomInterface;
