import { useState, useEffect } from 'react'
import { axiosInstance } from '../lib/axios'
import { ToastContainer, toast } from 'react-toastify'
import NewReleases2 from '../components/NewReleases2'
import clsx from 'clsx'

const Homepage = () => {
    return (
        <div className="min-h-screen bg-background relative">

            {/* Content Container */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Popular This Week */}
                <section className="py-12">
                    <h2 className="text-2xl font-bold text-white mb-6">Popular This Week</h2>
                    <div className="carousel carousel-center w-full p-4 space-x-4 rounded-box">
                        {[1, 2, 3, 4, 5, 6].map((item) => (
                            <div key={item} className="carousel-item w-[350px]">
                                <div className="group relative aspect-square overflow-hidden rounded-lg hover:opacity-75 transition-opacity">
                                    <img 
                                        src={`https://picsum.photos/300/300?random=${item}`} 
                                        alt="Album cover" 
                                        className="h-full w-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300">
                                        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                            <p className="text-white font-medium truncate">Album Name</p>
                                            <p className="text-gray-300 text-sm">Artist Name</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Recent Activity */}
                <section className="py-12">
                    <h2 className="text-2xl font-bold text-white mb-6">Recent Activity</h2>
                    <div className="carousel carousel-center w-full p-4 space-x-4 rounded-box">
                        {[1, 2, 3, 4, 5].map((item) => (
                            <div key={item} className="carousel-item w-[400px] bg-gray-700 rounded-lg p-4">
                                <div className="flex gap-4">
                                    <img 
                                        src={`https://picsum.photos/100/100?random=${item + 10}`} 
                                        alt="User avatar" 
                                        className="w-12 h-12 rounded-full"
                                    />
                                    <div>
                                        <p className="text-white"><span className="font-bold">Username</span> rated <span className="text-green-400">Album Name</span></p>
                                        <p className="text-gray-400 text-sm">2 hours ago</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Staff Picks */}
                <section className="py-12">
                    <h2 className="text-2xl font-bold text-white mb-6">Staff Picks</h2>
                    <div className="carousel carousel-center w-full p-4 space-x-4 rounded-box">
                        {[1, 2, 3, 4].map((item) => (
                            <div key={item} className="carousel-item w-[500px]">
                                <div className="relative group">
                                    <img 
                                        src={`https://picsum.photos/600/300?random=${item + 20}`} 
                                        alt="Album cover" 
                                        className="rounded-lg w-full hover:opacity-75 transition-opacity"
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                                        <h3 className="text-white font-bold">Featured Album Name</h3>
                                        <p className="text-gray-300">Artist Name</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* New Releases Section */}
                <NewReleases2 />
            </div>
        </div>
    )
}


export const NewReleases1 = () => {
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
        <div className="min-h-screen bg- text-white p-8">
      <h1 className="text-3xl font-bold mb-8">New Releases</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {newReleases.map((album) => (
            <div 
            key={album.id} 
            className="group relative aspect-square overflow-hidden rounded-lg hover:opacity-75 transition-opacity"
            >
            <img
              src={album.images[2]?.url}
              alt={album.name}
              className="h-full w-full object-cover"
              />
            <div className="absolute inset-0 bg- bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-sm font-medium truncate">{album.name}</p>
                <p className="text-xs text-gray-300 truncate">
                  {album.artists.map(artist => artist.name).join(', ')}
                </p>
                <ToastContainer stacked position='top-right'/>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Homepage