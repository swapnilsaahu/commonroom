const SendMessageBar = ({ handleSendMessage, setMessageValue, currentMessage }) => {

    return (
        <div className="w-full border-t border-[#1E3A8A] bg-[#0A0A0A] p-3">
            <div className="flex items-center gap-3 bg-[#1F2937] rounded-lg px-4 py-2 focus-within:ring-2 focus-within:ring-[#3B82F6] transition">
                <input
                    type="text"
                    name="sendMessage"
                    onChange={(e) => setMessageValue(e.target.value)}
                    value={currentMessage}
                    placeholder="Type a message..."
                    className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none text-sm"
                />
                <button
                    type="button"
                    onClick={handleSendMessage}
                    className="bg-[#3B82F6] hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-md transition"
                >
                    Send
                </button>
            </div>
        </div>

    )
}

export default SendMessageBar;
