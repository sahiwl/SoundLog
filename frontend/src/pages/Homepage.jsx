import { useState, useEffect } from 'react'
import { axiosInstance } from '../lib/axios'
import NewReleases from '../components/NewReleases'
import { useParams, Link } from 'react-router-dom'
import useAuthStore from '../store/useAuthStore'

const Homepage = () => {
  const [userLikedAlbums, setUserLikedAlbums] = useState([]);
  const { authUser } = useAuthStore();

  useEffect(() => {
    const fetchUserLikes = async () => {
      try {
        // Fetch first page of user's liked albums
        const response = await axiosInstance.get(`/pages/${authUser.username}/likes`, {
          params: { page: 1, limit: 12 } // Show first 12 liked albums
        });
        setUserLikedAlbums(response.data.albums);
      } catch (error) {
        console.error('Error fetching liked albums:', error);
      }
    };

    if (authUser) {
      fetchUserLikes();
    }
  }, [authUser]);

  return (
    <div className="text-white pt-28">
      <div className="container mx-auto px-4 py-6">
        <NewReleases />

        {userLikedAlbums.length > 0 && (
          <div className="mt-12 w-full">
            <h2 className="text-4xl font-bold mb-6">You Liked</h2>
            <div className="carousel carousel-center w-full p-4 gap-6 space-x-6 rounded-box">
              {userLikedAlbums.map((album) => (
                <div className="carousel-item w-[330px]" key={album.albumId}>
                  <Link 
                    to={`/album/${album.albumId}`}
                    className="group relative w-full rounded-lg overflow-hidden"
                  >
                    <img
                      src={album.images?.[0]?.url || "/placeholder.svg"}
                      alt={album.name}
                      className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="absolute bottom-0 w-full p-4">
                        <h3 className="text-white font-medium truncate">{album.name}</h3>
                        <p className="text-gray-300 text-sm truncate">
                          {album.artists?.[0]?.name}
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
            <div className="mt-4 text-right">
              <Link 
                to={`/${authUser?.username}/likes`}
                className="text-sm text-gray-400 hover:text-white"
              >
                View all →
              </Link>
            </div>
          </div>
        )}

        {/* Popular This Week */}
        <section className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">POPULAR THIS WEEK</h2>
            <span className="text-sm text-gray-400">VIEW ALL</span>
          </div>
          <div className="carousel carousel-center w-full p-4 space-x- rounded-box">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div className="carousel-item w-[400px]" key={item}>
                <div className="group relative rounded-lg overflow-hidden">
                  <img 
                    src={`https://picsum.photos/300/300?random=${item}`} 
                    alt="Album cover" 
                    className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="absolute bottom-0 w-full p-4">
                      <p className="text-white font-medium truncate">Album Name</p>
                      <p className="text-gray-300 text-sm truncate">Artist Name</p>
                    </div>
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