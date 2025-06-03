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

        const ws = new WebSocket('ws://localhost:3000');

        ws.onopen = () => {
            console.log("Connected");
            console.log(ws);
        }
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log(data);
            const { type } = data;
            console.log(type);
            switch (type) {
                case 'created':
                    setroomData(data);
                    break;
                case 'joined':
                    setroomData(data);
                    break;
                case 'onmessage':
                    setRoomMessages((prevMessages) => [...prevMessages, data]);
                    break;
                default:
                    setroomData(data);
            }
        }

        ws.onerror = (error) => {
            console.error("Error connecting to WS", error);
        };

        setWSConnectionObject(ws);
    }, []);

    const sendMessage = (msg) => {
        if (wsConnectionObject?.readyState === WebSocket.OPEN) {
            wsConnectionObject.send(JSON.stringify(msg));
        }
    }
    const value = {
        wsConnectionObject,
        sendMessage,
        roomData,
        messages
    }
    return (
        <wsContext.Provider value={value}>
            {children}
        </wsContext.Provider>
    )
}
