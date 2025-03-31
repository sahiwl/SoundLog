import React, { useState, useEffect } from "react";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-toastify";
import useAuthStore from "../store/useAuthStore";
import { Headphones, Heart, HeartOff, PlusCircle, Save, Check, BookmarkIcon, Trash2 } from "lucide-react";

const RatingForm = ({ trackId, onActionComplete }) => {
  const { authUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [isEditingRating, setIsEditingRating] = useState(false);
  const [inputRating, setInputRating] = useState('');

  const [rating, setRating] = useState(null);

  const handleSubmitRating = async () => {
    const ratingNum = parseInt(inputRating);
    if (isNaN(ratingNum) || ratingNum < 0 || ratingNum > 100) {
      toast.warn("Rating must be a number between 0 and 100");
      return;
    }
    setLoading(true);
    try {
      const response = await axiosInstance.post(`/actions/rate/tracks/${trackId}`, { rating: ratingNum });
      setRating(ratingNum);
      setInputRating('');
      setIsEditingRating(false);
      toast.success("Rating updated successfully!");
      if (onActionComplete) onActionComplete();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update rating");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRating = async () => {
    if (!rating) return;
    
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
    setLoading(true);
    try {
      await axiosInstance.delete(`/actions/rate/tracks/${trackId}`);
      setRating(null);
      setIsEditingRating(false);
      toast.success("Rating deleted successfully!");
      if (onActionComplete) onActionComplete();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete rating");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
     const fetchActions = async () => {
       try {
         const response = await axiosInstance.get(`/actions/rate/tracks/${trackId}`);
         const { rating } = response.data;
         setRating(rating);
       } catch (error) {
         console.error("Error fetching actions:", error);
       }
     };
     fetchActions();
   }, [trackId]);

  return (
    <div className="mt-8 bg-grids rounded p-4">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-gray-600 rounded-full mr-4">
          {authUser.profilePic ? (
              <img src={authUser.profilePic} alt="" className="w-full h-full rounded-full object-cover" />
          ): (
<div className="w-full h-full flex items-center justify-center text-gray-400">
          {authUser?.username?.charAt(0).toUpperCase()}
  </div>
          )}
        </div>
        <div className="flex-grow">
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
                  className="bg-gray-700 rounded p-2 w-20 text-white"
                />
                <button
                  onClick={handleSubmitRating}
                  disabled={loading}
                  className="ml-2 px-2 py-1 bg-gray-700 text-xs"
                >
                  {loading ? "Saving..." : "RATE"}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="font-bold text-white">{rating}</span>
                <button
                  onClick={() => setIsEditingRating(true)}
                  className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs"
                >
                  EDIT
                </button>
                <button
                  onClick={handleDeleteRating}
                  disabled={loading}
                  className="p-1.5 bg-red-900/50 hover:bg-red-900 rounded text-red-300 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}
      </div>
      </div>
      </div>
    </div>
  );
};

export default RatingForm;
