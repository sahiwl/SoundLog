const ALBUM_PLACEHOLDER = "/album-placeholder.svg";

const AlbumImage = ({
  src,
  alt = "Album cover",
  size = 300,
  className = "",
}) => (
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
