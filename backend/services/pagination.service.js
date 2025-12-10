import Album from "../models/album.model.js";
import Rating from "../models/rating.model.js";
import Review from "../models/review.model.js";
import Likes from "../models/likes.model.js";
import Listened from "../models/listened.model.js";
import Comment from "../models/comment.model.js";
import User from "../models/user.model.js";
import ListenLater from "../models/listenLater.model.js";
import { getAlbumDetails, getTrackDetails, getArtistDetails, getNewReleases, getAlbumTracks } from "./song.service.js";
import { GetSpecificAlbum } from "../lib/pullSpotifyData.js"; // Kept for consistency if needed, but getAlbumDetails handles caching

export const getUserReviews = async (username, page = 1) => {
    const user = await User.findOne({ username }).select('_id');
    if (!user) {
        throw new Error("User not found.");
    }
    const userId = user._id;
    const limit = 10;
    const skip = (page - 1) * limit;

    const reviews = await Review.find({ userId })
        .select('reviewText rating albumId createdAt')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('userId', 'username');

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

    return {
        reviews: reviewsWithAlbumDetails,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        total
    };
};

export const getUserAlbums = async (username, page = 1) => {
    const user = await User.findOne({ username }).select('_id');
    if (!user) {
        throw new Error("User not found.");
    }
    const userId = user._id;
    const limit = 12;
    const skip = (page - 1) * limit;

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

    const sortedAlbums = Array.from(albumData.values())
        .sort((a, b) => b.timestamp - a.timestamp);

    const paginatedAlbums = sortedAlbums.slice(skip, skip + limit);

    const albumsWithDetails = await Promise.all(
        paginatedAlbums.map(async (data) => {
            // Use getAlbumDetails from song service which handles caching
            const album = await getAlbumDetails(data.albumId);

            // Update lastAccessed happens inside getAlbumDetails if it fetches? 
            // Actually getAlbumDetails creates if not exists. 
            // The original controller updated lastAccessed explicitly if found.
            // Let's replicate that behavior.
            album.lastAccessed = new Date();
            await album.save();

            return {
                ...album.toObject(),
                rating: data.rating || null,
                timestamp: data.timestamp
            };
        })
    );

    return {
        albums: albumsWithDetails,
        currentPage: page,
        totalPages: Math.ceil(albumData.size / limit),
        total: albumData.size
    };
};

export const getUserLikes = async (username, page = 1) => {
    const user = await User.findOne({ username }).select('_id');
    if (!user) {
        throw new Error("User not found.");
    }
    const userId = user._id;
    const limit = 12;
    const skip = (page - 1) * limit;

    const likes = await Likes.find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const albumsWithDetails = await Promise.all(
        likes.map(async (like) => {
            const album = await getAlbumDetails(like.albumId);
            album.lastAccessed = new Date();
            await album.save();
            return album.toObject();
        })
    );

    const total = await Likes.countDocuments({ userId });

    return {
        albums: albumsWithDetails,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        total
    };
};

export const getAlbumPage = async (albumId, page = 1) => {
    const limit = 10;
    const skip = (page - 1) * limit;

    const album = await getAlbumDetails(albumId);
    album.lastAccessed = new Date();
    await album.save();

    const reviews = await Review.find({ albumId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('userId', 'username');

    const reviewsWithDetails = await Promise.all(
        reviews.map(async (review) => {
            const comments = await Comment.find({ reviewId: review._id })
                .populate('userId', 'username');

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

    const [totalReviews, totalComments] = await Promise.all([
        Review.countDocuments({ albumId }),
        Comment.countDocuments({ reviewId: { $in: reviews.map(r => r._id) } })
    ]);

    return {
        album: album.toObject(),
        reviews: reviewsWithDetails,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(totalReviews / limit),
            totalReviews,
            totalComments
        }
    };
};

export const getTrackPage = async (trackId, page = 1) => {
    const limit = 10;
    const skip = (page - 1) * limit;

    const track = await getTrackDetails(trackId);
    track.lastAccessed = new Date();
    await track.save();

    const ratings = await Rating.find({ itemId: trackId, itemType: "tracks" })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('userId', 'username');

    const totalRatings = await Rating.countDocuments({ itemId: trackId, itemType: "tracks" });

    return {
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
    };
};

export const getArtistPage = async (artistId) => {
    const artist = await getArtistDetails(artistId);

    artist.lastAccessed = new Date();
    await artist.save();

    return {
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
    };
};

export const getNewReleasesPage = async (page = 1) => {
    const limit = 20;
    const skip = (page - 1) * limit;

    const spotifyData = await getNewReleases(limit, skip);

    if (!spotifyData?.albums?.items) {
        throw new Error('Invalid Spotify response');
    }

    const total = spotifyData.albums.total || 0;

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

    return {
        totalAlbums: total,
        albums: albums,
        currentPage: page
    };
};

export const getUserListenLater = async (username, page = 1) => {
    const user = await User.findOne({ username }).select('_id');
    if (!user) {
        throw new Error("User not found.");
    }
    const userId = user._id;
    const limit = 12;
    const skip = (page - 1) * limit;

    const listenLater = await ListenLater.find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const albumsWithDetails = await Promise.all(
        listenLater.map(async (item) => {
            const album = await getAlbumDetails(item.albumId);
            album.lastAccessed = new Date();
            await album.save();

            return {
                ...album.toObject(),
                addedAt: item.createdAt
            };
        })
    );

    const total = await ListenLater.countDocuments({ userId });

    return {
        albums: albumsWithDetails,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        total
    };
};
