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

export const searchTracks = async (trackName) => {
    if (!trackName) {
        throw new AppError(`Query parameter "name" is required.`, 400);
    }

    const data = await searchSpotifyData("search", {
        q: trackName,
        type: "track",
        market: "IN",
        limit: 10,
    });
    return data;
};

export const searchAlbums = async (albumName) => {
    if (!albumName) {
        throw new AppError(`Query parameter "name" is required.`, 400);
    }

    const data = await searchSpotifyData("search", {
        q: albumName,
        type: "album",
        market: "IN",
        limit: 10,
    });

    return data.albums;
};

export const searchArtists = async (artistName) => {
    if (!artistName) {
        throw new AppError(`Query parameter "name" is required.`, 400);
    }

    const data = await searchSpotifyData("search", {
        q: artistName,
        type: "artist",
        market: "IN",
        limit: 10,
    });

    return data.artists;
};
