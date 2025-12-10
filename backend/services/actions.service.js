import { searchSpotifyData } from "../lib/pullSpotifyData.js";
import Likes from "../models/likes.model.js";
import Listened from "../models/listened.model.js";
import ListenLater from "../models/listenLater.model.js";
import Rating from "../models/rating.model.js";
import Review from "../models/review.model.js";
import Comment from "../models/comment.model.js";
import Album from "../models/album.model.js";
import Track from "../models/track.model.js";

/**
 * Utility function to get or create album/track data from Spotify
 */
export const getOrCreateSpotifyData = async (itemId, itemType) => {
    // Check if item exists in database
    let item;
    if (itemType === 'albums') {
        item = await Album.findOne({ albumId: itemId });
        if (!item) {
            const spotifyData = await searchSpotifyData(`${itemType}/${itemId}`);
            if (!spotifyData || spotifyData.error) {
                throw new Error(`${itemType.slice(0, -1)} not found on Spotify.`);
            }
            item = await Album.create({
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
                genres: spotifyData.genres,
                lastAccessed: new Date(),
                createdAt: new Date()
            });
        } else {
            // Update lastAccessed timestamp
            item.lastAccessed = new Date();
            await item.save();
        }
    } else {
        item = await Track.findOne({ trackId: itemId });
        if (!item) {
            const spotifyData = await searchSpotifyData(`${itemType}/${itemId}`);
            if (!spotifyData || spotifyData.error) {
                throw new Error(`${itemType.slice(0, -1)} not found on Spotify.`);
            }
            item = await Track.create({
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
                linked_from: spotifyData.linked_from,
                lastAccessed: new Date(),
                createdAt: new Date()
            });
        } else {
            // Update lastAccessed timestamp
            item.lastAccessed = new Date();
            await item.save();
        }
    }
    return item;
};

export const toggleLike = async (userId, albumId) => {
    if (!albumId) throw new Error("albumId is required.");

    await getOrCreateSpotifyData(albumId, 'albums');

    const existingLike = await Likes.findOne({ userId, albumId });

    if (existingLike) {
        await Likes.deleteOne({ _id: existingLike._id });
        return { message: "Like removed." };
    } else {
        await Likes.create({ userId, albumId });
        await Listened.findOneAndUpdate(
            { userId, albumId },
            { userId, albumId },
            { upsert: true, new: true }
        );
        await ListenLater.deleteOne({ userId, albumId });

        return { message: "Album liked, marked as listened, and removed from Listen Later." };
    }
};

export const addRating = async (userId, { itemType, itemId, rating }) => {
    if (!itemId) throw new Error("itemId is required.");
    if (!itemType || (itemType !== "tracks" && itemType !== "albums")) {
        throw new Error("Valid itemType (tracks or albums) is required.");
    }
    if (typeof rating !== "number" || isNaN(rating) || rating < 0 || rating > 100 || rating % 0.5 !== 0) {
        throw new Error("Rating must be a number between 0 and 100");
    }

    await getOrCreateSpotifyData(itemId, itemType);

    const existingRating = await Rating.findOne({ userId, itemId, itemType });
    if (existingRating) {
        await existingRating.deleteOne();
    }

    const newRating = await Rating.create({ userId, itemId, rating, itemType });

    if (itemType === "albums") {
        await ListenLater.deleteOne({ userId, albumId: itemId });
        const existingListened = await Listened.findOne({ userId, albumId: itemId });
        if (!existingListened) {
            await Listened.create({ userId, albumId: itemId });
        }
    }
    return newRating;
};

export const getRating = async (userId, { itemType, itemId }) => {
    if (!itemId) throw new Error("itemId is required.");
    if (!itemType || (itemType !== "tracks" && itemType !== "albums")) {
        throw new Error("Valid itemType (tracks or albums) is required.");
    }

    const existingRating = await Rating.findOne({ userId, itemId, itemType });
    return existingRating ? existingRating.rating : null;
};

export const toggleListened = async (userId, albumId) => {
    if (!albumId) throw new Error("albumId is required.");

    await getOrCreateSpotifyData(albumId, 'albums');

    const existingListened = await Listened.findOne({ userId, albumId });

    if (existingListened) {
        await Listened.deleteOne({ _id: existingListened._id });
        return { message: "Album removed from listened." };
    }

    await Listened.create({ userId, albumId });
    return { message: "album marked as listened." };
};

export const toggleListenLater = async (userId, albumId) => {
    if (!albumId) throw new Error("albumId is required.");

    await getOrCreateSpotifyData(albumId, 'albums');

    const existingEntry = await ListenLater.findOne({ userId, albumId });

    if (existingEntry) {
        await ListenLater.deleteOne({ _id: existingEntry._id });
        return { message: "Album removed from Listen Later." };
    } else {
        const newEntry = await ListenLater.create({ userId, albumId });
        return { message: "Album added to Listen Later.", doc: newEntry };
    }
};

export const deleteRating = async (userId, { itemType, itemId }) => {
    if (!itemId || !itemType) throw new Error("itemId and itemType are required.");
    if (!['albums', 'tracks'].includes(itemType)) {
        throw new Error("Invalid itemType. Must be 'albums' or 'tracks'");
    }

    const existingRating = await Rating.findOne({ userId, itemId, itemType });

    if (!existingRating) {
        throw new Error("No existing rating found.");
    }

    await existingRating.deleteOne();
    return { message: "Rating deleted successfully." };
};

