const MessageDisplay = ({ messages }) => {
    return (
        <div className="space-y-3">
            {messages.map((message) => (
                <div key={message.timestamp || message.id} className="px-3 py-1">
                    <div className="flex items-center gap-2 mb-1">
                        <p className="text-[#3B82F6] font-semibold text-sm">{message.username}</p>
                        <small className="text-gray-400 text-xs">
                            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </small>
                    </div>
                    <div className="inline-block max-w-[80%] bg-white text-black text-sm p-3 rounded-xl shadow-sm">
                        {message.message}
                    </div>
                </div>
            ))}
        </div>

    )
}

export default MessageDisplay;  
