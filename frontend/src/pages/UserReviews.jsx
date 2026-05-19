import { Link, useParams } from "react-router-dom";
import Background from "../components/Background.jsx";
import AlbumImage from "../components/AlbumImage.jsx";
import PaginationControls from "../components/PaginationControls.jsx";
import { usePaginatedResource } from "../hooks/usePaginatedResource.js";

const UserReviews = () => {
  const { username } = useParams();
  const { items, loading, error, currentPage, totalPages, goToPage } =
    usePaginatedResource(username ? `/pages/${username}/reviews` : null);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loading loading-infinity loading-xl" />
      </div>
    );
  }

  if (error) return <p className="pt-28 px-4">{error}</p>;

  return (
    <Background
      imageUrl="https://imgix.bustle.com/uploads/image/2021/8/31/9043e78c-a96c-49c5-a19d-e4efde485bcf-drake-certified-lover-boy.jpeg?w=374&h=285&fit=crop&crop=faces&dpr=2"
      className="text-white pt-28 min-h-screen"
    >
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">{username}'s Reviews</h1>
        <div className="space-y-6">
          {items.map((review) => (
            <div
              key={review._id}
              className="bg-grids rounded-lg p-4 hover:bg-gray-800 transition-colors"
            >
              <Link to={`/album/${review.albumId}`} className="block">
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    {review.albumImage && (
                      <AlbumImage
                        src={review.albumImage}
                        alt={review.albumTitle}
                        size={64}
                        className="w-16 h-16 object-cover rounded shrink-0"
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
                    <span
                      className={
                        review.rating === "NA" ? "text-gray-500" : "text-green-500"
                      }
                    >
                      {review.rating === "NA" ? "Not Rated" : `${review.rating}`}
                    </span>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-gray-300">
                    {review.reviewText || "No review text provided."}
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
        />
      </div>
    </Background>
  );
};

export default UserReviews;
