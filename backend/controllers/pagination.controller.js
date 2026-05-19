import * as paginationService from "../services/pagination.service.js";

// Get user's reviews with pagination 
// ✅ tested
export const getUserReviews = async (req, res) => {
    const { username } = req.params;
    const page = parseInt(req.query.page) || 1;
    const result = await paginationService.getUserReviews(username, page);
    res.json(result);
};

// Get user's albums (rated and listened) with pagination
// ✅ tested
export const getUserAlbums = async (req, res) => {
    const { username } = req.params;
    const page = parseInt(req.query.page) || 1;
    const result = await paginationService.getUserAlbums(username, page);
    res.json(result);
};

// Get user's liked albums with pagination
// ✅ tested
export const getUserLikes = async (req, res) => {
    const { username } = req.params;
    const page = parseInt(req.query.page) || 1;
    const result = await paginationService.getUserLikes(username, page);
    res.json(result);
};

// Get individual album details with reviews
export const getAlbumPage = async (req, res) => {
    const { albumId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const result = await paginationService.getAlbumPage(albumId, page);
    res.json(result);
};

export const getTrackPage = async (req, res) => {
    const { trackId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const result = await paginationService.getTrackPage(trackId, page);
    res.json(result);
};

export const getArtistPage = async (req, res) => {
    const { artistId } = req.params;
    const result = await paginationService.getArtistPage(artistId);
    res.json(result);
};

export const getNewReleasesPage = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const result = await paginationService.getNewReleasesPage(page);
    res.status(200).json(result);
};

export const getUserListenLater = async (req, res) => {
    const { username } = req.params;
    const page = parseInt(req.query.page) || 1;
    const result = await paginationService.getUserListenLater(username, page);
    res.json(result);
};
