import { getNewReleases, GetSpecificAlbum, GetSpecificTrack } from "../lib/pullSpotifyData.js";
import Album from "../models/album.model.js";
import Track from "../models/track.model.js";
import Rating from "../models/rating.model.js";
import Review from "../models/review.model.js";
import Likes from "../models/likes.model.js";
import Listened from "../models/listened.model.js";
import Comment from "../models/comment.model.js";
import { getNewReleasesHandler } from "./song.controller.js";

// Get user's reviews with pagination 
// ✅ tested
export const getUserReviews = async (req, res) => {
    try {
        const userId = req.user._id;
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

        // Get total count for pagination
        const total = await Review.countDocuments({ userId });

        res.json({
            reviews: reviews,
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
        const userId = req.user._id;
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        // Get rated albums with timestamps and ratings
        const ratings = await Rating.find({ userId, itemType: "albums" })
            .sort({ createdAt: -1 })
            .select('itemId rating createdAt')
            .skip(skip)
            .limit(limit);

        // Get listened albums with timestamps
        const listened = await Listened.find({ userId, itemType: "albums" })
            .sort({ createdAt: -1 })
            .select('albumId createdAt')
            .skip(skip)
            .limit(limit);

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

        // Get album details from database or Spotify API
        const albumsWithDetails = await Promise.all(
            Array.from(albumData.values()).map(async (data) => {
                // Check if album exists in database
                let album = await Album.findOne({ albumId: data.albumId });
                
                // If not found, fetch from Spotify and save
                if (!album) {
                    console.log(data.albumId)
                    const spotifyAlbum = await GetSpecificAlbum(data.albumId);
                    album = await Album.create({
                        albumId: data.albumId,
                        name: spotifyAlbum.name,
                        album_type: spotifyAlbum.album_type,
                        total_tracks: spotifyAlbum.total_tracks,
                        release_date: spotifyAlbum.release_date,
                        images: spotifyAlbum.images,
                        artists: spotifyAlbum.artists.map(artist => ({
                            spotifyId: artist.id,
                            name: artist.name
                        })),
                        external_urls: spotifyAlbum.external_urls,
                        uri: spotifyAlbum.uri
                    });
                }

                // Return only needed fields
                return {
                    name: album.name,
                    release_date: album.release_date,
                    link: album.external_urls.spotify,
                    rating: data.rating || null,
                    timestamp: data.timestamp
                };
            })
        );

        // Get total count for pagination
        const total = await Promise.all([
            Rating.countDocuments({ userId, itemType: "albums" }),
            Listened.countDocuments({ userId, itemType: "albums" })
        ]);

        res.json({
            albums: albumsWithDetails,
            currentPage: page,
            totalPages: Math.ceil(Math.max(...total) / limit),
            total: Math.max(...total)
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
        const userId = req.user._id;
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
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
                        release_date: spotifyAlbum.release_date,
                        images: spotifyAlbum.images,
                        artists: spotifyAlbum.artists.map(artist => ({
                            spotifyId: artist.id,
                            name: artist.name
                        })),
                        external_urls: spotifyAlbum.external_urls,
                        uri: spotifyAlbum.uri
                    });
                }
                return album;
            })
        );

        // add a feature of showing what user liked furthermore- other users reviews (and those particular reviews - rating, username, reviewtext)
        // Get total count for pagination
        const total = await Likes.countDocuments({ userId });

        res.json({
            albums:albumsWithDetails,
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

        // Get or create album in database
        let album = await Album.findOne({ albumId });
        
        if (!album) {
            // If album not in database, fetch from Spotify
            const spotifyData = await GetSpecificAlbum(albumId);
            if (!spotifyData) {
                return res.status(404).json({ message: "Album not found" });
            }

            // Create new album document with proper structure
            album = await Album.create({
                albumId: albumId,
                name: spotifyData.name,
                album_type: spotifyData.album_type,
                total_tracks: spotifyData.total_tracks,
                release_date: spotifyData.release_date,
                images: spotifyData.images,
                artists: spotifyData.artists.map(artist => ({
                    spotifyId: artist.id,
                    name: artist.name
                })),
                external_urls: spotifyData.external_urls,
                uri: spotifyData.uri
            });
        }

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

        // Return complete response
        res.json({
            album: {
                id: album._id,
                albumId: album.albumId,
                name: album.name,
                album_type: album.album_type,
                total_tracks: album.total_tracks,
                release_date: album.release_date,
                images: album.images,
                artists: album.artists,
                external_urls: album.external_urls,
                uri: album.uri
            },
            reviews: reviewsWithDetails,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalReviews / limit),
                totalReviews,
                totalComments
            }
        });

    } catch (error) {
        console.error("Error in getAlbumPage:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Get individual track details with ratings
export const getTrackPage = async (req, res) => {
    try {
        const { trackId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        // Get track details from database first
        let track = await Track.findOne({ trackId: trackId });
        
        // If track doesn't exist in database, fetch from Spotify API and save
        if (!track) {
            try {
                const spotifyTrack = await GetSpecificTrack(trackId);
                track = await Track.create({
                    trackId: spotifyTrack.id,
                    name: spotifyTrack.name,
                    duration_ms: spotifyTrack.duration_ms,
                    explicit: spotifyTrack.explicit,
                    popularity: spotifyTrack.popularity,
                    track_number: spotifyTrack.track_number,
                    album: {
                        album_type: spotifyTrack.album.album_type,
                        spotifyId: spotifyTrack.album.id,
                        name: spotifyTrack.album.name,
                        release_date: spotifyTrack.album.release_date,
                        images: spotifyTrack.album.images
                    },
                    artists: spotifyTrack.artists.map(artist => ({
                        spotifyId: artist.id,
                        name: artist.name
                    })),
                    external_urls: spotifyTrack.external_urls,
                    uri: spotifyTrack.uri
                });
            } catch (error) {
                console.error("Error fetching track from Spotify:", error);
                return res.status(404).json({ message: "Track not found" });
            }
        }

        // Get ratings with user details
        const ratings = await Rating.find({ itemId: trackId, itemType: "tracks" })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('userId', 'username');

        // Get total count for pagination
        const total = await Rating.countDocuments({ itemId: trackId, itemType: "tracks" });

        res.json({
            track,
            ratings,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            total
        });
    } catch (error) {
        console.error("Error in getTrackDetails:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getNewReleasesPage = async (req,res)=>{
    try {
        const limit = parseInt(req.query.limit) || 20
        const offset = parseInt(req.query.offset) || 0


        const response = await getNewReleases({limit, offset})
        res.status(200).json(response)
    } catch (error) {
        console.error("Error in getNewReleasesPage:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}