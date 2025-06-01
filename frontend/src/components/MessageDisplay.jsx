const MessageDisplay = ({ messages }) => {
    return (
        <div className="h-ful">
            <div className="space-y-2">
                {messages.map((message) => (
                    <div key={message.timestamp || message.id} className="bg-white p-3">
                        <p className="text-black">{message.message}</p>
                        <small className="text-gray-500">
                            {new Date(message.timestamp).toLocaleString()}
                        </small>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MessageDisplay;  
