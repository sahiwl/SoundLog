import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'

import Login from './pages/Login';
import Landing from './pages/Landing';
import Signup from './pages/Signup';
import Homepage from './pages/Homepage';
import useAuthStore from './store/useAuthStore';
import Navbar from './components/Navbar';

function App() {
  const [count, setCount] = useState(0)
  const  {checkAuth, isCheckingAuth, authUser } = useAuthStore()

  useEffect(()=>{
    checkAuth()
  }, [])

  console.log({authUser});

  if(isCheckingAuth && !authUser) return(
    <div className='flex items-center justify-center h-screen'>
        <div className="loading loading-infinity loading-xl"></div>
    </div>
  )

  return (
    <>

     <Navbar/>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Landing />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/home" element={<Homepage />} />

    </Routes>

     </>
  )
}

export default App
