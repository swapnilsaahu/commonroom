const LeftRoomDetailComponent = ({ roomData }) => {
    if (!roomData) {
        return (
            <div className="p-4">
                <p>Loading room details...</p>
            </div>
        );
    }

    return (
        <div className="p-4">
            <h2 className="text-3xl font-bold">{roomData.roomname}</h2>
            <p className="text-sm">Room ID: {roomData.roomId}</p>
        </div>
    );
};

export default LeftRoomDetailComponent;
