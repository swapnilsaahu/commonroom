
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
    const { sendMessage, roomData, messages, setroomData } = useWSConnection();
    const { username, setUsername } = useAuth();
    const calledRef = useRef(false);
    const messagesEndRef = useRef(null);

    const setMessageValue = (value) => {
        setCurrentMsg(value);
    }

    const handleSendMessage = () => {
        if (!roomData?.roomId || !username || !currentMessage.trim()) {
            console.warn('Cannot send message: missing required data');
            return;
        }

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

    const getMessagesOnMount = async () => {
        if (!roomData?.roomId || !username) {
            console.warn('Cannot get messages, missing roomId or username');
            return;
        }

        const msgObject = {
            type: "onMountMessages",
            roomId: roomData.roomId,
            username: username,
        }
        sendMessage(msgObject);
    }

    const handleReconnect = () => {
        try {
            const storedRoomDataStr = sessionStorage.getItem("roomData");
            const storedUsername = sessionStorage.getItem("username");

            if (storedRoomDataStr && storedUsername) {
                const storedRoomData = JSON.parse(storedRoomDataStr);
                setroomData(storedRoomData);
                setUsername(storedUsername);
            } else {
                console.warn('No stored data found in sessionStorage');
            }
        } catch (error) {
            console.error('Error in handleReconnect:', error);
        }
    }

    const getOlderMessages = () => {
        if (!roomData?.roomId) {
            console.warn('Cannot get older messages: no roomId available');
            return;
        }

        const msgObject = {
            type: "getOlderMessages",
            roomId: roomData.roomId,
        }
        sendMessage(msgObject);
    }

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    // Scroll to bottom when a message arrives or is sent
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // reconnect logic for refresh 
    useEffect(() => {
        if (calledRef.current) return;
        calledRef.current = true;
        handleReconnect();
    }, []);

    //roomData changes and fetch messages when available
    useEffect(() => {
        if (roomData?.roomId && username) {
            getMessagesOnMount();
        }
    }, [roomData?.roomId, username]);

    return (
        <div className="h-screen flex flex-col">
            <header className="w-full flex-shrink-0 text-white text-center text-l ">
                <AfterAuthNavBar />
            </header>
            <main className="flex flex-1 min-h-0">
                <div className="bg-gray-50 text-black font-bold flex-[1] text-center">
                    <LeftRoomDetailComponent roomData={roomData} />
                </div>
                <div className="bg-gray-200 flex-[3] flex flex-col min-h-0">
                    <div className="overflow-y-auto p-4 flex-1 min-h-0 bg-gradient-to-b ">
                        <MessageDisplay messages={messages} />
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="flex-shrink-0">
                        <SendMessageBar
                            handleSendMessage={handleSendMessage}
                            setMessageValue={setMessageValue}
                            currentMessage={currentMessage}
                        />
                    </div>
                </div>
                <div className="bg-gray-50 text-black flex-[1] text-center ">
                    <UserList roomId={roomData?.roomId} />
                </div>
            </main >
        </div >
    )
}

export default RoomInterface;
//                    <UserList roomId={roomData?.roomId} />

