import { useState, useEffect } from 'react'
import { axiosInstance } from '../lib/axios'
import { ToastContainer, toast } from 'react-toastify'
import clsx from 'clsx'
import NewReleases from '../components/NewReleases'

const Homepage = () => {
  return (
    <div className="text-white pt-28">
      <div className="container mx-auto px-4 py-6">
        {/* New Releases Section */}
        <NewReleases />

        {/* Popular This Week */}
        <section className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium">POPULAR THIS WEEK</h2>
            <span className="text-sm text-gray-400">VIEW ALL</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="group relative aspect-square bg-grids rounded-lg overflow-hidden">
                <img 
                  src={`https://picsum.photos/300/300?random=${item}`} 
                  alt="Album cover" 
                  className="h-full w-full object-cover group-hover:opacity-75 transition-opacity"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 p-3">
                    <p className="text-white text-sm font-medium truncate">Album Name</p>
                    <p className="text-gray-300 text-xs">Artist Name</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Activity */}
        <section className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium">RECENT ACTIVITY</h2>
            <span className="text-sm text-gray-400">VIEW ALL</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="bg-grids rounded-lg p-4">
                <div className="flex gap-4 items-center">
                  <img 
                    src={`https://picsum.photos/100/100?random=${item + 10}`} 
                    alt="User avatar" 
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <p className="text-sm">
                      <span className="font-medium">Username</span> rated{' '}
                      <span className="text-blue-400 hover:underline cursor-pointer">Album Name</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Staff Picks */}
        <section className="mt-12 mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium">STAFF PICKS</h2>
            <span className="text-sm text-gray-400">VIEW ALL</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="bg-grids rounded-lg overflow-hidden">
                <img 
                  src={`https://picsum.photos/600/300?random=${item + 20}`} 
                  alt="Album cover" 
                  className="w-full h-48 object-cover hover:opacity-75 transition-opacity"
                />
                <div className="p-4">
                  <h3 className="font-medium">Featured Album Name</h3>
                  <p className="text-sm text-gray-400 mt-1">Artist Name</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Homepage