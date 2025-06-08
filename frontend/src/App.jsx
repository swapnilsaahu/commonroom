import './App.css'
import { Routes, Router, Route, createRoutesFromChildren } from 'react-router-dom'
import LandingPage from './pages/LandingPage.jsx'
import NavBar from './components/NavBar.jsx'
import RoomInterface from './pages/RoomInterface.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import DashBoard from './pages/DashBoard.jsx'
import CreateRoom from './components/CreateRoom.jsx'
import ProtectedRoutes from './utils/ProtectedRoutes.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { WSContextProvider } from './contexts/WSContext.jsx'
import JoinRoom from './components/JoinRoom.jsx'

function App() {
    return (
        <>
            <AuthProvider>
                <WSContextProvider>
                    <div className=''>
                        <Routes>
                            <Route path='/login' element={<LoginPage />} />
                            <Route path='/' element={<LandingPage />} />
                            <Route path='/signup' element={<RegisterPage />} />
                            <Route element={<ProtectedRoutes />}>
                                <Route path='/dashboard' element={<DashBoard />} />
                                <Route path='/createroom' element={<CreateRoom />} />
                                <Route path='/room' element={<RoomInterface />} />
                                <Route path='/joinroom' element={<JoinRoom />} />
                            </Route>
                        </Routes>
                    </div>
                </WSContextProvider>
            </AuthProvider >
        </>
    )
}

export default App
