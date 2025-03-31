import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'


import Landing from './pages/Landing';
import Signup from './pages/Signup';
import Homepage from './pages/Homepage';

import Navbar from './components/Navbar';
import Signin from './pages/Signin';
import AlbumPage from './pages/AlbumPage';
import TrackPage from './pages/TrackPage';
import ArtistPage from './pages/ArtistPage';
import AuthRoute from './components/AuthRoute';
import UserListenLater from './pages/UserListenLater';
import UserReviews from './pages/UserReviews';
import UserAlbums from './pages/UserAlbums';
import UserLikes from './pages/UserLikes';
import NewReleasesPage from './pages/NewReleasesPage';

import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';

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
          <Route path="/newreleases" element={<NewReleasesPage />} />
          <Route path="/album/:albumId" element={<AlbumPage />} />
          <Route path="/artist/:artistId" element={<ArtistPage />} />
          <Route path="/tracks/:trackId" element={<TrackPage />} />
          <Route path="/:username/albums" element={<UserAlbums />} />
          <Route path="/:username/listenlater" element={<UserListenLater />} />
          <Route path="/:username/reviews" element={<UserReviews />} />
          <Route path="/:username/likes" element={<UserLikes />} />
          <Route path="/:username/profile" element={<ProfilePage />} />
          <Route path="/:username/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
