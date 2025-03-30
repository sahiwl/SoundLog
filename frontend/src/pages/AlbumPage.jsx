// src/pages/AlbumPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import ActionForm from "../components/ActionForm.jsx";
import { toast } from 'react-toastify';
import { Heart } from "lucide-react";

const AlbumPage = () => {
  const { albumId } = useParams(); // album ID
  const [albumData, setAlbumData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

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

  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);
      const response = await axiosInstance.get(`/actions/review/${albumId}`);
      console.log("Reviews response:", response.data);
      // The reviews are inside response.data.reviews
      setReviews(response.data.reviews || []);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      toast.error("Error fetching reviews");
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleLikeReview = async (reviewId) => {
    try {
      const response = await axiosInstance.post(`/actions/review/like/${reviewId}`);
      toast.success("Review liked!");
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.reviewId === reviewId
            ? { ...review, likes: response.data.likes }
            : review
        )
      );
    } catch (err) {
      console.error("Error liking review:", err);
      toast.error("Error liking review.");
    }
  };

  useEffect(() => {
    if (albumId) {
      fetchAlbumDetails();
      fetchReviews();
    }
  }, [albumId]);

  if (loading) return <p>Loading album details...</p>;
  if (error) return <p>{error}</p>;
  if (!albumData) return <p>No album data found.</p>;


  const handleActionComplete=  ()=>{
    // Refresh album data after action is completed
    fetchAlbumDetails();
    fetchReviews(); // Refresh reviews after new action
  }

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

            <ActionForm albumId={albumId} onActionComplete={handleActionComplete} />

             {/* Reviews Section */}
             <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">REVIEWS</h3>
                <span className="text-sm text-gray-400">
                  {reviews?.length || 0} REVIEWS
                  
                </span>
              </div>

              <div className="space-y-4">
                {reviewsLoading ? (
                  <div className="col-span-full text-center">Loading reviews...</div>
                ) : reviews && reviews.length > 0 ? (
                  reviews.map(review => (
                    <div key={review.reviewId} className="bg-grids p-4 rounded">
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <p className="font-medium">{review.user.username}</p>
                          <p className="text-xs text-gray-400">User ID: {review.user.id}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-400 text-sm">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm mt-2">{review.reviewText}</p>
                      <div className="flex items-center justify-between mt-4">
                        <button
                          onClick={() => handleLikeReview(review.reviewId)}
                          className="flex items-center text-sm text-blue-400 hover:underline"
                        >
                          <Heart size={20}/>
                          {"  "}Like 
                        </button>
                        <span className="text-xs text-gray-400">{review.likes} likes</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full bg-grids p-4 rounded text-center">
                    <p className="text-gray-400">No reviews yet. Be the first to review this album!</p>
                  </div>
                )}
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

           
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlbumPage;
