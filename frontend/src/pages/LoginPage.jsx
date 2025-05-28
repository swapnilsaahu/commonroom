import { useState } from "react";
import { loginFetch } from "../services/usersApi";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const [loginData, setlogindata] = useState({});
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await loginFetch(loginData);

            if (response.status === 200) {
                navigate("/dashboard");
            } else {
                console.error("Login failed:", response.data);
            }
        } catch (err) {
            console.error("Login failed", err);
        }
    };
    return (
        <div className="min-h-screen w-full px-4 py-6 flex justify-center items-center bg-black overflow-x-hidden">
            <div className="w-full max-w-md flex flex-col gap-4 text-white">
                <h2 className="text-4xl text-center">StudyHub</h2>
                <h3 className="text-xl text-center">Login</h3>

                <input type="text" name="username" placeholder="Username" className="bg-gray-800 border border-gray-600 rounded-lg p-2 w-full" onChange={(e) => setlogindata(prev => ({ ...prev, username: e.target.value }))} />
                <input type="password" name="password" placeholder="Password" className="bg-gray-800 border border-gray-600 rounded-lg p-2 w-full" onChange={(e) => setlogindata(prev => ({ ...prev, password: e.target.value }))} />

                < button className="text-gray-900 bg-amber-50 py-3 rounded-xl w-full" onClick={handleLogin}>Login</button>

                <p className="text-gray-500 text-center text-sm">
                    Don't have an account? <a className="underline cursor-pointer">Sign up
                    </a>
                </p>
            </div>
        </div >
    );
};

export default LoginPage;


