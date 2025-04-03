import React, { useEffect, useRef, useState } from 'react';
import { Link } from "react-router-dom";
import { axiosInstance } from "../lib/axios.js";
import { showToast } from "../lib/toastConfig.js";
import { X } from 'lucide-react';
import Background from "./Background";

// Result section component
const ResultSection = ({ title, items, type, onClose }) => {
  if (!items?.length) return null;
  
  const getLink = (item) => {
    const paths = {
      track: `/tracks/${item.id}`,
      album: `/album/${item.id}`,
      artist: `/artist/${item.id}`
    };
    return paths[type];
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4 text-soundlog-purple">{title}</h2>
      <div className="space-y-2">
        {items.map((item) => (
          <Link
            key={item.id}
            to={getLink(item)}
            onClick={onClose}
            className="block p-3 hover:bg-purple-400/10 rounded-lg transition-colors"
          >
            <div className="text-white">{item.name}</div>
            {(type !== 'artist' && item.artists) && (
              <div className="text-gray-400 text-sm">
                {item.artists.map(a => a.name).join(', ')}
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

const FullScreenSearch = ({ query = '', onClose }) => {
  const [searchQuery, setSearchQuery] = useState(query);
  const [results, setResults] = useState({ tracks: [], albums: [], artists: [] });
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        setLoading(true);
        axiosInstance.get("/releases/search", {
          params: { query: searchQuery, limit: 10 }
        })
          .then(response => setResults(response.data))
          .catch(() => showToast.error("Search failed. Please try again."))
          .finally(() => setLoading(false));
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    searchRef.current?.focus();
    return () => document.body.style.overflow = 'unset';
  }, []);

  return (
    <Background imageUrl="/thursday.jpg" className="fixed inset-0 z-50">
      <div className="container mx-auto px-4 pt-24">
        <div className="relative flex items-center">
          <input
            ref={searchRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for albums, artists, or tracks..."
            className="w-full p-4 bg-grids border rounded-lg text-gray-300 text-xl focus:outline-none"
            onKeyDown={(e) => e.key === 'Escape' && onClose()}
          />
          <button onClick={onClose} className="absolute right-4 text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        
        <div className="mt-8 max-h-[70vh] overflow-y-auto">
          {loading ? (
            <div className="text-center text-gray-400">Searching...</div>
          ) : (
            <div className="flex flex-col md:flex-row md:gap-8">
              <div className="flex-1">
                <ResultSection title="Tracks" items={results.tracks} type="track" onClose={onClose} />
                <ResultSection title="Albums" items={results.albums} type="album" onClose={onClose} />
                <div className="md:hidden">
                  <ResultSection title="Artists" items={results.artists} type="artist" onClose={onClose} />
                </div>
              </div>
              <div className="hidden md:block w-140">
                <ResultSection title="Artists" items={results.artists} type="artist" onClose={onClose} />
              </div>
            </div>
          )}
        </div>
      </div>
    </Background>
  );
};

export default FullScreenSearch;
