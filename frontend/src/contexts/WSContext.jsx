import { useState, useEffect } from "react";
import { createContext } from "react";
import { useContext } from "react";

export const wsContext = createContext();

export const useWSConnection = () => {
    const context = useContext(wsContext);
    if (!context) {
        throw new Error("not allowed to use ws context");
    }
    return context;
}

export const WSContextProvider = ({ children }) => {
    const [wsConnectionObject, setWSConnectionObject] = useState();
    const [roomData, setroomData] = useState();
    const [messages, setRoomMessages] = useState([]);


    useEffect(() => {
        const ws = new WebSocket(import.meta.env.VITE_WEBSOCKET_URL);
        setWSConnectionObject(ws);

        ws.onopen = () => {
            console.log("WebSocket Connected");
        }

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log("WebSocket message received:", data);
                const { type } = data;

                switch (type) {
                    case 'created':
                        setroomData(data);
                        sessionStorage.setItem('roomData', JSON.stringify(data));
                        break;
                    case 'joined': {
                        setroomData(data);
                        sessionStorage.setItem('roomData', JSON.stringify(data));
                        break;
                    }
                    case 'onmessage':
                        setRoomMessages((prevMessages) => [...prevMessages, data]);
                        break;
                    case 'onMountMessages':
                        if (data.message && Array.isArray(data.message)) {
                            setRoomMessages(data.message);
                        }
                        break;
                    case 'olderMessages':
                        if (data.messages && Array.isArray(data.messages)) {
                            setRoomMessages((prevMessages) => [...data.messages, ...prevMessages]);
                        }
                        break;
                    case 'reconnect':
                        setroomData(data);
                        sessionStorage.setItem('roomData', JSON.stringify(data));
                        break;
                    case 'getUsersInRoom':
                        // Handle user list updates if needed
                        break;
                    default:
                        setroomData(data);
                }
            } catch (error) {
                console.error("Error parsing WebSocket message:", error);
            }
        }

        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        ws.onclose = (event) => {
            console.log("WebSocket closed:", event.code, event.reason);
        }

        // Cleanup function to close WebSocket on unmount
        return () => {
            if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
                ws.close();
            }
        };
    }, []);

    const sendMessage = (msg) => {
        if (wsConnectionObject?.readyState === WebSocket.OPEN) {
            wsConnectionObject.send(JSON.stringify(msg));
        }
    }

    const clearRoom = () => {
        setroomData({
            roomId: '',
            roomname: '',
        });
        sessionStorage.removeItem("roomData");
    }
    const value = {
        wsConnectionObject,
        sendMessage,
        roomData,
        messages,
        clearRoom,
        setroomData,
    }
    return (
        <wsContext.Provider value={value}>
            {children}
        </wsContext.Provider>
    )
}
