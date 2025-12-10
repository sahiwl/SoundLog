import * as searchService from "../services/search.service.js";

export const searchAll = async (req, res) => {
  try {
    const searchQuery = req.query.query;

    const result = await searchService.searchAll(searchQuery);

    res.json(result);
  } catch (error) {
    console.error("Error in searchAll:", error.message);
    if (error.message.includes("required")) {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// searchTracks - Searches Spotify for tracks by name.
// Endpoint: GET /api/spotify/search/track?name=Song+Name
export const searchTracks = async (req, res) => {
  try {
    const trackName = req.query.name;

    const result = await searchService.searchTracks(trackName);
    return res.json(result);
  } catch (error) {
    console.error("Error in searchTracks:", error.message);
    if (error.message.includes("required")) {
      return res.status(400).json({ message: error.message });
    }
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

    const result = await searchService.searchAlbums(albumName);

    return res.json(result);
  } catch (error) {
    console.error("Error in searchAlbums:", error.message);
    if (error.message.includes("required")) {
      return res.status(400).json({ message: error.message });
    }
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

    const result = await searchService.searchArtists(artistName);

    return res.json(result);
  } catch (error) {
    console.error("Error in searchArtists:", error.message);
    if (error.message.includes("required")) {
      return res.status(400).json({ message: error.message });
    }
    return res
      .status(500)
      .json({ message: "Error fetching artists from Spotify" });
  }
};
