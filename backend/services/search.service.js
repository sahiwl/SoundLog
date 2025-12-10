import { searchSpotifyData } from "../lib/pullSpotifyData.js";

export const searchAll = async (searchQuery) => {
    if (!searchQuery) {
        throw new Error("Query parameter 'query' is required");
    }
    // Request tracks, albums, artists simultaneously
    const data = await searchSpotifyData("search", {
        q: searchQuery,
        type: "track,album,artist",
        market: "IN",
        limit: 5,
    });

    // Return partial data from each category
    return {
        tracks: data.tracks?.items || [],
        albums: data.albums?.items || [],
        artists: data.artists?.items || [],
    };
};

export const searchTracks = async (trackName) => {
    if (!trackName) {
        throw new Error(`Query parameter "name" is required.`);
    }

    //use spotify search endpoint for tracks
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
        throw new Error(`Query parameter "name" is required.`);
    }

    //using spotify search endpoint for albums
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
        throw new Error(`Query parameter "name" is required.`);
    }

    // Use the Spotify search endpoint for artists.
    const data = await searchSpotifyData("search", {
        q: artistName,
        type: "artist",
        market: "IN",
        limit: 10,
    });

    return data.artists;
};
