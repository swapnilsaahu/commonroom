import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";


const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { handleLogin, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // redirect when user is already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            const from = location.state?.from?.pathname || '/dashboard';
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, location]);

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent form submission if used in a form
        setError('');
        setIsLoading(true);

        try {
            const result = await handleLogin(username, password);
            if (result.success) {
                // Navigation will be handled by useEffect when isAuthenticated changes
                console.log("successfull");
            } else {
                setError(result.error || 'Login failed. Please try again.');
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Don't render the form if user is already authenticated
    if (isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen w-full px-4 py-6 flex justify-center items-center bg-gray-50 overflow-x-hidden">
            <div className="w-full max-w-md flex flex-col gap-4 text-black">
                <h2 className="text-4xl text-center">Commonroom</h2>
                <h3 className="text-xl text-center">Login</h3>

                {error && (
                    <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-2 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        className="bg-gray-200 border border-gray-600 rounded-lg p-2 w-full"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        disabled={isLoading}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        className="bg-gray-200 border border-gray-600 rounded-lg p-2 w-full"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                        required
                    />
                    <button
                        type="submit"
                        className="text-white bg-black py-3 rounded-xl w-full disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isLoading || !username || !password}
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <p className="text-gray-500 text-center text-sm">
                    Don't have an account? <Link to="/signup" className="underline cursor-pointer">Sign up</Link>
                </p>
            </div>
        </div >
    );
};

export default LoginPage;
