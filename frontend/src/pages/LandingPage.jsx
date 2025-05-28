import NavBar from "../components/NavBar";


const LandingPage = () => {

    return (
        <>
            <NavBar />
            <section className="h-screen w-full overflow-x-hidden flex flex-col px-4 justify-center items-center gap-2 text-white bg-black">

                <h2 className="text-4xl text-center w-full sm:w-auto"> Your virtual campus for</h2>

                <h2 className=" text-4xl text-center w-full sm:w-auto
                    ">real-time collaboration and communication.</h2>
                <p className="text-center">Join rooms, chat live, share notes, and study face-to-face — all in one place.</p>
                <button type="button" className="text-black text-2xl bg-white p-2 mt-3">Join Now</button>

            </section>
        </>
    );
};

export default LandingPage;
