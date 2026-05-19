import { Link } from "react-router-dom";
import AlbumImage from "./AlbumImage.jsx";

const PaginatedUserAlbumGrid = ({ albums }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {albums.map((album) => (
      <Link
        to={`/album/${album.albumId}`}
        key={album.albumId}
        className="group relative rounded-lg overflow-hidden"
      >
        <AlbumImage
          src={album.images?.[0]?.url}
          alt={album.name}
          size={300}
          className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="absolute bottom-0 w-full p-4">
            <h3 className="text-white font-medium truncate">{album.name}</h3>
            <p className="text-gray-300 text-sm truncate">
              {album.artists?.[0]?.name}
            </p>
          </div>
        </div>
      </Link>
    ))}
  </div>
);

export default PaginatedUserAlbumGrid;
