import { GetAlbumTracks, getNewReleases, GetSpecificAlbum, GetSpecificTrack} from "../lib/pullSpotifyData.js"
import Album from "../models/album.model.js";
import Track from "../models/track.model.js";

export const getTrackDetails = async(itemId)=>{
    try {
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
    } catch (error) {
        console.error("Error in getTracksDetails:", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export const getAlbumDetails = async(itemId)=>{
    try {
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
    } catch (error) {
        console.error("Error in getAlbumsDetails:", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}


export const getAlbumTracksHandler = async (req, res) => {
    try {
      const { itemId } = req.params;      
      const tracks = await GetAlbumTracks(`${itemId}`,{
        market: 'IN'
      });
      res.json(tracks);
    } catch (error) {
        console.error("Error in getAlbumTracksHandler:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getNewReleasesHandler = async (req,res)=>{
    try {
        const limit = parseInt(req.query.limit) || 20
        const offset = parseInt(req.query.offset) || 0
        const newRelease = await getNewReleases(limit, offset)
       
        return  res.status(200).json(newRelease);
        } catch (error) {
        console.error("Error in getNewReleasesHandler:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}