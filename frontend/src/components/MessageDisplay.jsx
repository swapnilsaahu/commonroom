const MessageDisplay = ({ messages }) => {
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return (
            <div className="text-center text-gray-500 py-8">
                No messages yet. Start the conversation!
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {messages.map((message, index) => (
                <div key={message.id || `${message.timestamp}-${index}`} className="px-3 py-1">
                    <div className="flex items-center gap-2 mb-1">
                        <p className="text-[#3B82F6] font-semibold text-sm">{message.username || 'Unknown'}</p>
                        <small className="text-gray-400 text-xs">
                            {message.timestamp ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </small>
                    </div>
                    <div className="inline-block max-w-[80%] bg-white text-black text-sm p-3 rounded-xl shadow-sm">
                        {message.message || ''}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default MessageDisplay;  
