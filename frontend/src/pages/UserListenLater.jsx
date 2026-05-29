import { useParams } from "react-router-dom";
import Background from "../components/Background";
import PaginatedUserAlbumGrid from "../components/PaginatedUserAlbumGrid";
import PaginationControls from "../components/PaginationControls";
import { usePaginatedResource } from "../hooks/usePaginatedResource.js";

const UserListenLater = () => {
  const { username } = useParams();
  const { items, loading, error, currentPage, totalPages, goToPage } =
    usePaginatedResource(username ? `/pages/${username}/listenlater` : null);

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
      imageUrl="https://images.complex.com/complex/image/upload/v1723827899/sanity-new/future-and-metro-boomin-turn-up-the-heat-with-we--5-2896-1712972245-0_16x9-7653775.jpg"
      className="text-white pt-28 min-h-screen"
    >
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">Listen Later</h1>
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

export default UserListenLater;
