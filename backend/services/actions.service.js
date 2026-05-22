import Likes from "../models/likes.model.js";
import Listened from "../models/listened.model.js";
import ListenLater from "../models/listenLater.model.js";
import Rating from "../models/rating.model.js";
import Review from "../models/review.model.js";
import Comment from "../models/comment.model.js";
import { getOrCreateAlbum, getOrCreateTrack } from "../lib/spotifyCache.js";
import { AppError } from "../lib/AppError.js";

const ensureSpotifyItem = (itemId, itemType) =>
    itemType === "albums"
        ? getOrCreateAlbum(itemId)
        : getOrCreateTrack(itemId);

export const toggleLike = async (userId, albumId) => {
    if (!albumId) throw new AppError("albumId is required.", 400);

    await getOrCreateAlbum(albumId);

    const existingLike = await Likes.findOne({ userId, albumId });

    if (existingLike) {
        await Likes.deleteOne({ _id: existingLike._id });
        return { message: "Like removed." };
    }

    await Likes.create({ userId, albumId });
    await Listened.findOneAndUpdate(
        { userId, albumId },
        { userId, albumId },
        { upsert: true, new: true }
    );
    await ListenLater.deleteOne({ userId, albumId });

    return { message: "Album liked, marked as listened, and removed from Listen Later." };
};

export const addRating = async (userId, { itemType, itemId, rating }) => {
    if (!itemId) throw new AppError("itemId is required.", 400);
    if (!itemType || (itemType !== "tracks" && itemType !== "albums")) {
        throw new AppError("Valid itemType (tracks or albums) is required.", 400);
    }
    if (typeof rating !== "number" || isNaN(rating) || rating < 0 || rating > 100 || rating % 0.5 !== 0) {
        throw new AppError("Rating must be a number between 0 and 100", 400);
    }

    await ensureSpotifyItem(itemId, itemType);

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
    if (!itemId) throw new AppError("itemId is required.", 400);
    if (!itemType || (itemType !== "tracks" && itemType !== "albums")) {
        throw new AppError("Valid itemType (tracks or albums) is required.", 400);
    }

    const existingRating = await Rating.findOne({ userId, itemId, itemType });
    return existingRating ? existingRating.rating : null;
};

export const toggleListened = async (userId, albumId) => {
    if (!albumId) throw new AppError("albumId is required.", 400);

    await getOrCreateAlbum(albumId);

    const existingListened = await Listened.findOne({ userId, albumId });

    if (existingListened) {
        await Listened.deleteOne({ _id: existingListened._id });
        return { message: "Album removed from listened." };
    }

    await Listened.create({ userId, albumId });
    return { message: "album marked as listened." };
};

export const toggleListenLater = async (userId, albumId) => {
    if (!albumId) throw new AppError("albumId is required.", 400);

    await getOrCreateAlbum(albumId);

    const existingEntry = await ListenLater.findOne({ userId, albumId });

    if (existingEntry) {
        await ListenLater.deleteOne({ _id: existingEntry._id });
        return { message: "Album removed from Listen Later." };
    }

    const newEntry = await ListenLater.create({ userId, albumId });
    return { message: "Album added to Listen Later.", doc: newEntry };
};

export const deleteRating = async (userId, { itemType, itemId }) => {
    if (!itemId || !itemType) throw new AppError("itemId and itemType are required.", 400);
    if (!['albums', 'tracks'].includes(itemType)) {
        throw new AppError("Invalid itemType. Must be 'albums' or 'tracks'", 400);
    }

    const existingRating = await Rating.findOne({ userId, itemId, itemType });
    if (!existingRating) {
        throw new AppError("No existing rating found.", 404);
    }

    await existingRating.deleteOne();
    return { message: "Rating deleted successfully." };
};

export const addReview = async (userId, { albumId, reviewText }) => {
    if (!albumId || !reviewText) throw new AppError("albumId and reviewText are required.", 400);
    if (reviewText.trim() === '') {
        throw new AppError("Review text cannot be empty.", 400);
    }

    await getOrCreateAlbum(albumId);

    const existingReview = await Review.findOne({ userId, albumId });
    if (existingReview) {
        throw new AppError(
            "You have already reviewed this album. Please edit your existing review instead.",
            409
        );
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
    if (!reviewText) throw new AppError("Review text is required.", 400);
    if (!albumId) throw new AppError("albumId is required.", 400);

    const existingReview = await Review.findOne({ userId, albumId });
    if (!existingReview) {
        throw new AppError("Review not found.", 404);
    }

    existingReview.reviewText = reviewText;
    await existingReview.save();
    return existingReview;
};

export const deleteReview = async (userId, albumId) => {
    if (!albumId) throw new AppError("albumId is required.", 400);

    const existingReview = await Review.findOne({ userId, albumId });
    if (!existingReview) {
        throw new AppError("Review not found.", 404);
    }

    await existingReview.deleteOne();
    return { message: "Review deleted." };
};

export const addComment = async (userId, { reviewId, commentText }) => {
    if (!commentText || !reviewId) {
        throw new AppError("reviewId and commentText are required.", 400);
    }
    if (typeof commentText !== "string" || commentText.trim() === "") {
        throw new AppError("Invalid comment.", 400);
    }

    const existingReview = await Review.findOne({ _id: reviewId, userId });
    if (!existingReview) {
        throw new AppError("Invalid review id.", 400);
    }
    const newComment = await Comment.create({ userId, reviewId, commentText });
    return newComment;
};

export const deleteComment = async (userId, commentId) => {
    if (!commentId) throw new AppError("commentId is required.", 400);

    const existingComment = await Comment.findOne({ _id: commentId, userId });
    if (!existingComment) {
        throw new AppError("Comment not found or unauthorized.", 404);
    }

    await existingComment.deleteOne();
    return { message: "Comment deleted." };
};

export const getReviews = async (albumId) => {
    if (!albumId) throw new AppError("albumId is required.", 400);

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
    if (!reviewId) throw new AppError("reviewId is required.", 400);

    const review = await Review.findById(reviewId);
    if (!review) {
        throw new AppError("Review not found.", 404);
    }

    const userHasLiked = review.likedBy.includes(userId);

    if (userHasLiked) {
        review.likes = Math.max(0, review.likes - 1);
        review.likedBy = review.likedBy.filter(id => !id.equals(userId));
        await review.save();
        return { message: "Review unliked.", likes: review.likes };
    }

    review.likes += 1;
    review.likedBy.push(userId);
    await review.save();
    return { message: "Review liked.", likes: review.likes };
};

export const getActions = async (userId, albumId) => {
    if (!albumId) throw new AppError("albumId is required.", 400);

    const album = await getOrCreateAlbum(albumId);
    if (!album) {
        throw new AppError("Album not found.", 404);
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
    if (!trackId) throw new AppError("trackId is required.", 400);

    const rating = await Rating.findOne(
        { userId, itemId: trackId, itemType: 'tracks' },
        { rating: 1, _id: 0 }
    );

    return {
        rating: rating ? rating.rating : null
    };
};

export const getTrackRatingsBatch = async (userId, trackIds) => {
    if (!trackIds?.length) return {};

    const ratings = await Rating.find({
        userId,
        itemType: "tracks",
        itemId: { $in: trackIds },
    });

    return Object.fromEntries(ratings.map((r) => [r.itemId, r.rating]));
};
