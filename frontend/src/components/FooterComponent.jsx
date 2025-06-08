import { Link } from "react-router-dom";
import { FaGithub } from "react-icons/fa";

const FooterComponent = () => {
    return (
        <footer className="bg-gray-900 text-white py-8 px-6 mt-10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-5 text-lg">
                <div className="text-center md:text-left">
                    <h3 className="tex-lg font-semibold">coommonroom</h3>
                    <p className="tex-gray-400">Collaborate. Converse. Create.</p>
                </div>
                <div>
                    <FaGithub className="text-2xl mb-2 ml-3" />
                    <a href="https://github.com/swapnilsaahu" target="_blank">github</a>
                </div>
                <div className="text-center md:text-right text-gray-500">
                    {new Date().getFullYear()} coommonroom.
                </div>
            </div>
        </footer>
    )
}

export default FooterComponent;
