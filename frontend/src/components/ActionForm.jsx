import React, { useState, useEffect } from "react";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-toastify";
import useAuthStore from "../store/useAuthStore";
import { Headphones, Heart, PlusCircle } from "lucide-react";

const ActionForm = ({ albumId, onActionComplete }) => {
  const { authUser } = useAuthStore(); // Get user from auth store
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [inputRating, setInputRating] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEditingRating, setIsEditingRating] = useState(false);

  const itemType = "albums"; // Fixed syntax

  useEffect(() => {
    // Fetch existing rating for the album
    const fetchRating = async () => {
      try {
        // Fixed URL construction to match backend route
        const response = await axiosInstance.get(
          `/actions/rate/${itemType}/${albumId}`
        );
        if (response.data && response.data.rating) {
          setRating(response.data.rating);
        }
      } catch (error) {
        console.error("Error fetching rating:", error);
      }
    };
    fetchRating();
  }, [albumId, itemType]);

  const handleLike = async () => {
    try {
      const resp = await axiosInstance.post(`/actions/like/${albumId}`);
      toast.success(resp.data.message);
      onActionComplete?.(); // Refreshes parent component
    } catch (error) {
      toast.error(error.response?.data?.message || "Error liking album");
    }
  };

  const handleToggleListened = async () => {
    try {
      const resp = await axiosInstance.post(`/actions/listen/${albumId}`);
      toast.success(resp.data.message);
      onActionComplete?.(); //refreshes parent component
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error marking album as listened"
      );
    }
  };

  const handleToggleListenLater = async () => {
    try {
      const resp = await axiosInstance.post(`/actions/listenLater/${albumId}`);
      toast.success(resp.data.message);
      onActionComplete?.(); //refreshes parent component
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error adding album to listen-later"
      );
    }
  };

  const handleSubmitRating = async () => {
    const ratingNum = parseInt(inputRating);
    if (isNaN(ratingNum) || ratingNum < 0 || ratingNum > 100) {
      toast.warn("Rating must be a number between 0 and 100");
      return;
    }
    setLoading(true);
    try {
      const resp = await axiosInstance.post(
        `/actions/rate/${itemType}/${albumId}`,
        { rating: ratingNum }
      );
      toast.success(resp.data.message);
      setRating(ratingNum);
      setInputRating('');
      setIsEditingRating(false);
      onActionComplete?.();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error rating this album.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRating = async () => {
    setLoading(true);
    try {
      const resp = await axiosInstance.delete(
        `/actions/rate/albums/${albumId}`
      );
      toast.success(resp.data.message);
      setRating(null);
      onActionComplete?.();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting rating.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!reviewText.trim()) {
      toast.warn("Cannot send an empty review");
      return;
    }

    setLoading(true);
    try {
      const resp = await axiosInstance.post(`/actions/review/${albumId}`, {
        reviewText: reviewText.trim(),
      });
      toast.success(resp.data.message);
      setReviewText("");
      onActionComplete?.();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error posting review");
    } finally {
      setLoading(false);
    }
  };

  const handleRatingInputChange = (e) => {
    setInputRating(e.target.value);
  };

  const handleKeyDown = (e) => {
    // Only handle Enter key, allow other keys to work normally
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmitRating();
    }
  };

  return (
    <div className="mt-8 bg-grids rounded p-4">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-gray-600 rounded-full mr-4"></div>
        <div>
          <p className="font-medium">
            User: {authUser?.username || "Anonymous"}
          </p>
          <div className="flex items-center">

              {isEditingRating || rating === 0 ? (
                <div className="">
                <input
                  value={inputRating}
                  onChange={handleRatingInputChange}
                  onKeyDown={handleKeyDown}
                  type="number"
                  min="0"
                  max="100"
                  placeholder="1-100"
                  className="bg-gray-700 rounded p-2 w-20 text-white"
                  />
                <button
                onClick={handleSubmitRating}
                disabled={loading}
                className="ml-2 px-2 py-1 bg-gray-700 text-xs"
                >
                {loading ? "Saving..." : "SAVE"}
              </button>
                  </div>
              ) : (
                <span className="font-bold text-white">
                  {rating}
                </span>
              )}

              {rating !== null && (
                <div className="flex justify-around p-2">
                  <button
                    onClick={() => setIsEditingRating(true)}
                    className="ml-2 px-2 py-1 bg-gray-700 text-xs"
                  >
                    EDIT
                  </button>
                  <button
                    onClick={handleDeleteRating}
                    disabled={loading}
                    className="px-3 py-1 ml-2 bg-gray-700 text-xs hover:bg-gray-600"
                  >
                    DELETE
                  </button>
                </div>
              )}
          </div>
        </div>
        <div className="ml-auto flex space-x-6">
          <button
            onClick={handleToggleListened}
            className="flex flex-col items-center"
          >
            <span className="w-8 h-8 flex items-center justify-center">
              <Headphones size={20} />
            </span>
            <span className="text-xs text-gray-400">LISTEN</span>
          </button>
          <button onClick={handleLike} className="flex flex-col items-center">
            <span className="w-8 h-8 flex items-center justify-center">
              <Heart size={20} />
            </span>
            <span className="text-xs text-gray-400">LIKE</span>
          </button>
          <button
            onClick={handleToggleListenLater}
            className="flex flex-col items-center"
          >
            <span className="w-8 h-8 flex items-center justify-center">
              <PlusCircle size={20} />
            </span>
            <span className="text-xs text-gray-400">SAVE</span>
          </button>
        </div>
      </div>

      <textarea
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        className="w-full bg-gray-700 rounded p-3 text-white"
        rows="4"
        placeholder="Add a Review"
      />

      <div className="flex items-center mt-4">
        <div className="ml-auto">
          <button
            onClick={handleSubmitReview}
            disabled={loading}
            className="bg-gray-700 px-3 py-1 text-sm hover:bg-gray-600"
          >
            {loading ? "Posting..." : "POST"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActionForm;
