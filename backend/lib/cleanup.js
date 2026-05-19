import Album from "../models/album.model.js";
import Track from "../models/track.model.js";

const Days = 39 * 24 * 60 * 60 * 1000; //30 days in ms 

export const cleanupInactiveDocuments = async () => {
  const cutoffDate = new Date(Date.now() - Days);

  const [albumResult, trackResult] = await Promise.all([
    Album.deleteMany({ lastAccessed: { $lt: cutoffDate } }),
    Track.deleteMany({ lastAccessed: { $lt: cutoffDate } }),
  ]);

  const result = {
    deletedAlbums: albumResult.deletedCount,
    deletedTracks: trackResult.deletedCount,
  };

  console.log(
    `Cleanup completed: deleted ${result.deletedAlbums} albums and ${result.deletedTracks} tracks inactive 7+ days`
  );

  return result;
};
