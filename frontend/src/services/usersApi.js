import axiosApi from "../utils/axiosApiDefine";

const signupFetch = async (userData) => {
    try {
        console.log(userData);
        //JSON.stringify(userData);
        const response = axiosApi.post('/api/v1/users/register', userData,);
        console.log(response.data);
        return response.data;
    }
    catch (err) {
        console.log(err, "there was error while creating an account ")
    }
}

const loginFetchApi = async ({ username, password }) => {
    try {

        console.log(username, ": username");
        const response = await axiosApi.post('/api/v1/users/login', { username, password });
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.log("there was error while logging in", error);
    }
}


const checkAuthApi = async () => {
    try {
        const reponse = await axiosApi.get('/api/v1/users/verify');
        return reponse.data;
    } catch (error) {
        console.error("error while doing authcheck", error);
    }
}

const getRoomsApi = async (username) => {
    try {
        const res = await axiosApi.get(`/api/v1/users/rooms?username=${encodeURIComponent(username)}`);
        return res.data;
    }
    catch (error) {
        console.error("error while getting rooms", error);
    }
}

const getUsersApi = async (roomId) => {
    try {
        const res = await axiosApi.get(`/api/v1/room/users?roomId=${encodeURIComponent(roomId)}`,);
        return res.data;
    } catch (error) {
        console.error("error while fetching users", error);
    }
}
export { signupFetch, loginFetchApi, checkAuthApi, getRoomsApi, getUsersApi }
