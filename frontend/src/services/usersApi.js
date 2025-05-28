import axios from "axios"

const signupFetch = async (userData) => {
    try {
        console.log(userData);
        //JSON.stringify(userData);
        const response = axios.post('http://localhost:3000/api/v1/users/register', userData, { withCredentials: true });
        console.log(response.data);
    }
    catch (err) {
        console.log(err, "there was error while creating an account ")
    }
}

const loginFetch = async (loginData) => {
    try {

        console.log(loginData);
        const response = axios.post('http://localhost:3000/api/v1/users/login', loginData);
        console.log(response.data);
        return response;
    } catch (error) {
        console.log("there was error while logging in", error);
    }
}
export { signupFetch, loginFetch }
