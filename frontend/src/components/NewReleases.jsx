import React from 'react'
import { useState, useEffect } from 'react'
import { axiosInstance } from '../lib/axios.js'
import { showToast } from '../lib/toastConfig.js'
import { Link } from 'react-router-dom'
import { Music } from 'lucide-react'

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

  const renderAlbumCard = (album) => (
    <div key={album.id} className="carousel-item w-[280px] sm:w-[320px] lg:w-[330px] flex-shrink-0">
      <Link to={`/album/${album.id}`} className="group block w-full">
        <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-800">
          {album.images?.[0] ? (
            <img
              src={album.images[0].url}
              alt={album.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Music className="text-gray-600" size={32} />
            </div>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
        </div>
        <div className="mt-3 space-y-1 w-full">
          <h3 className="text-white text-sm font-medium truncate group-hover:text-purple-300 transition-colors w-full">
            {album.name}
          </h3>
          <p className="text-gray-400 text-xs truncate w-full">
            {album.artists?.map(artist => artist.name).join(', ')}
          </p>
          <p className="text-gray-500 text-xs truncate w-full">
            {album.release_date?.substring(0, 4)} • {album.album_type || 'Album'}
          </p>
        </div>
      </Link>
    </div>
  );

  if (loading) return <div className="flex justify-center items-center min-h-screen "> <div className="loading loading-infinity loading-xl"></div> </div>
  if (error) return <div className="text-red-500 text-center">{error}</div>

  return (
    <div className="min-h-content -28 bg- text-white">
      <h1 className="text-4xl font-bold mb-8">New Releases</h1>

      <div className="carousel carousel-center w-full p-4 gap-6 space-x-6 rounded-box">
        {newReleases.map(renderAlbumCard)}
      </div>
    </div>
  )
}


export default NewReleases