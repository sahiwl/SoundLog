// src/components/Background.jsx
import React from "react";

const Background = ({ children, imageUrl, className }) => (
  <div className={`min-h-screen relative flex bg-back ${className}`}>
    <div 
      className="absolute inset-0 -z-10"
      style={{
        backgroundImage: `url("${imageUrl || '/placeholder.svg'}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'blur(4px) brightness(0.2)', // Increased blur and darkening
        transform: 'scale(1.2)', // Increased scale to prevent blur edges
      }}
    />
    <div className="relative z-10 w-full">
      {children}
    </div>
  </div>
);

export default Background;
