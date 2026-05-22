import { useEffect, useState } from "react";

const UserAvatar = ({
  username = "?",
  src,
  size = 32,
  className = "",
  textClassName = "",
}) => {
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    setErrored(false);
  }, [src]);

  const initial = username?.charAt(0)?.toUpperCase() || "?";
  const showImage = src && !errored;

  const baseClass = `rounded-full overflow-hidden flex items-center justify-center shrink-0 ${className}`;
  const dimensions = { width: size, height: size };

  if (showImage) {
    return (
      <img
        src={src}
        alt={username}
        width={size}
        height={size}
        loading="lazy"
        decoding="async"
        onError={() => setErrored(true)}
        className={`object-cover ${baseClass}`}
        style={dimensions}
      />
    );
  }

  return (
    <div
      className={`bg-gray-600 text-white font-semibold ${baseClass} ${textClassName}`}
      style={dimensions}
      aria-label={username}
    >
      {initial}
    </div>
  );
};

export default UserAvatar;
