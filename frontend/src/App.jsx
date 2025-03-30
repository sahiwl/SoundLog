import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'


import Landing from './pages/Landing';
import Signup from './pages/Signup';
import Homepage from './pages/Homepage';
import useAuthStore from './store/useAuthStore';
import Navbar from './components/Navbar';
import Signin from './pages/Signin';
import ProtectedRoute from './components/ProtectedRoute';
import AlbumPage from './pages/AlbumPage';
import TrackPage from './pages/TrackPage';
import ArtistPage from './pages/ArtistPage';

function App() {
  return (
    <div className="bg-background min-h-screen text-white">
      <Navbar />
      <Routes>
        <Route path="/signin" element={<Signin />} />
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={
          <ProtectedRoute>
            <Homepage />
          </ProtectedRoute>
        } />
        <Route path="/album/:albumId" element={<AlbumPage />} />
        <Route path="/artist/:artistId" element={<ArtistPage />} />
        <Route path="/tracks/:trackId" element={<TrackPage />} />
      </Routes>
    </div>
  );
}

export default App
