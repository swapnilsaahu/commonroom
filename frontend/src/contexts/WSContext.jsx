import { useState, useEffect } from "react";
import { useRef } from "react";
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
    const [users, setUsersInRoom] = useState([]);
    const [rooms, setRooms] = useState([]);


    useEffect(() => {

        const ws = new WebSocket('ws://localhost:3000');
        setWSConnectionObject(ws);

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
                    sessionStorage.setItem('roomData', JSON.stringify(data));
                    console.log("inside created wscontext", sessionStorage.getItem('roomData'));
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
                case 'getUsersInRoom':
                    if (data.users && Array.isArray(data.users)) {
                        setUsersInRoom(data.users);
                    }
                    break;
                case 'reconnect':
                    setroomData(data);
                    sessionStorage.setItem('roomData', JSON.stringify(data));
                    console.log("inside reconnect wscontext", sessionStorage.getItem("roomData"))
                    break;
                case 'getRooms':
                    setRooms(data.rooms);
                    break;
                default:
                    setroomData(data);
            }
        }

        ws.onerror = (error) => {
            console.error("Error connecting to WS", error);
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
        sessionStorage.removeItem("roomId");
    }
    const value = {
        wsConnectionObject,
        sendMessage,
        roomData,
        messages,
        users,
        clearRoom,
        setroomData,
        rooms
    }
    return (
        <wsContext.Provider value={value}>
            {children}
        </wsContext.Provider>
    )
}
