import Album from "../models/album.model.js";
import Track from "../models/track.model.js";

const Days = 30 * 24 * 60 * 60 * 1000; //30 days in ms 

interface CleanupResult{
  deletedAlbums : number;
  deletedTracks : number;
}

export const cleanupInactiveDocuments = async (): Promise<CleanupResult> => {
  const cutoffDate = new Date(Date.now() - Days);

  const [albumResult, trackResult] = await Promise.all([
    Album.deleteMany({ lastAccessed: { $lt: cutoffDate } }),
    Track.deleteMany({ lastAccessed: { $lt: cutoffDate } }),
  ]);

  const result : CleanupResult = {
    deletedAlbums: albumResult.deletedCount ?? 0,
    deletedTracks: trackResult.deletedCount ?? 0,
  };

  console.log(
    `Cleanup completed: deleted ${result.deletedAlbums} albums and ${result.deletedTracks} tracks inactive 30+ days`
  );

  return result;
};
