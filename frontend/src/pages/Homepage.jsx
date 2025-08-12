import { useState, useEffect } from 'react'
import { axiosInstance } from '../lib/axios.js'
import NewReleases from '../components/NewReleases.jsx'
import RecommendedAlbums from '../components/RecommendedAlbums.jsx'
import SmartDiscovery from '../components/SmartDiscovery.jsx'
import UserLiked from '../components/UserLiked.jsx'
import { Link } from 'react-router-dom'
import useAuthStore from '../store/useAuthStore.js'

const Homepage = () => {
  const { authUser } = useAuthStore();

  return (
    <div className="text-white pt-28 min-h-screen">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="space-y-12">

          <NewReleases />

          <RecommendedAlbums />

          <UserLiked />

          <SmartDiscovery />

          {/* Some More Text Section */}
          <section className="text-center py-16">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                STICK FOR MORE 🐬 
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed">
                Discover, rate, and review your favorite albums. Connect with fellow music lovers
                and explore new sounds curated just for you.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Homepage