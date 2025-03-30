// src/components/FullScreenSearch.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-toastify";

const FullScreenSearch = ({ query, onClose }) => {
  const [results, setResults] = useState({ tracks: [], albums: [], artists: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) return;
      try {
        setLoading(true);
        setError("");
        // Combined search endpoint returning tracks, albums, artists
        const response = await axiosInstance.get("/releases/search", {
          params: { query: query, limit: 10 }, // Changed from 'name' to 'query'
        });
        setResults(response.data);
        // setResults({
        //   tracks: response.data.tracks?.items || [],
        //   albums: response.data.albums?.items || [],
        //   artists: response.data.artists?.items || [],
        // });
      } catch (err) {
      toast.error("Search error:", err);
        setError("Error fetching search results.");
      } finally {
        setLoading(false);
      }
    };
    fetchSearchResults();
  }, [query]);

  // Identify top result (could be track or album or artist). 
  // For demo, let's pick the first track if available, else first album, else first artist.
//   let topResult = null;
//   if (results.tracks.length > 0) {
//     topResult = { ...results.tracks[0], type: "track" };
//   } else if (results.albums.length > 0) {
//     topResult = { ...results.albums[0], type: "album" };
//   } else if (results.artists.length > 0) {
//     topResult = { ...results.artists[0], type: "artist" };
//   }

const getDetailLink = (item, type) => {
    if (type === "track") return `/tracks/${item.id}`;
    if (type === "album") return `/album/${item.id}`;
    if (type === "artist") return `/artist/${item.id}`;
    return "#";
  };

  return (
    <div className="fixed inset-0 bg-base-100 bg-opacity-95 z-50 overflow-auto p-8">
      <button
        className="btn btn-circle absolute top-4 right-4"
        onClick={onClose}
      >
        ✕
      </button>
      <h1 className="text-3xl font-bold mb-4">Search Results for "{query}"</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <div>
          {results.tracks.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Tracks</h2>
              <ul className="menu bg-base-100 rounded-box p-2">
                {results.tracks.map((track) => (
                  <li key={track.id}>
                    <Link to={getDetailLink(track, "track")} onClick={onClose}>
                      {track.name} - {track.artists.map(a => a.name).join(", ")}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {results.albums.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Albums</h2>
              <ul className="menu bg-base-100 rounded-box p-2">
                {results.albums.map((album) => (
                  <li key={album.id}>
                    <Link to={getDetailLink(album, "album")} onClick={onClose}>
                      {album.name} - {album.artists.map(a => a.name).join(", ")}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {results.artists.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Artists</h2>
              <ul className="menu bg-base-100 rounded-box p-2">
                {results.artists.map((artist) => (
                  <li key={artist.id}>
                    <Link to={getDetailLink(artist, "artist")} onClick={onClose}>
                      {artist.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="mt-4">
            <Link
              to={`/search?query=${encodeURIComponent(query)}`}
              onClick={onClose}
              className="btn btn-outline w-full"
            >
              See All Results
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default FullScreenSearch;
