import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { axiosInstance } from "../lib/axios.js";
import RatingForm from "../components/RatingForm.jsx";
import Background from '../components/Background.jsx';

const TrackPage = () => {
  const { trackId } = useParams();
  const [trackData, setTrackData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTrackDetails = async () => {
    try {
      setLoading(true);
      setError("");  
      const response = await axiosInstance.get(`/pages/tracks/${trackId}`, {
        withCredentials: true,
      });
      if (response.data && response.data.track) {
        setTrackData(response.data.track);
      } else {
        setError("Invalid response format");
      }
    } catch (err) {
      console.error("Error fetching track:", err);
      setError(err.response?.data?.message || "Error fetching track details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (trackId) fetchTrackDetails();
  }, [trackId]);

  if (loading) return <div className="flex justify-center items-center min-h-screen "> <div className="loading loading-infinity loading-xl"></div> </div>
  if (error) return <p>{error}</p>;
  if (!trackData) return <p>No track data found.</p>;

  function formatDuration(ms) {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  return (
    <Background imageUrl={trackData?.album?.images?.[0]?.url}>
      <div className="container mx-auto px-4 py-6 pt-28">
        

        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Track Info */}
            <div className="lg:col-span-2">
              {/* Artist and Track Title */}
              <div className="mb-6">
                <h1 className="text-2xl font-medium">
                {trackData.artists.map((artist, i) => (
                  <Link 
                    key={artist.id}
                    to={`/artist/${artist.spotifyId}`} 
                    className="hover:text-purple-400 transition-colors"
                  >
                    {i > 0 ? ', ' : ''}{artist.name}
                  </Link>
                )
              )}
                </h1>
                <h2 className="text-4xl font-bold">{trackData.name}</h2>
                <p className="text-gray-400 mt-2">
                  Track {trackData.track_number} on{" "}
                  <a href={`/album/${trackData.album?.spotifyId}`} className="text-blue-400 hover:underline">
                    {trackData.album?.name}
                  </a>
                </p>
              </div>


              <div className="flex flex-col md:flex-row gap-6">
                {/* Album Cover */}
                <div className="flex-shrink-0">
                  <img
                    src={trackData.album?.images?.[0]?.url}
                    alt={`${trackData.name} cover`}
                    className="w-full max-w-[350px] rounded-lg"
                  />

                  <div className="flex mt-4 space-x-2">
                    <a 
                      href={trackData.external_urls?.spotify} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="bg-grids text-white px-3 py-2 rounded flex items-center space-x-2"
                    >
                      <span>Spotify</span>
                    </a>
                  </div>
                </div>

                {/* Scores */}
                <div className="flex-grow">
                  <div className="bg-grids p-4 rounded">
                    <h3 className="text-sm font-medium mb-2">Popularity</h3>
                    <div className="flex items-end mb-2">
                      <span className="text-6xl font-bold">{trackData.popularity}</span>
                      <div className="ml-4">
                        <p className="text-sm">out of 100</p>
                        <p className="text-sm text-gray-400">Track {trackData.track_number} on album</p>
                      </div>
                    </div>
                    <div className="h-1 bg-green-500 w-3/4 mt-2"></div>
                  </div>
                </div>
              </div>


              <RatingForm 
              trackId={trackId}
              />
            </div>

            {/* Right Column */}
            <div>

              <div className="bg-grids p-4 rounded mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">SONG INFO</h3>
                </div>

                <div className="space-y-2">
                  <p>
                    <span className="text-white">Track #{trackData.track_number}</span>
                    <span className="text-gray-400"> on {trackData.album?.name}</span>
                  </p>
                  <p>
                    <span className="text-white">{trackData.album?.release_date}</span>
                    <span className="text-gray-400"> / year</span>
                  </p>
                  <p>
                    <span className="text-white">{formatDuration(trackData.duration_ms)}</span>
                    <span className="text-gray-400"> / duration</span>
                  </p>
                  {trackData.artists?.map((artist, index) => (
                    <p key={artist.spotifyId}>
                      <span className="text-white">{artist.name}</span>
                      <span className="text-gray-400"> / {index === 0 ? 'primary artist' : 'feature'}</span>
                    </p>
                  ))}
                  <p>
                    <span className="text-white">{trackData.explicit ? 'Yes' : 'No'}</span>
                    <span className="text-gray-400"> / explicit</span>
                  </p>
                </div>
              </div>


              <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">USER RATINGS</h3>
                  <span className="text-sm text-gray-400">
                    {trackData.ratings?.length || 0} RATINGS
                  </span>
                </div>

                <div className="space-y-4">
                  {trackData.ratings?.map(rating => (
                    <div key={rating._id} className="bg-grids p-4 rounded">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{rating.user?.username}</p>
                          <p className="text-sm text-gray-400">
                            {new Date(rating.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="bg-green-500 px-2 py-1 rounded">
                          {rating.rating}
                        </div>
                      </div>
                    </div>
                  ))}

                  {(!trackData.ratings || trackData.ratings.length === 0) && (
                    <div className="bg-grids p-4 rounded text-center">
                      <p className="text-gray-400">No ratings yet. Be the first to rate this track!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Background>
  );
};

export default TrackPage;