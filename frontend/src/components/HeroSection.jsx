import { Link } from "react-router-dom";

const HeroSection = () => {
    return (
        <section
            className=" px-6" >
            <div className="h-screen flex flex-col justify-center items-center">
                <h2 className="text-3xl font-bold ml-3 md:ml-0 ">Collaborate. Converse. Create.</h2>
                <p className="m-2 p-1">Create or join rooms to collaborate, share files, and stay in sync — all in real time.</p>
                <Link to="/signup" className="bg-black text-white rounded p-2 m-2 hover:bg-gray-600">Join Now</Link>
            </div>
        </section >
    )
}

export default HeroSection;
