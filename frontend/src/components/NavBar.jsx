import { NavLink } from 'react-router-dom'


const NavBar = () => {
    return (
        <nav className='fixed top-0 left-0 w-full text-2xl text-white flex items-center justify-end-safe space-x-4 pt-2 pr-4'>
            <div>
                <NavLink to="/">Home</NavLink>
            </div>
            <div>
                <NavLink to="/signup">Register</NavLink>
            </div>
            <div>
                <NavLink to="/login">Login</NavLink>
            </div>



        </nav>
    )
}

export default NavBar;
