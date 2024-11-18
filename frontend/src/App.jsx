
import './App.css'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/shared/Navbar'
import Homepage from './components/Homepage'
import Footer from './components/shared/Footer'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import ForgotPassword from './components/auth/ForgotPassword'
import ResetPassword from './components/auth/ResetPassword'

function App() {
  const location= useLocation()
  return (
    <>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Homepage />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup/>} />
        <Route path='/forgot-password' element={<ForgotPassword/>} />
        <Route path='/reset-password' element={<ResetPassword/>} />

      </Routes>
      {location.pathname !== '/login' && location.pathname !== '/signup' && <Footer />}
    </>
  )
}

export default App
