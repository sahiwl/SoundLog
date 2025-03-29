import Album from "../models/album.model.js";
import Track from "../models/track.model.js";

const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

export const cleanupInactiveDocuments = async () => {
    try {
        const cutoffDate = new Date(Date.now() - SEVEN_DAYS);
        
        // Find all inactive albums
        const inactiveAlbums = await Album.find({
            lastAccessed: { $lt: cutoffDate }
        });
        
        // Find all inactive tracks
        const inactiveTracks = await Track.find({
            lastAccessed: { $lt: cutoffDate }
        });
        
        // Delete each inactive album individually
        let deletedAlbumsCount = 0;
        for (const album of inactiveAlbums) {
            // Double check the lastAccessed time before deleting
            if (album.lastAccessed < cutoffDate) {
                await album.deleteOne();
                deletedAlbumsCount++;
            }
        }
        
        // Delete each inactive track individually
        let deletedTracksCount = 0;
        for (const track of inactiveTracks) {
            // Double check the lastAccessed time before deleting
            if (track.lastAccessed < cutoffDate) {
                await track.deleteOne();
                deletedTracksCount++;
            }
        }
        
        console.log(`Cleanup completed: Deleted ${deletedAlbumsCount} albums and ${deletedTracksCount} tracks that were inactive for 7+ days`);
    } catch (error) {
        console.error('Error in cleanupInactiveDocuments:', error);
    }
}; 