export const addReview = async (userId, { albumId, reviewText }) => {
    if (!albumId || !reviewText) throw new Error("albumId and reviewText are required.");

    await getOrCreateSpotifyData(albumId, 'albums');

    const existingReview = await Review.findOne({ userId, albumId });
    if (existingReview) {
        throw new Error("You have already reviewed this album. Please edit your existing review instead.");
    }

    if (reviewText.trim() === '') {
        throw new Error("Review text cannot be empty.");
    }

    const newReview = await Review.create({ userId, albumId, reviewText });

    const existingListened = await Listened.findOne({ userId, albumId });
    if (!existingListened) {
        await Listened.create({ userId, albumId });
    }

    await ListenLater.deleteOne({ userId, albumId });

    return newReview;
};

export const updateReview = async (userId, { albumId, reviewText }) => {
    if (!reviewText) throw new Error("Bro, Review text is required.");
    if (!albumId) throw new Error("albumId is required.");

    const existingReview = await Review.findOne({ userId, albumId });
    if (!existingReview) {
        throw new Error("Review not found.");
    }

    existingReview.reviewText = reviewText;
    await existingReview.save();
    return existingReview;
};

export const deleteReview = async (userId, albumId) => {
    if (!albumId) throw new Error("itemId is required.");

    const existingReview = await Review.findOne({ userId, albumId });
    if (!existingReview) {
        throw new Error("Review not found.");
    }

    await existingReview.deleteOne();
    return { message: "Review deleted." };
};

export const addComment = async (userId, { reviewId, commentText }) => {
    if (!commentText || !reviewId) throw new Error("reivewId and commentText are required. check those fields");
    if (typeof commentText !== "string" || commentText.trim() === "") throw new Error("Invalid Comment");

    const existingReview = await Review.findOne({ _id: reviewId, userId })
    if (!existingReview) {
        throw new Error("Invalid review id");
    }
    const newComment = await Comment.create({ userId, reviewId, commentText });
    return newComment;
};

export const deleteComment = async (userId, commentId) => {
    if (!commentId) throw new Error("commentId is required.");

    const existingComment = await Comment.findOne({ _id: commentId, userId });
    if (!existingComment) {
        throw new Error("Comment not found or unauthorized.");
    }

    await existingComment.deleteOne();
    return { message: "Comment deleted." };
};

export const getReviews = async (albumId) => {
    if (!albumId) throw new Error("albumId is required.");

    const reviews = await Review.find({ albumId })
        .sort({ createdAt: -1 })
        .populate('userId', 'username')
        .populate('likedBy', 'username');

    const reviewsWithDetails = await Promise.all(
        reviews.map(async (review) => {
            const comments = await Comment.find({ reviewId: review._id })
                .populate('userId', 'username');

            return {
                reviewId: review._id,
                reviewText: review.reviewText,
                createdAt: review.createdAt,
                likes: review.likes,
                likedBy: review.likedBy.map(user => user._id),
                user: {
                    id: review.userId._id,
                    username: review.userId.username
                },
                commentCount: comments.length
            };
        })
    );

    return {
        reviews: reviewsWithDetails,
        totalReviews: reviewsWithDetails.length
    };
};

export const likeReview = async (userId, reviewId) => {
    if (!reviewId) throw new Error("reviewId is required.");

    const review = await Review.findById(reviewId);
    if (!review) {
        throw new Error("Review not found.");
    }

    const userHasLiked = review.likedBy.includes(userId);

    if (userHasLiked) {
        review.likes = Math.max(0, review.likes - 1);
        review.likedBy = review.likedBy.filter(id => !id.equals(userId));
        await review.save();
        return { message: "Review unliked.", likes: review.likes };
    } else {
        review.likes += 1;
        review.likedBy.push(userId);
        await review.save();
        return { message: "Review liked.", likes: review.likes };
    }
};

export const getActions = async (userId, albumId) => {
    if (!albumId) throw new Error("albumId is required.");

    const album = await getOrCreateSpotifyData(albumId, 'albums');
    if (!album) {
        throw new Error("Album Not Found");
    }

    const [listened, liked, listenLater, rating, review] = await Promise.all([
        Listened.exists({ userId, albumId }),
        Likes.exists({ userId, albumId }),
        ListenLater.exists({ userId, albumId }),
        Rating.findOne(
            { userId, itemId: albumId, itemType: 'albums' },
            { rating: 1, _id: 0 }
        ),
        Review.exists({ userId, albumId })
    ]);

    return {
        listened: !!listened,
        liked: !!liked,
        listenLater: !!listenLater,
        rating: rating ? rating.rating : null,
        reviewed: !!review
    };
};

export const getTrackActions = async (userId, trackId) => {
    if (!trackId) throw new Error("trackId is required.");

    const rating = await Rating.findOne(
        { userId, itemId: trackId, itemType: 'tracks' },
        { rating: 1, _id: 0 }
    );

    return {
        rating: rating ? rating.rating : null
    };
};
