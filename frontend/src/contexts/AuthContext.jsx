import { useContext, useEffect, useState } from "react";
import { createContext } from "react";
import { checkAuthApi, getRoomsApi, loginFetchApi, getUsersApi } from "../services/usersApi";
import { useWSConnection } from "./WSContext";

export const userAuthContext = createContext();

export const useAuth = () => {
    const context = useContext(userAuthContext);
    if (!context) {
        throw new Error("userAuthContext must be used within an AuthProvider");
    }
    return context;
}

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState("");
    const [rooms, setRooms] = useState([]);
    const [users, setUsersInARoom] = useState([]);

    const handleLogin = async (username, password) => {
        try {
            const response = await loginFetchApi({ username, password });
            console.log(response.success, "inside context");
            if (response.success) {
                setIsAuthenticated(true);
                console.log(username, "inside respon success context");
                setUsername(response.data.username);
                sessionStorage.setItem('username', response.data.username);
                return { success: true };
            } else {
                const errorData = await response.json();
                return { success: false, error: errorData.message };
            }
        }
        catch (error) {
            return { success: false, error: 'Login failed' };
        }
    }

    const checkAuth = async () => {
        try {
            const result = await checkAuthApi();

            if (result.success) {
                console.log(result, "inside checkauth in context");
                setIsAuthenticated(true);
                setUsername(result.data.username);
                sessionStorage.setItem('username', result.data.username);
            }
            else {
                setIsAuthenticated(false);
                setUsername(null);
            }
        } catch (error) {
            console.error("auth failed", error);
        }
    }
    const roomsFromDB = async (username) => {
        try {
            const result = await getRoomsApi(username);
            if (result.success) {
                setRooms(result.data.rooms);
            }

        } catch (error) {
            console.error("error fetching rooms", error);
        }
    }

    const usersInARoomDB = async (roomId) => {
        try {
            const result = await getUsersApi(roomId);
            if (result.success) {
                setUsersInARoom(result.data.users);
            }
        } catch (error) {
            console.error("error while getting users", error);
        }
    }

    useEffect(() => {
        checkAuth()
    }, []);

    const value = {
        isAuthenticated,
        username,
        checkAuth,
        handleLogin,
        setUsername,
        roomsFromDB,
        rooms,
        users,
        usersInARoomDB
    };

    return (
        <userAuthContext.Provider value={value}>
            {children}
        </userAuthContext.Provider>
    )
}
