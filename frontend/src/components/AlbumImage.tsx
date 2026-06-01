const ALBUM_PLACEHOLDER = "/album-placeholder.svg";

interface AlbumImageProps {
  src?: string | null;
  alt?: string;
  size?: number;
  className?: string;
}

const AlbumImage = ({src,alt = "Album cover",size = 300,className = ""}: AlbumImageProps) => (
  <img
    src={src || ALBUM_PLACEHOLDER}
    alt={alt}
    width={size}
    height={size}
    loading="lazy"
    decoding="async"
    className={className}
  />
);

export default AlbumImage;
export { ALBUM_PLACEHOLDER };
