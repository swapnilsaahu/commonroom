import './App.css'
import { Routes, Router, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage.jsx'
import NavBar from './components/NavBar.jsx'
import RoomInterface from './pages/RoomInterface.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import DashBoard from './pages/DashBoard.jsx'
function App() {

    return (
        <>
            <div className=''>
                <Routes>
                    <Route path='/' element={<LandingPage />} />
                    <Route path='/room' element={<RoomInterface />} />
                    <Route path='/signup' element={<RegisterPage />} />
                    <Route path='/login' element={<LoginPage />} />
                    <Route path='/dashboard' element={<DashBoard />} />
                </Routes>
            </div>
        </>
    )
}

export default App
