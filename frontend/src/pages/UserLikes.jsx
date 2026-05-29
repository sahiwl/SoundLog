import { useParams } from "react-router-dom";
import Background from "../components/Background";
import PaginatedUserAlbumGrid from "../components/PaginatedUserAlbumGrid.jsx";
import PaginationControls from "../components/PaginationControls";
import { usePaginatedResource } from "../hooks/usePaginatedResource.js";

const UserLikes = () => {
  const { username } = useParams();
  const { items, loading, error, currentPage, totalPages, goToPage } =
    usePaginatedResource(username ? `/pages/${username}/likes` : null);

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
      imageUrl="https://c4.wallpaperflare.com/wallpaper/896/440/837/music-album-covers-the-beatles-abbey-road-wallpaper-preview.jpg"
      className="text-white pt-28 min-h-screen"
    >
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">{username}'s Liked Albums</h1>
        <PaginatedUserAlbumGrid albums={items} />
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
        />
      </div>
    </Background>
  );
};

export default UserLikes;
