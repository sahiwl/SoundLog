import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'


import Landing from './pages/Landing';
import Signup from './pages/Signup';
import Homepage from './pages/Homepage';
import useAuthStore from './store/useAuthStore';
import Navbar from './components/Navbar';
import Signin from './pages/Signin';
import AlbumPage from './pages/AlbumPage';
import TrackPage from './pages/TrackPage';
import ArtistPage from './pages/ArtistPage';
import AuthRoute from './components/AuthRoute';

function App() {
  return (
    <div className="bg-background min-h-screen text-white">
      <Navbar />
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Landing />} />
        
        {/* Auth Routes */}
        <Route element={<AuthRoute routeType="auth" />}>
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<AuthRoute routeType="protected" />}>
          <Route path="/home" element={<Homepage />} />
          <Route path="/album/:albumId" element={<AlbumPage />} />
          <Route path="/artist/:artistId" element={<ArtistPage />} />
          <Route path="/tracks/:trackId" element={<TrackPage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
