import { useState } from "react";
import axios from 'axios';
const CreateRoom = () => {
    const [roomname, setroomname] = useState('');
    const [username, setusername] = useState('swapnil');
    const [roomCode, setRoomCode] = useState('');
    const storeRoomName = (event) => {
        console.log(event.target.value);
        setroomname(event.target.value);
    }
    const sendCreateReq = async () => {
        //const url = 'http://localhost:3000/api/v1/room/createRoomAPI';
        try {
            if (username) {
                console.log("roomname", roomname, "username", username);
                const ws = new WebSocket(`ws://localhost:3000/?username=${username}&roomname=${roomname}&typeOfMessage=create`);

                ws.onerror = (err) => {
                    console.error("some error connecting to ws server", err);
                }
                ws.onopen = () => {
                    ws.send("hi from the user");
                };
                ws.onmessage = (data) => {
                    console.log('recived: ', data);
                };
            }


        }
        catch (error) {
            console.error("error posting data", error);
        }
    }
    return (
        <div>
            <input type="text" name="RoomName" onChange={storeRoomName}></input>
            <button type="button" onClick={sendCreateReq}>Create Room</button>
            <div>Room Code:-</div>
            <div readOnly value={roomCode}></div>
        </div>
    )
}


export default CreateRoom;
