import React from 'react'
import { useState, useEffect } from 'react'
import { axiosInstance } from '../lib/axios'
import { ToastContainer, toast } from 'react-toastify'
import { Link } from 'react-router-dom'

const NewReleases2 = () => {

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
          toast.error('Error fetching new releases:', error)
          setError('Failed to load new releases')
          setLoading(false)
        }
      }
  
      fetchNewReleases()
    }, [])
  
    if (loading) return <div className="flex justify-center items-center min-h-screen loading loading-infinity loading-xl"> </div>
    if (error) return <div className="text-red-500 text-center">{error}</div>
  
    return (
      <div className="min-h-content py-20 bg- text-white p-8">
        <h1 className="text-3xl font-bold mb-8">New Releases</h1>
        
        <div className="carousel carousel-center w-full p-4 space-x-4 rounded-box gap-4">
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
                  <ToastContainer stacked position='top-right'/>
                </div>
              </Link>
            </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
  

export default NewReleases2