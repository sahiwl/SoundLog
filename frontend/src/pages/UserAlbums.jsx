import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { axiosInstance } from "../lib/axios";

const UserAlbums = () => {
  const { username } = useParams();
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUserAlbums = async (page = 1) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/pages/${username}/albums`, {
        params: { page },
      });
      setAlbums(response.data.albums);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.error("Error fetching user albums:", err);
      setError("Failed to load albums.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (username) fetchUserAlbums();
  }, [username]);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      fetchUserAlbums(page);
    }
  };

  if (loading) return <p>Loading albums...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="bg-background text-white pt-28 min-h-screen">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">{username}'s Albums</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {albums.map((albums) => (
            <Link 
              to={`/album/${albums.albumId}`}
              key={albums.albumId} 
              className="bg-grids rounded-lg overflow-hidden hover:opacity-75 transition-opacity"
            >
              <img
                src={albums.images?.[0]?.url || "/placeholder.svg"}
                alt={albums.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-2">
                <h3 className="text-sm font-medium truncate">{albums.name}</h3>
                <p className="text-xs text-gray-400 truncate">
                  {albums.artists?.[0]?.name}
                </p>
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
    </div>
  );
};

export default UserAlbums;
