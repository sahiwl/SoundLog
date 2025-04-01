import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import Background from "../components/Background";

const UserReviews = () => {
  const { username } = useParams();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUserReviews = async (page = 1) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/pages/${username}/reviews`, {
        params: { page },
      });
      setReviews(response.data.reviews);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.error("Error fetching user reviews:", err);
      setError("Failed to load reviews.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (username) fetchUserReviews();
  }, [username]);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      fetchUserReviews(page);
    }
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen "> <div className="loading loading-infinity loading-xl"></div> </div>
  if (error) return <p>{error}</p>;

  return (
    <Background imageUrl={"https://imgix.bustle.com/uploads/image/2021/8/31/9043e78c-a96c-49c5-a19d-e4efde485bcf-drake-certified-lover-boy.jpeg?w=374&h=285&fit=crop&crop=faces&dpr=2"} className="text-white pt-15 min-h-screen">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">{username}'s Reviews</h1>
        <div className="space-y-6">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="bg-grids rounded-lg p-4 hover:bg-gray-800 transition-colors"
            >
              <Link to={`/album/${review.albumId}`} className="block">
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    {review.albumImage && (
                      <img 
                        src={review.albumImage} 
                        alt={review.albumTitle}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                    <div>
                      <h2 className="text-xl font-bold">{review.albumTitle}</h2>
                      <p className="text-gray-400 text-sm">
                        {new Date(review.releaseDate).getFullYear()}
                      </p>
                    </div>
                  </div>
                  <div className="text-lg font-bold">
                    <span className={review.rating === "NA" ? "text-gray-500" : "text-green-500"}>
                      {review.rating === "NA" ? "Not Rated" : `${review.rating}`}
                    </span>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-gray-300">{review.reviewText || "No review text provided."}</p>
                  <p className="text-gray-500 text-sm mt-2">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            </div>
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
    </Background>
  );
};

export default UserReviews;
