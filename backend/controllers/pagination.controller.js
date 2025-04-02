import { getNewReleases, GetSpecificAlbum, GetSpecificTrack } from "../lib/pullSpotifyData.js";
import Album from "../models/album.model.js";
import Rating from "../models/rating.model.js";
import Review from "../models/review.model.js";
import Likes from "../models/likes.model.js";
import Listened from "../models/listened.model.js";
import Comment from "../models/comment.model.js";
import { getAlbumDetails, getNewReleasesHandler, getTrackDetails } from "./song.controller.js";
import { getArtistDetails } from "./song.controller.js";
import User from "../models/user.model.js";
import ListenLater from "../models/listenLater.model.js";

// Get user's reviews with pagination 
// ✅ tested
export const getUserReviews = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username }).select('_id');
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        const userId = user._id;
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        // Get reviews with just the review text and rating
        const reviews = await Review.find({ userId })
            .select('reviewText rating albumId createdAt')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('userId', 'username');

        // Fetch album details and ratings for each review
        const reviewsWithAlbumDetails = await Promise.all(
            reviews.map(async (review) => {
                const album = await Album.findOne({ albumId: review.albumId });
                const rating = await Rating.findOne({ 
                    userId, 
                    itemId: review.albumId,
                    itemType: 'albums'
                });

                return {
                    _id: review._id,
                    reviewText: review.reviewText,
                    rating: rating ? rating.rating : "NA",  
                    createdAt: review.createdAt,
                    albumId: review.albumId,
                    albumTitle: album?.name || "Unknown Album",
                    releaseDate: album?.release_date || "Unknown Year",
                    albumImage: album?.images?.[0]?.url || null
                };
            })
        );

        const total = await Review.countDocuments({ userId });

        res.json({
            reviews: reviewsWithAlbumDetails,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            total
        });
    } catch (error) {
        console.error("Error in getUserReviews:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Get user's albums (rated and listened) with pagination
// ✅ tested
export const getUserAlbums = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username }).select('_id');
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        const userId = user._id;
        const page = parseInt(req.query.page) || 1;
        const limit = 12;
        const skip = (page - 1) * limit;

        // First, get all album IDs from both ratings and listened
        const [ratings, listened, likedAlbums] = await Promise.all([
            Rating.find({ userId, itemType: "albums" })
                .select('itemId rating createdAt')
                .sort({ createdAt: -1 }),
            Listened.find({ userId })
                .select('albumId createdAt')
                .sort({ createdAt: -1 }),
            Likes.find({ userId })
                .select('albumId createdAt')
        ]);

        // Combine and deduplicate albums while preserving timestamps and ratings
        const albumData = new Map();
        
        ratings.forEach(r => {
            albumData.set(r.itemId, {
                albumId: r.itemId,
                rating: r.rating,
                timestamp: r.createdAt
            });
        });

        listened.forEach(l => {
            if (!albumData.has(l.albumId)) {
                albumData.set(l.albumId, {
                    albumId: l.albumId,
                    timestamp: l.createdAt
                });
            }
        });

        likedAlbums.forEach(l => {
            if (!albumData.has(l.albumId)) {
                albumData.set(l.albumId, {
                    albumId: l.albumId,
                    timestamp: l.createdAt
                });
            }
        });

        // Convert to array and sort by timestamp
        const sortedAlbums = Array.from(albumData.values())
            .sort((a, b) => b.timestamp - a.timestamp);

        // Apply pagination
        const paginatedAlbums = sortedAlbums.slice(skip, skip + limit);

        // Get album details for paginated items only
        const albumsWithDetails = await Promise.all(
            paginatedAlbums.map(async (data) => {
                // Check if album exists in database
                let album = await Album.findOne({ albumId: data.albumId });
                
                // If not found, fetch from Spotify and save
                if (!album) {
                    const spotifyAlbum = await GetSpecificAlbum(data.albumId);
                    album = await Album.create({
                        albumId: data.albumId,
                        name: spotifyAlbum.name,
                        album_type: spotifyAlbum.album_type,
                        total_tracks: spotifyAlbum.total_tracks,
                        is_playable: spotifyAlbum.is_playable,
                        release_date: spotifyAlbum.release_date,
                        release_date_precision: spotifyAlbum.release_date_precision,
                        images: spotifyAlbum.images,
                        artists: spotifyAlbum.artists.map(artist => ({
                            spotifyId: artist.id,
                            name: artist.name,
                            uri: artist.uri,
                            href: artist.href,
                            external_urls: artist.external_urls,
                            type: artist.type
                        })),
                        tracks: {
                            total: spotifyAlbum.tracks?.total,
                            items: spotifyAlbum.tracks?.items?.map(track => ({
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
                        external_urls: spotifyAlbum.external_urls,
                        external_ids: spotifyAlbum.external_ids,
                        uri: spotifyAlbum.uri,
                        href: spotifyAlbum.href,
                        popularity: spotifyAlbum.popularity,
                        label: spotifyAlbum.label,
                        copyrights: spotifyAlbum.copyrights,
                        genres: spotifyAlbum.genres
                    });
                }

                // Update lastAccessed timestamp
                album.lastAccessed = new Date();
                await album.save();

                return {
                    ...album.toObject(),
                    rating: data.rating || null,
                    timestamp: data.timestamp
                };
            })
        );

        res.json({
            albums: albumsWithDetails,
            currentPage: page,
            totalPages: Math.ceil(albumData.size / limit),
            total: albumData.size
        });
    } catch (error) {
        console.error("Error in getUserAlbums:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Get user's liked albums with pagination
// ✅ tested
export const getUserLikes = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username }).select('_id');
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        const userId = user._id;
        const page = parseInt(req.query.page) || 1;
        const limit = 12;
        const skip = (page - 1) * limit;

        // Get liked albums with timestamps
        const likes = await Likes.find({ userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // Get album details and associated reviews
        const albumsWithDetails = await Promise.all(
            likes.map(async (like) => {
                // Check if album exists in database
                let album = await Album.findOne({ albumId: like.albumId });
                
                // If not found, fetch from Spotify and save to db
                if (!album) {
                    const spotifyAlbum = await GetSpecificAlbum(like.albumId);
                    album = await Album.create({
                        albumId: like.albumId,
                        name: spotifyAlbum.name,
                        album_type: spotifyAlbum.album_type,
                        total_tracks: spotifyAlbum.total_tracks,
                        is_playable: spotifyAlbum.is_playable,
                        release_date: spotifyAlbum.release_date,
                        release_date_precision: spotifyAlbum.release_date_precision,
                        images: spotifyAlbum.images,
                        artists: spotifyAlbum.artists.map(artist => ({
                            spotifyId: artist.id,
                            name: artist.name,
                            uri: artist.uri,
                            href: artist.href,
                            external_urls: artist.external_urls,
                            type: artist.type
                        })),
                        tracks: {
                            total: spotifyAlbum.tracks?.total,
                            items: spotifyAlbum.tracks?.items?.map(track => ({
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
                        external_urls: spotifyAlbum.external_urls,
                        external_ids: spotifyAlbum.external_ids,
                        uri: spotifyAlbum.uri,
                        href: spotifyAlbum.href,
                        popularity: spotifyAlbum.popularity,
                        label: spotifyAlbum.label,
                        copyrights: spotifyAlbum.copyrights,
                        genres: spotifyAlbum.genres
                    });
                }

                // Update lastAccessed timestamp
                album.lastAccessed = new Date();
                await album.save();

                return album.toObject();
            })
        );

        // Get total count for pagination
        const total = await Likes.countDocuments({ userId });

        res.json({
            albums: albumsWithDetails,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            total
        });
    } catch (error) {
        console.error("Error in getUserLikes:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Get individual album details with reviews
export const getAlbumPage = async (req, res) => {
    try {
        const { albumId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        // Use the getAlbumDetails controller to fetch/create album
        const album = await getAlbumDetails(albumId);

        // Update lastAccessed timestamp
        album.lastAccessed = new Date();
        await album.save();

        // Get reviews for this album
        const reviews = await Review.find({ albumId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('userId', 'username');

        // Get comments and ratings for each review
        const reviewsWithDetails = await Promise.all(
            reviews.map(async (review) => {
                // Get comments for this review
                const comments = await Comment.find({ reviewId: review._id })
                    .populate('userId', 'username');

                // Get ratings for this review
                const ratings = await Rating.find({ reviewId: review._id })
                    .populate('userId', 'username');

                return {
                    reviewId: review._id,
                    reviewText: review.reviewText,
                    rating: review.rating,
                    createdAt: review.createdAt,
                    user: {
                        id: review.userId._id,
                        username: review.userId.username
                    },
                    comments: comments.map(comment => ({
                        commentId: comment._id,
                        text: comment.text,
                        createdAt: comment.createdAt,
                        user: {
                            id: comment.userId._id,
                            username: comment.userId.username
                        }
                    })),   
                    ratings: ratings.map(rating => ({
                        ratingId: rating._id,
                        rating: rating.rating,
                        createdAt: rating.createdAt,
                        user: {
                            id: rating.userId._id,
                            username: rating.userId.username
                        }
                    })),
                    commentCount: comments.length
                };
            })
        );

        // Get total counts for pagination
        const [totalReviews, totalComments] = await Promise.all([
            Review.countDocuments({ albumId }),
            Comment.countDocuments({ reviewId: { $in: reviews.map(r => r._id) } })
        ]);

        // Return complete response with full album document
        res.json({
            album: album.toObject(), // Convert to plain object to include all fields
            reviews: reviewsWithDetails,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalReviews / limit),
                totalReviews,
                totalComments
            }
        });

    }catch (error) {
        console.error("Error in getAlbumPage:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

// Get individual track details with ratings
export const getTrackPage = async (req, res) => {
    try {
        const { trackId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        const track = await getTrackDetails(trackId);

        track.lastAccessed = new Date();
        await track.save();

        // Get ratings for this track
        const ratings = await Rating.find({ itemId: trackId, itemType: "tracks" })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('userId', 'username');

        // Get total count for pagination
        const totalRatings = await Rating.countDocuments({ itemId: trackId, itemType: "tracks" });

        // Return complete response
        res.json({
            track: track.toObject(),
            ratings: ratings.map(rating => ({
                ratingId: rating._id,
                rating: rating.rating,
                createdAt: rating.createdAt,
                user: {
                    id: rating.userId._id,
                    username: rating.userId.username
                }
            })),
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalRatings / limit),
                totalRatings
            }
        });

    } catch (error) {
        console.error("Error in getTrackPage:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getArtistPage = async (req, res) => {
    try {
        const { artistId } = req.params;

        const artist = await getArtistDetails(artistId);
        
        // Update lastAccessed timestamp
        artist.lastAccessed = new Date();
        await artist.save();

        // Format and return response according to model schema
        res.json({
            artist: {
                id: artist.artistId,
                name: artist.name,
                followers: artist.followers,
                genres: artist.genres,
                href: artist.href,
                images: artist.images,
                popularity: artist.popularity,
                type: artist.type,
                uri: artist.uri,
                external_urls: artist.external_urls,
                lastAccessed: artist.lastAccessed,
                createdAt: artist.createdAt,
                updatedAt: artist.updatedAt
            }
        });

    } catch (error) {
        console.error("Error in getArtistPage:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getNewReleasesPage = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 20;
        const skip = (page - 1) * limit;

        const spotifyData = await getNewReleases({ 
            limit,
            offset: skip  // Using skip instead of offset for consistency
        });

        // Ensure we have the data we need
        if (!spotifyData?.albums?.items) {
            throw new Error('Invalid Spotify response');
        }

        const total = spotifyData.albums.total || 0;
        
        // Transform and sort the albums by release date
        const albums = spotifyData.albums.items
            .map(album => ({
                albumId: album.id,
                name: album.name,
                images: album.images,
                artists: album.artists,
                release_date: album.release_date,
                total_tracks: album.total_tracks,
                album_type: album.album_type
            }))
            .sort((a, b) => new Date(b.release_date) - new Date(a.release_date));

        res.status(200).json({
            totalAlbums: total, 
            albums: albums,     
            currentPage: page
        });
    } catch (error) {
        console.error("Error in getNewReleasesPage:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getUserListenLater = async (req, res) => {
    try {
        const { username } = req.params; 
        const user = await User.findOne({ username }).select('_id'); 
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        const userId = user._id;
        const page = parseInt(req.query.page) || 1;
        const limit = 12;
        const skip = (page - 1) * limit;

        // Get listenLater albums with timestamps
        const listenLater = await ListenLater.find({ userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // Get album details
        const albumsWithDetails = await Promise.all(
            listenLater.map(async (item) => {
                let album = await Album.findOne({ albumId: item.albumId });
                
                if (!album) {
                    const spotifyAlbum = await GetSpecificAlbum(item.albumId);
                    album = await Album.create({
                        albumId: item.albumId,
                        name: spotifyAlbum.name,
                        album_type: spotifyAlbum.album_type,
                        total_tracks: spotifyAlbum.total_tracks,
                        images: spotifyAlbum.images,
                        artists: spotifyAlbum.artists.map(artist => ({
                            spotifyId: artist.id,
                            name: artist.name,
                            uri: artist.uri,
                            external_urls: artist.external_urls
                        })),
                        release_date: spotifyAlbum.release_date,
                        external_urls: spotifyAlbum.external_urls,
                        lastAccessed: new Date()
                    });
                }

                album.lastAccessed = new Date();
                await album.save();

                return {
                    ...album.toObject(),
                    addedAt: item.createdAt
                };
            })
        );

        const total = await ListenLater.countDocuments({ userId });

        res.json({
            albums: albumsWithDetails,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            total
        });
    } catch (error) {
        console.error("Error in getUserListenLater:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};