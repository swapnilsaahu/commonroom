import { NavLink } from 'react-router-dom'


const NavBar = () => {
    return (
        <nav className='fixed w-full top-0 shadow flex justify-between items-center px-6 py-4 z-50 bg-white gap-10'>
            <div className='text-xl font-semibold'>
                <NavLink to="/">commonroom</NavLink>
            </div>
            <div className='flex gap-4'>
                <div className=''>
                    <NavLink
                        to="/signup"
                        className="px-4 py-2 rounded hover:bg-gray-100 transition"
                    >
                        Get Started</NavLink>
                </div>
                <div className='mt-3 md:mt-0'>
                    <NavLink
                        to="/login"
                        className="px-4 py-2 rounded hover:bg-gray-100 transition"
                    >
                        Login</NavLink>
                </div>
            </div>
        </nav >
    )
}

export default NavBar;
