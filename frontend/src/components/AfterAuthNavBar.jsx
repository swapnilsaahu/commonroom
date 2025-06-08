import { Link, useNavigate } from "react-router-dom";
const AfterAuthNavBar = () => {
    const navigate = useNavigate();
    return (
        <div>
            <div className=" flex justify-between items-center p-4 border-b border bg-gray-50 text-black z-50 px-6 py-4 gap-10">
                <Link to="/" className="text-xl font-bold text-black">commonroom</Link>
                <div className="space-x-4">
                    <Link to="/dashboard">Rooms</Link>
                    <Link>Account</Link>
                </div>
            </div>
        </div >
    )
}
export default AfterAuthNavBar;
