import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'

import Login from './pages/Login';
import Landing from './pages/Landing';
import Signup from './pages/Signup';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Landing />} />
      <Route path="/signup" element={<Signup />} />

    </Routes>
  </BrowserRouter>
     </>
  )
}

export default App
