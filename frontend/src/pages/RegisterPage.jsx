import { useState, useEffect } from "react";
import { signupFetch } from "../services/usersApi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const RegisterPage = () => {
    const [userData, setUserData] = useState({});
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated } = useAuth();
    useEffect(() => {
        if (isAuthenticated) {
            const from = location.state?.from?.pathname || '/dashboard';
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, location]);

    const signUpHandle = async () => {
        try {
            const res = await signupFetch(userData);
            if (res.success) {
                navigate('/login');
            }
        } catch (error) {
            console.error("error while signing up", error);
        }
    }

    return (
        <div className="min-h-screen w-full px-4 py-6 flex justify-center items-center bg-gray-50 overflow-x-hidden">
            <div className="w-full max-w-md flex flex-col gap-4 text-black">
                <h2 className="text-4xl text-center">Commonroom</h2>
                <h3 className="text-xl text-center">Create an account</h3>
                <p className="text-black text-center text-sm">
                    Let's get started. Fill in the details below to create your account.
                </p>

                <input type="email" name="email" placeholder="Email" className="bg-gray-200 border border-gray-600 rounded-lg p-2 w-full" onChange={(e) => {
                    setUserData(prev => ({ ...prev, email: e.target.value }))
                }} />
                <input type="text" name="username" placeholder="Username" className="bg-gray-200 border border-gray-600 rounded-lg p-2 w-full" onChange={(e) => {
                    setUserData(prev => ({ ...prev, username: e.target.value }))
                }} />
                <input type="password" name="password" placeholder="Password" className="bg-gray-200 border border-gray-600 rounded-lg p-2 w-full" onChange={(e) => {
                    setUserData(prev => ({ ...prev, password: e.target.value }))
                }} />
                <input type="text" name="firstname" placeholder="First Name" className="bg-gray-200 border border-gray-600 rounded-lg p-2 w-full" onChange={(e) => {
                    setUserData(prev => ({ ...prev, firstName: e.target.value }))
                }} />
                <input type="text" name="lastname" placeholder="Last Name" className="bg-gray-200 border border-gray-600 rounded-lg p-2 w-full" onChange={(e) => {
                    setUserData(prev => ({ ...prev, lastName: e.target.value }))
                }} />

                <button className="text-white bg-black py-3 rounded-xl w-full" onClick={() => signUpHandle(userData)}>Sign up</button>

                <p className="text-gray-500 text-center text-sm">
                    Already have an account? <Link to="/login" className="underline cursor-pointer">Sign in</Link>
                </p>
            </div>
        </div >
    );
};

export default RegisterPage;


