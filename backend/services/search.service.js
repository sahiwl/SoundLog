import { searchSpotifyData } from "../lib/pullSpotifyData.js";
import { AppError } from "../lib/AppError.js";

export const searchAll = async (searchQuery) => {
    if (!searchQuery) {
        throw new AppError("Query parameter 'query' is required.", 400);
    }
    const data = await searchSpotifyData("search", {
        q: searchQuery,
        type: "track,album,artist",
        market: "IN",
        limit: 5,
    });

    return {
        tracks: data.tracks?.items || [],
        albums: data.albums?.items || [],
        artists: data.artists?.items || [],
    };
};
