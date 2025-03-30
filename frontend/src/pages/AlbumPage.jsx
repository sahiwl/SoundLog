// src/pages/AlbumPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { axiosInstance } from "../lib/axios";

const AlbumPage = () => {
  const { albumId } = useParams(); // album ID
  const [albumData, setAlbumData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAlbumDetails = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/pages/albums/${albumId}`, { // Keep this API endpoint path
        withCredentials: true,
      });
      setAlbumData(response.data.album);
    } catch (err) {
      console.error(err);
      setError("Error fetching album details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (albumId) fetchAlbumDetails();
  }, [albumId]);

  if (loading) return <p>Loading album details...</p>;
  if (error) return <p>{error}</p>;
  if (!albumData) return <p>No album data found.</p>;

  function formatDuration(ms) {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  function calculateTotalDuration(tracks) {
    if (!tracks || tracks.length === 0) return "0 minutes";

    const totalMs = tracks.reduce((acc, track) => acc + track.duration_ms, 0);
    const hours = Math.floor(totalMs / 3600000);
    const minutes = Math.floor((totalMs % 3600000) / 60000);

    if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''}, ${minutes} minute${minutes > 1 ? 's' : ''}`;
    } else {
      return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    }
  }

  return (
    <div className="bg-background text-white pt-28 min-h-screen">
      {/* Navigation Tabs */}
      {/* <div className="border-b border-gray-700">
        <div className="container mx-auto my-20">
          <nav className="flex">
            <a href="#" className="px-5 py-4 font-medium text-white">OVERVIEW</a>
            <a href="#" className="px-5 py-4 font-medium text-gray-400">USER REVIEWS</a>
            <a href="#" className="px-5 py-4 font-medium text-gray-400">LISTS</a>
            <a href="#" className="px-5 py-4 font-medium text-gray-400">DISCOGRAPHY</a>
          </nav>
        </div>
      </div> */}

      {/* Main Content */}
      <div className="container  mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Album Info */}
          <div className="lg:col-span-2">
            {/* Artist and Album Title */}
            <div className="mb-6">
              <h1 className="text-2xl font-medium">
                Artists: {albumData.artists.map((a) => a.name).join(", ")}
              </h1>
              <h2 className="text-4xl font-bold">{albumData.name}</h2>
            </div>

            {/* Album Cover and Scores */}
            <div className="flex flex-col md:flex-row gap-6">
              {/* Album Cover */}
              <div className="flex-shrink-0">
                <img
                  src={albumData.images[0]?.url}
                  alt={`${albumData.name} cover`}
                  className="w-full max-w-[350px]"
                />
                {/* Streaming Links */}
                <div className="flex mt-4 space-x-2">
                  <a href="#" className="bg-grids text-white px-3 py-2 rounded flex items-center space-x-2">
                    <span>Amazon</span>
                  </a>
                  <a href="#" className="bg-grids text-white px-3 py-2 rounded flex items-center space-x-2">
                    <span>Apple Music</span>
                  </a>
                  <a href={albumData.external_urls.spotify} target="_blank" rel="noreferrer" className="bg-grids text-white px-3 py-2 rounded flex items-center space-x-2">
                    <span>Spotify</span>
                  </a>
                </div>
              </div>

              {/* Scores */}
              <div className="flex-grow">
                {/* User Score (Static Example) */}
                <div className="bg-grids p-4 rounded">
                  <h3 className="text-sm font-medium mb-2">USER SCORE</h3>
                  <div className="flex items-end mb-2">
                    <span className="text-6xl font-bold">72</span>
                    <div className="ml-4">
                      <p className="text-sm">Based on 7,360 ratings</p>
                      <p className="text-sm text-gray-400">2016 Rank: #581</p>
                    </div>
                  </div>
                  <div className="h-1 bg-green-500 w-3/4 mt-2"></div>
                  <button className="text-sm text-gray-400 mt-4 float-right">MORE ↓</button>
                </div>
              </div>
            </div>

            {/* User Review Section */}
            <div className="mt-8 bg-grids rounded p-4">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-600 rounded-full mr-4"></div>
                <div>
                  <p className="font-medium">User: {albumData.user ? albumData.user.username : "Anonymous"}</p>
                  {/* Dummy rate display */}
                  <div className="flex items-center">
                    <span className="text-sm text-gray-400">Rating: {albumData.rating || "N/A"}</span>
                    <span className="ml-2 px-2 py-1 bg-gray-700 text-xs">RATE</span>
                  </div>
                </div>
                <div className="ml-auto flex space-x-6">
                  <button className="flex flex-col items-center">
                    <span className="w-8 h-8 flex items-center justify-center">🎧</span>
                    <span className="text-xs text-gray-400">LISTEN</span>
                  </button>
                  <button className="flex flex-col items-center">
                    <span className="w-8 h-8 flex items-center justify-center">♡</span>
                    <span className="text-xs text-gray-400">LIKE</span>
                  </button>
                  <button className="flex flex-col items-center">
                    <span className="w-8 h-8 flex items-center justify-center">+</span>
                    <span className="text-xs text-gray-400">SAVE</span>
                  </button>
                </div>
              </div>
              <textarea
                className="w-full bg-gray-700 rounded p-3 text-white"
                rows="4"
                placeholder="Add a Review"
              ></textarea>
              <div className="flex items-center mt-4">
                <div className="flex items-center">
                  <button className="flex items-center text-gray-400 text-sm mr-4">
                    <span className="mr-1">☰</span> Add to List
                  </button>
                  <button className="flex items-center text-gray-400 text-sm mr-4">
                    <span className="mr-1">↗</span> Recommend
                  </button>
                  <button className="flex items-center text-gray-400 text-sm">
                    <span className="mr-1">🏷</span> Tag
                  </button>
                </div>
                <div className="ml-auto">
                  <button className="bg-gray-700 px-3 py-1 text-sm">POST</button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Additional Details and Track List */}
          <div>
            {/* Details Section */}
            <div className="bg-grids p-4 rounded mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">DETAILS</h3>
              </div>

              <div className="space-y-2">
                <p>
                  <span className="text-white">{albumData.release_date}</span>
                  <span className="text-gray-400">  release date</span>
                </p>
                <p>
                  <span className="text-white">{albumData.album_type}</span>
                  <span className="text-gray-400">  format</span>
                </p>
                <p>
                  <span className="text-white">{albumData.label || "N/A"}</span>
                  <span className="text-gray-400">  label</span>
                </p>
                {/* <p>
                  <span className="text-white">Hip-Hop/Rap, Trap</span>
                </p> */}
                {/* <p className="text-gray-400 text-sm">
                  Alternative Hip-Hop, Cloud Rap, Experimental
                </p> */}
                <p className="text-gray-400 text-sm">{albumData.genres ? albumData.genres : "N.A"}  genre</p>

                <p className="mt-4">
                  <span className="text-white">
                    {albumData.artists && albumData.artists.map(artist => artist.name).join(", ")}
                  </span>
                  <span className="text-gray-400">  artist</span>
                </p>
                <p>
                  <span className="text-white">
                    {albumData.copyrights && albumData.copyrights.map(copyright => copyright.text).join(", ")}
                  </span>
                  <span className="text-gray-400">  copyright</span>
                </p>
              </div>
            </div>

            {/* Track List Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">TRACK LIST</h3>
                <span className="text-sm text-gray-400">RATE TRACKS</span>
              </div>

              <div className="space-y-2">
                {/* Map through tracks */}
                {albumData.tracks && albumData.tracks.items && albumData.tracks.items.map((track, index) => (
                  <Link 
                    to={`/tracks/${track.trackId}`} 
                    key={track.trackId}
                    className="flex items-center hover:bg-grids p-2 rounded transition-colors"
                  >
                    <span className="w-6 text-gray-400">{index + 1}</span>
                    <div className="flex-grow">
                      <p className="font-medium">
                        {track.name} <span className="text-gray-400 text-sm">{formatDuration(track.duration_ms)}</span>
                      </p>
                      {track.artists && track.artists.length > 1 && (
                        <p className="text-sm text-blue-400">
                          feat. {track.artists.slice(1).map(artist => artist.name).join(", ")}
                        </p>
                      )}
                    </div>
                    <span className="bg-green-500 w-10 text-center font-medium">
                      {Math.floor(70 + Math.random() * 25)}
                    </span>
                  </Link>
                ))}

                <div className="text-gray-400 text-sm text-right mt-4">
                  Total Length: {calculateTotalDuration(albumData.tracks ? albumData.tracks.items : [])}
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">REVIEWS</h3>
                <span className="text-sm text-gray-400">{albumData.reviews ? albumData.reviews.length : 0} REVIEWS</span>
              </div>

              <div className="space-y-4">
                {albumData.reviews && albumData.reviews.map(review => (
                  <div key={review.reviewId} className="bg-grids p-4 rounded">
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-medium">{review.user.username}</p>
                      <p className="text-gray-400 text-sm">{new Date(review.createdAt).toLocaleDateString()}</p>
                    </div>
                    <p className="text-sm">{review.reviewText}</p>
                  </div>
                ))}

                {(!albumData.reviews || albumData.reviews.length === 0) && (
                  <div className="bg-grids p-4 rounded text-center">
                    <p className="text-gray-400">No reviews yet. Be the first to review this album!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlbumPage;
