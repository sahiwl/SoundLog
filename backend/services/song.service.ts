import { getNewReleases as fetchNewReleases } from "../lib/pullSpotifyData.js";
import {
  getOrCreateAlbum,
  getOrCreateTrack,
  getOrCreateArtist,
} from "../lib/spotifyCache.js";

// Types for options parameter can be adjusted based on actual usage.
// For now, allow any type until underlying implementations are typed.
export const getAlbumDetails = (itemId: string, options?: any): Promise<any> =>
  getOrCreateAlbum(itemId, options);

export const getTrackDetails = (itemId: string, options?: any): Promise<any> =>
  getOrCreateTrack(itemId, options);

export const getArtistDetails = (artistId: string, options?: any): Promise<any> =>
  getOrCreateArtist(artistId, options);

export const getNewReleases = async (limit: number = 20, offset: number = 0): Promise<any> => {
  const newRelease = await fetchNewReleases(limit, offset);
  return newRelease;
};
