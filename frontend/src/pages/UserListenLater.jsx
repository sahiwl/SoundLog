import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { Link, useParams } from "react-router-dom";  

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

  if (loading) return <p>Loading albums...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="bg-background text-white pt-28 min-h-screen">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">Listen Later</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {albums.map((album) => (
            <Link 
              to={`/album/${album.albumId}`}
              key={album.albumId} 
              className="bg-grids rounded-lg overflow-hidden hover:opacity-75 transition-opacity"
            >
              <img
                src={album.images?.[0]?.url || "/placeholder.svg"}
                alt={album.name}
                className="w-full h-48 object-cover"
              />
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
    </div>
  );
};

export default UserListenLater;
