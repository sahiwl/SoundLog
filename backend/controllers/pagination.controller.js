import * as paginationService from "../services/pagination.service.js";

// Get user's reviews with pagination 
// ✅ tested
export const getUserReviews = async (req, res) => {
    try {
        const { username } = req.params;
        const page = parseInt(req.query.page) || 1;

        const result = await paginationService.getUserReviews(username, page);

        res.json(result);
    } catch (error) {
        console.error("Error in getUserReviews:", error);
        if (error.message === "User not found.") {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Get user's albums (rated and listened) with pagination
// ✅ tested
export const getUserAlbums = async (req, res) => {
    try {
        const { username } = req.params;
        const page = parseInt(req.query.page) || 1;

        const result = await paginationService.getUserAlbums(username, page);

        res.json(result);
    } catch (error) {
        console.error("Error in getUserAlbums:", error.message);
        if (error.message === "User not found.") {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Get user's liked albums with pagination
// ✅ tested
export const getUserLikes = async (req, res) => {
    try {
        const { username } = req.params;
        const page = parseInt(req.query.page) || 1;

        const result = await paginationService.getUserLikes(username, page);

        res.json(result);
    } catch (error) {
        console.error("Error in getUserLikes:", error);
        if (error.message === "User not found.") {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Get individual album details with reviews
export const getAlbumPage = async (req, res) => {
    try {
        const { albumId } = req.params;
        const page = parseInt(req.query.page) || 1;

        const result = await paginationService.getAlbumPage(albumId, page);

        res.json(result);

    } catch (error) {
        console.error("Error in getAlbumPage:", error.message);
        if (error.message === "Album not found on Spotify.") {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
}

// Get individual track details with ratings
export const getTrackPage = async (req, res) => {
    try {
        const { trackId } = req.params;
        const page = parseInt(req.query.page) || 1;

        const result = await paginationService.getTrackPage(trackId, page);

        res.json(result);

    } catch (error) {
        console.error("Error in getTrackPage:", error);
        if (error.message === "Track not found on Spotify.") {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getArtistPage = async (req, res) => {
    try {
        const { artistId } = req.params;

        const result = await paginationService.getArtistPage(artistId);

        res.json(result);

    } catch (error) {
        console.error("Error in getArtistPage:", error);
        if (error.message === "Artist not found on Spotify.") {
            return res.status(404).json({ message: error.message }); // Assuming 404 for not found
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getNewReleasesPage = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;

        const result = await paginationService.getNewReleasesPage(page);

        res.status(200).json(result);
    } catch (error) {
        console.error("Error in getNewReleasesPage:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getUserListenLater = async (req, res) => {
    try {
        const { username } = req.params;
        const page = parseInt(req.query.page) || 1;

        const result = await paginationService.getUserListenLater(username, page);

        res.json(result);
    } catch (error) {
        console.error("Error in getUserListenLater:", error);
        if (error.message === "User not found.") {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
};