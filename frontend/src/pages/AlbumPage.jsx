import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { axiosInstance } from "../lib/axios.js";
import ActionForm from "../components/ActionForm.jsx";
import { showToast } from "../lib/toastConfig.js";
import ReviewsSection from '../components/ReviewsSection.jsx';
import Background from '../components/Background.jsx';

const AlbumPage = () => {
  const { albumId } = useParams(); 
  const [albumData, setAlbumData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [trackRatings, setTrackRatings] = useState({});

  const fetchAlbumDetails = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/pages/albums/${albumId}`, { 
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
      // console.log("Reviews response:", response.data);

      setReviews(response.data.reviews || []);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      showToast.error("Error fetching reviews");
    } finally {
      setReviewsLoading(false);
    }
  };

  const fetchTrackRatings = async (tracks) => {
    try {
      const ratings = await Promise.all(
        tracks.map(async (track) => {
          try {
            const response = await axiosInstance.get(`/actions/tracks/${track.trackId}`);
            return { [track.trackId]: response.data.rating };
          } catch (error) {
            console.error(`Error fetching rating for track ${track.trackId}:`, error);
            return { [track.trackId]: "NA" };
          }
        })
      );
      
      setTrackRatings(Object.assign({}, ...ratings));
    } catch (error) {
      console.error("Error fetching track ratings:", error);
    }
  };

  useEffect(() => {
    if (albumId) {
      fetchAlbumDetails();
      fetchReviews();
    }
  }, [albumId]);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axiosInstance.get('/auth/check');
        setUserId(response.data._id);
      } catch (err) {
        console.error('Error fetching current user:', err);
      }
    };
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (albumData?.tracks?.items) {
      fetchTrackRatings(albumData.tracks.items);
    }
  }, [albumData]);

  if (loading) return <div className="flex justify-center items-center min-h-screen "> <div className="loading loading-infinity loading-xl"></div> </div>
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
    <Background imageUrl={albumData?.images?.[0]?.url}>
      <div className="container mx-auto px-4 py-6 pt-28">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Album Info */}
          <div className="lg:col-span-2">
            {/* Artist and Album Title */}
            <div className="mb-6">
              <h1 className="text-2xl font-medium">
                {albumData.artists.map((artist, i) => (
                  <Link 
                    key={artist.id}
                    to={`/artist/${artist.spotifyId}`} 
                    className="hover:text-purple-400 transition-colors"
                  >
                    {i > 0 ? ', ' : ''}{artist.name}
                  </Link>
                ))}
              </h1>
              <h2 className="text-4xl font-bold">{albumData.name}</h2>
            </div>


            <div className="flex flex-col md:flex-row gap-6">
              {/* Album Cover */}
              <div className="flex-shrink-0">
                <img
                  src={albumData.images[0]?.url}
                  alt={`${albumData.name} cover`}
                  className="w-full max-w-[350px] rounded-lg"
                />

                <div className="flex mt-4 space-x-2">
                  <a href={albumData.external_urls.spotify} target="_blank" rel="noreferrer" className="bg-grids text-white px-3 py-2 rounded flex items-center space-x-2">
                    <span>Spotify</span>
                  </a>
                </div>
              </div>

              {/* Scores */}
              <div className="flex-grow">

                        <div className="bg-grids p-4 rounded">
                          <h3 className="text-sm font-medium mb-2">Popularity</h3>
                          <div className="flex items-end mb-2">
                          <span className="text-6xl font-bold">{albumData?.popularity}</span>
                          <div className="ml-4">
                            <p className="text-sm">out of 100</p>
                            {/* <p className="text-sm text-gray-400">2016 Rank: #581</p> */}
                          </div>
                          </div>
                          <div className="h-1 bg-green-500 w-3/4 mt-2"></div>
                        </div>
                        </div>
                      </div>

                      <ActionForm albumId={albumId} onActionComplete={handleActionComplete} />

                      {reviewsLoading ? (
                        <div className="text-center mt-6">Loading reviews...</div>
                      ) : (
                        <ReviewsSection 
                        reviews={reviews}
                        userId={userId}
                        albumId={albumId}
                        onReviewUpdate={fetchReviews}
                        />
                      )}
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
            <div className="bg-grids">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold px-4 pt-4">TRACK LIST</h3>
                {/* <span className="text-sm text-gray-400">RATE TRACKS</span> */}
              </div>

              <div className="space-y-2 ">
                {/* Map through tracks */}
                {albumData.tracks && albumData.tracks.items && albumData.tracks.items.map((track, index) => (
                  <div key={track.trackId} className="flex items-center justify-between py-2 px-6 hover:bg-">
                    <div className="flex items-center gap-4">
                      <span className="text-gray-400 w-8 text-right">{track.track_number}</span>
                      <Link to={`/tracks/${track.trackId}`} className="hover:underline">
                        {track.name}
                      </Link>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="px-2 text-gray-400">
                        {trackRatings[track.trackId] ? `${trackRatings[track.trackId]}` : "NA"}
                      </span>
                      <span className="text-gray-400">
                        {formatDuration(track.duration_ms)}
                      </span>
                    </div>
                  </div>
                ))}

                <div className="text-gray-400 text-sm text-right m-4">
                  Total Length: {calculateTotalDuration(albumData.tracks ? albumData.tracks.items : [])}
                </div>
              </div>
            </div>   
          </div>
        </div>
      </div>
    </Background>
  );
};

export default AlbumPage;
