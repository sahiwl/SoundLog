import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios.js";
import { Link, useParams } from "react-router-dom";  
import Background from "../components/Background.jsx";

const UserListenLater = () => {
  const { username } = useParams();  
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchListenLater = async (page = 1) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/pages/${username}/listenlater`, { 
        params: { page },
      });
      setAlbums(response.data.albums);
    //   console.log(response.data.albums);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.error("Error fetching listen later:", err);
      setError("Failed to load albums.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (username) fetchListenLater();
  }, [username]);  // Add username to dependency array

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      fetchListenLater(page);
    }
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen "> <div className="loading loading-infinity loading-xl"></div> </div>
  if (error) return <p>{error}</p>;

  return (
    <Background imageUrl={"https://images.complex.com/complex/image/upload/v1723827899/sanity-new/future-and-metro-boomin-turn-up-the-heat-with-we--5-2896-1712972245-0_16x9-7653775.jpg"} className={"text-white pt-28 min-h-screen"}>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">Listen Later</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {albums.map((album) => (
            <Link 
              to={`/album/${album.albumId}`}
              key={album.albumId} 
              className="group relative rounded-lg overflow-hidden"
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
          ))}
        </div>
        
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </Background>
  );
};

export default UserListenLater;
