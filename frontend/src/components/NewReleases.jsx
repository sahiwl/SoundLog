import React from 'react'
import { useState, useEffect } from 'react'
import { axiosInstance } from '../lib/axios.js'
import { showToast } from '../lib/toastConfig.js'
import { Link } from 'react-router-dom'

const NewReleases = () => {

    const [newReleases, setNewReleases] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
  
    useEffect(() => {
      const fetchNewReleases = async () => {
        try {
          const response = await axiosInstance.get('/music/newreleases')
          setNewReleases(response.data.albums.items)
          setLoading(false)
        } catch (error) {
          showToast.error('Error fetching new releases')
          setError('Failed to load new releases')
          setLoading(false)
        }
      }
  
      fetchNewReleases()
    }, [])
  
    if (loading) return <div className="flex justify-center items-center min-h-screen "> <div className="loading loading-infinity loading-xl"></div> </div>
    if (error) return <div className="text-red-500 text-center">{error}</div>
  
    return (
      <div className="min-h-content -28 bg- text-white">
        <h1 className="text-4xl font-bold mb-8">New Releases</h1>
        
        <div className="carousel carousel-center w-full p-4 gap-6 space-x-6 rounded-box">
          {newReleases.map((album) => (
            <div 
              key={album.id} 
              className="carousel-item w-[330px]"
            >
                <div className="group relative aspect-square overflow-hidden rounded-lg hover:opacity-75 transition-opacity">

              <img
                src={album.images[2]?.url}
                alt={album.name}
                className="h-full w-full object-cover"
              />
{/* target div -> click to go to albumPage */}
              <Link className="absolute inset-0 bg- bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300" to={`/album/${album.id}`}> 
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-sm font-medium truncate">{album.name}</p>
                  <p className="text-xs text-gray-300 truncate">
                    {album.artists.map(artist => artist.name).join(', ')}
                  </p>
                </div>
              </Link>
            </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
  

export default NewReleases