import React, { useState } from 'react';
import { Heart, Pencil, Trash2, X } from "lucide-react";
import { axiosInstance } from "../lib/axios";
import { toast } from 'react-toastify';

const ReviewsSection = ({ reviews, userId, albumId, onReviewUpdate }) => {
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editedReviewText, setEditedReviewText] = useState("");

  const handleEditClick = (review) => {
    setEditingReviewId(review.reviewId);
    setEditedReviewText(review.reviewText);
  };

  const handleCancelEdit = () => {
    setEditingReviewId(null);
    setEditedReviewText("");
  };

  const handleDeleteReview = async () =>{
    try {
        const resp = await axiosInstance.delete(`/actions/review/${albumId}`)
        toast.success(resp.data.message)
        onReviewUpdate(); // refresh reviews
    } catch (error) {
        console.error("Error deleting review:", err);
        toast.error(resp.data.error)
    }
  }

  const handleUpdateReview = async () => {
    try {
      await axiosInstance.put(`/actions/review/${albumId}`, {
        reviewText: editedReviewText.trim()
      });

      onReviewUpdate();
      toast.success("Review updated successfully");
      setEditingReviewId(null);
      setEditedReviewText("");
    } catch (err) {
      console.error("Error updating review:", err);
      toast.error("Error updating review");
    }
  };

  const handleLikeReview = async (reviewId) => {
    try {
      const response = await axiosInstance.post(`/actions/review/like/${reviewId}`);
      toast.success(response.data.message);
      onReviewUpdate();
    } catch (err) {
      console.error("Error liking review:", err);
      toast.error("Error toggling like");
    }
  };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">REVIEWS</h3>
        <span className="text-sm text-gray-400">
          {reviews?.length || 0} REVIEWS
        </span>
      </div>

      <div className="space-y-4">
        {reviews.length > 0 ? (
          reviews.map(review => (
            <div key={review.reviewId} className="bg-grids p-4 rounded">
            {/* Review Header */}
                          <div className="flex justify-between items-center mb-2">
                            <div>
                              <p className="font-medium">{review.user.username}</p>
                              <p className="text-xs text-gray-400">User ID: {review.user.id}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              {review.user.id === userId && (
                                <button
                                  onClick={() => editingReviewId === review.reviewId ? handleCancelEdit() : handleEditClick(review)}
                                  className="text-gray-400 hover:text-white flex items-center gap-1"
                                >
                                  {editingReviewId === review.reviewId ? (
                                    <> <X size={16} /><span>Cancel</span> </>
                                  ) : (
                                    <><Pencil size={16} /><span>Edit</span> </>
                                  )}
                                </button>
                              )}
                              <p className="text-gray-400 text-sm">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          {/* Review Content */}
              {editingReviewId === review.reviewId ? (
                <div className="mt-2">
                  <textarea
                    value={editedReviewText}
                    onChange={(e) => setEditedReviewText(e.target.value)}
                    className="w-full bg-gray-700 rounded p-3 text-white mb-2"
                    rows="4"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={handleCancelEdit}
                      className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleUpdateReview()}
                      className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 rounded"
                    >
                      Update
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-sm mt-2">{review.reviewText}</p>
              )}

              {/* Like Section */}
              <div className="flex items-center justify-between mt-4">
                <div className='flex items-center gap-4'>

                <button
                  onClick={() => handleLikeReview(review.reviewId)}
                  className={`flex items-center gap-2 text-sm transition-colors ${
                      review.likedBy?.includes(userId) 
                      ? 'text-red-500' 
                      : 'text-gray-400 hover:text-red-500'
                    }`}
                    >
                  <Heart 
                    size={20} 
                    fill={review.likedBy?.includes(userId) ? "currentColor" : "none"}
                    className="transition-colors"
                    />
                  {review.likedBy?.includes(userId) ? 'Unlike' : 'Like'}
                </button>
                <button className='flex items-center gap-2 text-sm text-gray-400 hover:text-slate-100' onClick={()=> handleDeleteReview()}>
                    <Trash2 size={20} /> <span>delete</span>
                </button>
                    </div>
                <span className="text-xs text-gray-400">
                  {review.likes || 0} {review.likes === 1 ? 'like' : 'likes'}
                </span>
                
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
  );
};

export default ReviewsSection;
