import NavBar from "../components/NavBar";
import { IoMdSend } from "react-icons/io";
import { useWSConnection } from "../contexts/WSContext";
const RoomInterface = () => {
    const { roomData } = useWSConnection();
    return (
        <div className="h-screen grid grid-cols-3">
            <div className="col-start-1 col-end-4 h-fit">
                <h2>top bar for vc and stuff</h2>
            </div>
            <div className="bg-indigo-500 max-w-full col-start-1 col-end-2">
                <div className="bg-indigo-500">
                    <h2>hello</h2>
                    <p>{roomData.roomname}</p>
                    <p>{roomData.roomId}</p>
                </div>
            </div>
            <div className="col-start-2 col-end-3 h-screen">

                <div className="w-full text-base p-4 border text-gray-900 bg-green-600 fixed bottom-0">
                    <input type="text" name="entermessage" className="w-full text-sm p-2  border rounded"></input>
                    <div>
                        <IoMdSend />
                    </div>
                </div>
            </div>
            <div className="bg-red-500 col-start-3 col-end-4" >
                <h2></h2>
            </div>
        </div >
    )
}

export default RoomInterface;
