import { useNavigate } from "react-router-dom";
const AfterAuthNavBar = () => {
    const navigate = useNavigate();
    return (
        <div>
            <div className="flex justify-between items-center p-4 border-b border-[#1E3A8A] bg-[#0A0A0A] text-white">
                <span className="text-xl font-bold text-[#3B82F6]">commonroom</span>
                <input className="bg-[#1F2937] px-3 py-1 rounded text-sm placeholder-gray-400 text-white" placeholder="Search rooms.." />
                <span className="text-sm text-[#D1D5DB]">Rooms | Account</span>
            </div>
        </div >
    )
}
export default AfterAuthNavBar;
