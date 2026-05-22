import { getNewReleases as fetchNewReleases } from "../lib/pullSpotifyData.js";
import {
  getOrCreateAlbum,
  getOrCreateTrack,
  getOrCreateArtist,
} from "../lib/spotifyCache.js";

// Public API: backed by the unified cache module so call sites stay unchanged.
export const getAlbumDetails = (itemId, options) =>
  getOrCreateAlbum(itemId, options);

export const getTrackDetails = (itemId, options) =>
  getOrCreateTrack(itemId, options);

export const getArtistDetails = (artistId, options) =>
  getOrCreateArtist(artistId, options);

export const getNewReleases = async (limit = 20, offset = 0) => {
  const newRelease = await fetchNewReleases(limit, offset);
  return newRelease;
};
