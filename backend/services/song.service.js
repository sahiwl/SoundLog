import { GetAlbumTracks, getNewReleases as fetchNewReleases, GetSpecificAlbum, GetSpecificArtist, GetSpecificTrack } from "../lib/pullSpotifyData.js"
import Album from "../models/album.model.js";
import Track from "../models/track.model.js";
import Artist from "../models/artist.model.js";

export const getTrackDetails = async (itemId) => {
    // Check if track exists in database
    let track = await Track.findOne({ trackId: itemId });
    if (!track) {
        const spotifyData = await GetSpecificTrack(`${itemId}`, {
            market: 'IN'
        });
        if (!spotifyData || spotifyData.error) {
            throw new Error("Track not found on Spotify.");
        }
        track = await Track.create({
            trackId: itemId,
            name: spotifyData.name,
            duration_ms: spotifyData.duration_ms,
            explicit: spotifyData.explicit,
            popularity: spotifyData.popularity,
            track_number: spotifyData.track_number,
            disc_number: spotifyData.disc_number,
            is_local: spotifyData.is_local,
            is_playable: spotifyData.is_playable,
            preview_url: spotifyData.preview_url,
            type: spotifyData.type,
            href: spotifyData.href,
            album: {
                album_type: spotifyData.album?.album_type,
                spotifyId: spotifyData.album?.id,
                name: spotifyData.album?.name,
                release_date: spotifyData.album?.release_date,
                release_date_precision: spotifyData.album?.release_date_precision,
                total_tracks: spotifyData.album?.total_tracks,
                type: spotifyData.album?.type,
                uri: spotifyData.album?.uri,
                href: spotifyData.album?.href,
                is_playable: spotifyData.album?.is_playable,
                images: spotifyData.album?.images,
                artists: spotifyData.album?.artists?.map(artist => ({
                    spotifyId: artist.id,
                    name: artist.name,
                    type: artist.type,
                    uri: artist.uri,
                    href: artist.href,
                    external_urls: artist.external_urls
                })),
                external_urls: spotifyData.album?.external_urls
            },
            artists: spotifyData.artists.map(artist => ({
                spotifyId: artist.id,
                name: artist.name,
                type: artist.type,
                uri: artist.uri,
                href: artist.href,
                external_urls: artist.external_urls
            })),
            external_urls: spotifyData.external_urls,
            external_ids: spotifyData.external_ids,
            uri: spotifyData.uri,
            linked_from: spotifyData.linked_from
        });
    }
    return track;
}

export const getAlbumDetails = async (itemId) => {
    // Check if album exists in database
    let album = await Album.findOne({ albumId: itemId });
    if (!album) {
        const spotifyData = await GetSpecificAlbum(`${itemId}`, {
            market: 'IN'
        });
        if (!spotifyData || spotifyData.error) {
            throw new Error("Album not found on Spotify.");
        }
        album = await Album.create({
            albumId: itemId,
            name: spotifyData.name,
            album_type: spotifyData.album_type,
            total_tracks: spotifyData.total_tracks,
            is_playable: spotifyData.is_playable,
            release_date: spotifyData.release_date,
            release_date_precision: spotifyData.release_date_precision,
            images: spotifyData.images,
            artists: spotifyData.artists.map(artist => ({
                spotifyId: artist.id,
                name: artist.name,
                uri: artist.uri,
                href: artist.href,
                external_urls: artist.external_urls,
                type: artist.type
            })),
            tracks: {
                total: spotifyData.tracks?.total,
                items: spotifyData.tracks?.items?.map(track => ({
                    name: track.name,
                    trackId: track.id,
                    disc_number: track.disc_number,
                    duration_ms: track.duration_ms,
                    explicit: track.explicit,
                    track_number: track.track_number,
                    uri: track.uri,
                    is_playable: track.is_playable,
                    is_local: track.is_local,
                    preview_url: track.preview_url,
                    artists: track.artists.map(artist => ({
                        spotifyId: artist.id,
                        name: artist.name,
                        uri: artist.uri,
                        external_urls: artist.external_urls
                    }))
                }))
            },
            external_urls: spotifyData.external_urls,
            external_ids: spotifyData.external_ids,
            uri: spotifyData.uri,
            href: spotifyData.href,
            popularity: spotifyData.popularity,
            label: spotifyData.label,
            copyrights: spotifyData.copyrights,
            genres: spotifyData.genres
        });
    }
    return album;
}

export const getArtistDetails = async (artistId) => {
    // Check if artist exists in database
    let artist = await Artist.findOne({ artistId });
    if (!artist) {
        const spotifyData = await GetSpecificArtist(`${artistId}`, {
            market: 'IN'
        });
        if (!spotifyData || spotifyData.error) {
            throw new Error("Artist not found on Spotify.");
        }

        artist = await Artist.create({
            artistId: spotifyData.id,
            name: spotifyData.name,
            followers: {
                href: spotifyData.followers.href,
                total: spotifyData.followers.total
            },
            genres: spotifyData.genres,
            href: spotifyData.href,
            images: spotifyData.images.map(img => ({
                url: img.url,
                height: img.height,
                width: img.width
            })),
            popularity: spotifyData.popularity,
            type: spotifyData.type,
            uri: spotifyData.uri,
            external_urls: {
                spotify: spotifyData.external_urls.spotify
            }
        });
    }
    return artist;
};

export const getAlbumTracks = async (itemId) => {
    const tracks = await GetAlbumTracks(`${itemId}`, {
        market: 'IN'
    });
    return tracks;
};

export const getNewReleases = async (limit = 20, offset = 0) => {
    const newRelease = await fetchNewReleases(limit, offset);
    return newRelease;
};
