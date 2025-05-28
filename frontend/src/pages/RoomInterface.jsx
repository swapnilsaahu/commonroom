import NavBar from "../components/NavBar";
import { IoMdSend } from "react-icons/io";

const RoomInterface = () => {
    return (
        <div className="h-screen flex">

            <section className="bg-indigo-500 basis-1/5">
                <div className="bg-indigo-500">
                    <h2>hello</h2>
                </div>
            </section>
            <section className="basis-2/3">
                <div>

                </div>
                <div className=" w-full fixed bottom-0 max-w-md flex text-base p-4 border text-gray-900 bg-green-600">
                    <input type="text" name="entermessage" className="w-full text-sm p-2  border rounded"></input>
                    <div>
                        <IoMdSend />
                    </div>
                </div>
            </section>
            <section className="bg-red-500 basis-1/5
                ">
                <h2>sdhfjsdhfj</h2>
            </section>
        </div>
    )
}

export default RoomInterface;
