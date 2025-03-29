import { searchSpotifyData } from "../lib/pullSpotifyData.js";
import Album from "../models/album.model.js";
import Track from "../models/track.model.js";

export const searchAll = async (req, res) => {
  try {
    const searchQuery = req.query.query; // Changed from 'name' to 'query'

    if (!searchQuery) {
      return res
        .status(404)
        .json({ message: "Query parameter 'query' is required" });
    }
    // Request tracks, albums, artists simultaneously
    const data = await searchSpotifyData("search", {
      q: searchQuery,
      type: "track,album,artist",
      market: "IN",
      limit: 5, // for the dropdown, we can limit to fewer results
    });

    // Return partial data from each category
    res.json({
      tracks: data.tracks?.items || [],
      albums: data.albums?.items || [],
      artists: data.artists?.items || [],
    });
  } catch (error) {
    console.error("Error in searchAll:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// searchTracks - Searches Spotify for tracks by name.
// Endpoint: GET /api/spotify/search/track?name=Song+Name
export const searchTracks = async (req, res) => {
  try {
    const trackName = req.query.name;
    if (!trackName) {
      res.status(400).json({ message: `Query parameter "name" is required.` });
    }

    //use spotify search endpoint for tracks
    const data = await searchSpotifyData("search", {
      q: trackName,
      type: "track",  
      market: "IN",
      limit: 10,
    });
    return res.json(data);
  } catch (error) {
    console.error("Error in searchTracks:", error.message);
    return res
      .status(500)
      .json({ message: "Error fetching tracks from Spotify." });
  }
};

//  searchAlbums - Searches Spotify for albums by name.
//  Endpoint: GET /api/spotify/search/album?name=Album+Name

export const searchAlbums = async (req, res) => {
  try {
    const albumName = req.query.name;
    if (!albumName) {
      return res
        .status(400)
        .json({ message: `Query parameter "name" is required.` });
    }

    //using spotify search endpoint for albums
    const data = await searchSpotifyData("search", {
      q: albumName,
      type: "album",
      market: "IN",
      limit: 10,
    });

    return res.json(data.albums);
  } catch (error) {
    console.error("Error in searchAlbums:", error.message);
    return res
      .status(500)
      .json({ message: "Error fetching albums from Spotify." });
  }
};

// searchArtists - Searches Spotify for artists by name.
// Endpoint: GET /api/spotify/search/artist?name=Artist+Name

export const searchArtists = async (req, res) => {
  try {
    const artistName = req.query.name;
    if (!artistName) {
      return res
        .status(400)
        .json({ message: `Query parameter "name" is required.` });
    }

    // Use the Spotify search endpoint for artists.
    const data = await searchSpotifyData("search", {
      q: artistName,
      type: "artist",
      market: "IN",
      limit: 10,
    });

    return res.json(data.artists);
  } catch (error) {
    console.error("Error in searchArtists:", error.message);
    return res
      .status(500)
      .json({ message: "Error fetching artists from Spotify" });
  }
};
