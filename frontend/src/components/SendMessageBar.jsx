const SendMessageBar = ({ handleSendMessage, setMessageValue, currentMessage }) => {

    return (
        <div className="border absolute bottom-0 w-full">
            <div className="flex flex-row bg-blue-100 p-2">
                <input type="text" name="sendMessage" onChange={(e) => setMessageValue(e.target.value)} value={currentMessage} className="border bg-gray-300 text-black flex-1 "></input>
                <button type="button" onClick={handleSendMessage} className="text-black p-1">send</button>
            </div>
        </div>
    )
}

export default SendMessageBar;
