import React, { useState, useEffect } from "react";
import { axiosInstance } from "../lib/axios";
import { showToast } from '../lib/toastConfig';
import useAuthStore from "../store/useAuthStore";
import { Headphones, Heart, HeartOff, PlusCircle, Save, Check, BookmarkIcon, Trash2 } from "lucide-react";

const ActionForm = ({ albumId, onActionComplete }) => {

  const { authUser } = useAuthStore();
  const [reviewText, setReviewText] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEditingRating, setIsEditingRating] = useState(false);
  const [inputRating, setInputRating] = useState('');

  // const isOwnProfile = authUser?.username === username

  // States from getActions
  const [listened, setListened] = useState(false);
  const [liked, setLiked] = useState(false);
  const [listenLater, setListenLater] = useState(false);
  const [rating, setRating] = useState(null);
  const [reviewed, setReviewed] = useState(false);




  useEffect(() => {
    const fetchActions = async () => {
      try {
        const response = await axiosInstance.get(`/actions/albums/${albumId}`);
        const { listened, liked, listenLater, rating, reviewed } = response.data;
        setListened(listened);
        setLiked(liked);
        setListenLater(listenLater);
        setRating(rating);
        setReviewed(reviewed);
      } catch (error) {
        console.error("Error fetching actions:", error);
      }
    };
    fetchActions();
  }, [albumId]);

  const handleAction = async (actionType) => {
    try {
      setLoading(true);
      let endpoint;
      let newState;
      
      switch (actionType) {
        case 'like':
          endpoint = `/actions/like/${albumId}`;
          newState = !liked;
          setLiked(newState);
          break;
        case 'listen':
          endpoint = `/actions/listen/${albumId}`;
          newState = !listened;
          setListened(newState);
          break;
        case 'listenLater':
          endpoint = `/actions/listenLater/${albumId}`;
          newState = !listenLater;
          setListenLater(newState);
          break;
        default:
          return;
      }

      const response = await axiosInstance.post(endpoint);
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || `Error updating ${actionType}`);
      // Revert state on error
      switch (actionType) {
        case 'like': setLiked(!liked); break;
        case 'listen': setListened(!listened); break;
        case 'listenLater': setListenLater(!listenLater); break;
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitRating = async () => {
    const ratingNum = parseInt(inputRating);
    if (isNaN(ratingNum) || ratingNum < 0 || ratingNum > 100) {
      showToast.warn("Rating must be a number between 0 and 100");
      return;
    }
    setLoading(true);
    try {
      await axiosInstance.post(`/actions/rate/albums/${albumId}`, { rating: ratingNum });
      setRating(ratingNum);
      setInputRating('');
      setIsEditingRating(false);
    } catch (error) {
      showToast.error(error.response?.data?.message || "Error rating album");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!reviewText.trim()) {
      showToast.warn("Cannot send an empty review");
      return;
    }

    setLoading(true);
    try {
      const resp = await axiosInstance.post(`/actions/review/${albumId}`, {
        reviewText: reviewText.trim(),
      });
      showToast.success(resp.data.message);
      setReviewText("");
      onActionComplete?.();
    } catch (error) {
      showToast.error(error.response?.data?.message || "Error posting review");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRating = () => {
    const toastId = toast.info(
      <div>
        <p>Delete this rating?</p>
        <div className="mt-2 flex justify-end gap-2">
          <button
            onClick={() => {
              deleteRating();
              toast.dismiss(toastId);
            }}
            className="px-3 py-1 bg-red-500 text-white rounded text-sm"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss(toastId)}
            className="px-3 py-1 bg-gray-500 text-white rounded text-sm"
          >
            Cancel
          </button>
        </div>
      </div>,
      { autoClose: false, closeButton: false }
    );
  };

  const deleteRating = async () => {
    try {
      await axiosInstance.delete(`/actions/rate/albums/${albumId}`);
      setRating(null);
      setIsEditingRating(false);
      showToast.success("Rating deleted successfully!");
    } catch (error) {
      showToast.error(error?.response?.data?.message || "Failed to delete rating");
    }
  };

  return (
    <div className="mt-8 bg-grids rounded p-4">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-gray-600 rounded-full mr-4">{authUser?.profilePic ? (
          <img src={authUser.profilePic} alt="" className="w-full h-full rounded-full object-cover"/>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
        {authUser?.username?.charAt(0).toUpperCase()}
      </div>
        )}</div>
        <div>
          <p className="font-medium">{authUser?.username || "Anonymous"}</p>
          <div className="flex items-center">
            {isEditingRating || !rating ? (
              <div className="">
                <input
                  value={inputRating}
                  onChange={(e) => setInputRating(e.target.value)}
                  type="number"
                  min="0"
                  max="100"
                  placeholder="1-100"
                  className=" bg-grids rounded p-2 w-20 text-white"
                />
                <button
                  onClick={handleSubmitRating}
                  disabled={loading}
                  className="ml-2 px-2 py-1 bg-grids text-xs"
                >
                  {loading ? "Saving..." : "RATE"}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <span className="font-bold text-white">{rating}</span>
                <button
                  onClick={() => setIsEditingRating(true)}
                  className="ml-2 px-2 py-1 bg-gray-700 text-xs rounded-md"
                >
                  EDIT
                </button>
                <button
                  onClick={handleDeleteRating}
                  className="p-1.5 bg-red-900/50 hover:bg-red-900 rounded text-red-300 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="ml-auto flex space-x-6">
          <button
            onClick={() => handleAction('listen')}
            className="flex flex-col items-center"
            disabled={loading}
          >
            <span className="w-8 h-8 flex items-center justify-center">
              <Headphones size={20} className={listened ? "text-green-500" : ""} />
            </span>
            <span className="text-xs text-gray-400">
              {listened ? 'LISTENED' : 'LISTEN'}
            </span>
          </button>

          <button
            onClick={() => handleAction('like')}
            className="flex flex-col items-center"
            disabled={loading}
          >
            <span className="w-8 h-8 flex items-center justify-center">
              {liked ? <Heart fill="currentColor" size={20} className="text-red-500" /> : <HeartOff size={20} />}
            </span>
            <span className="text-xs text-gray-400">
              {liked ? 'LIKED' : 'LIKE'}
            </span>
          </button>

          <button
            onClick={() => handleAction('listenLater')}
            className="flex flex-col items-center"
            disabled={loading}
          >
            <span className="w-8 h-8 flex items-center justify-center">
              {listenLater ? <Check size={20} className="text-green-500" /> : <BookmarkIcon size={20} />}
            </span>
            <span className="text-xs text-gray-400">
              {listenLater ? 'ListenLater' : 'ListenLater'}
            </span>
          </button>
        </div>
      </div>

      <textarea
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        className="w-full bg-gra-700 rounded p-3 bg-grids text-white"
        rows="4"
        placeholder="Add a Review"
      />

      <div className="flex items-center mt-4">
        <div className="ml-auto">
          <button
            onClick={handleSubmitReview}
            disabled={loading}
            className="bg-grids px-3 py-1 text-sm hover:bg-gray-600"
          >
            {loading ? "Posting..." : "POST"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActionForm;
