import { searchSpotifyData } from "../lib/pullSpotifyData.js";
import { AppError } from "../lib/AppError.js";

// Define minimal types for return structure based on usage
interface SpotifyItem {
    [key: string]: any;
}

interface SpotifySearchData {
    tracks?: { items: SpotifyItem[] };
    albums?: { items: SpotifyItem[] };
    artists?: { items: SpotifyItem[] };
}

export const searchAll = async (searchQuery: string): Promise<{
    tracks: SpotifyItem[];
    albums: SpotifyItem[];
    artists: SpotifyItem[];
}> => {
    if (!searchQuery) {
        throw new AppError("Query parameter 'query' is required.", 400);
    }
    const data: SpotifySearchData = await searchSpotifyData("search", {
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
