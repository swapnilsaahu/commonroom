import axios from "axios";

const axiosApi = axios.create({
    // Prefer env so dev/prod stay consistent
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

export default axiosApi;
