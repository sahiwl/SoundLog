import * as searchService from "../services/search.service.js";

export const searchAll = async (req, res) => {
    const result = await searchService.searchAll(req.query.query);
    res.json(result);
};

export const searchTracks = async (req, res) => {
    const result = await searchService.searchTracks(req.query.name);
    res.json(result);
};

//  searchAlbums - Searches Spotify for albums by name.
//  Endpoint: GET /api/spotify/search/album?name=Album+Name

export const searchAlbums = async (req, res) => {
    const result = await searchService.searchAlbums(req.query.name);
    res.json(result);
};

// searchArtists - Searches Spotify for artists by name.
// Endpoint: GET /api/spotify/search/artist?name=Artist+Name

export const searchArtists = async (req, res) => {
    const result = await searchService.searchArtists(req.query.name);
    res.json(result);
};
