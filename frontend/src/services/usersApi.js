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
export { signupFetch, loginFetchApi, checkAuthApi }
