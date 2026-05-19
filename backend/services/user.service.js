import User from "../models/user.model.js";
import Album from "../models/album.model.js";
import Rating from "../models/rating.model.js";
import Review from "../models/review.model.js";
import Likes from "../models/likes.model.js";
import Listened from "../models/listened.model.js";
import ListenLater from "../models/listenLater.model.js";
import { AppError } from "../lib/AppError.js";

export const followUser = async (currentUserId, targetUserId) => {
    if (currentUserId === targetUserId) {
        throw new AppError("You cannot follow yourself.", 400);
    }

    const currUser = await User.findById(currentUserId);
    const tarUser = await User.findById(targetUserId);

    if (!tarUser) {
        throw new AppError("Target user not found.", 404);
    }

    if (currUser.following.includes(targetUserId)) {
        throw new AppError("Already following this user.", 409);
    }

    currUser.following.push(targetUserId);
    tarUser.followers.push(currentUserId);

    await currUser.save();
    await tarUser.save();

    return { message: "Successfully followed user." };
};

export const unfollowUser = async (currentUserId, targetUserId) => {
    const currUser = await User.findById(currentUserId);
    const tarUser = await User.findById(targetUserId);

    if (!tarUser) {
        throw new AppError("Target user not found.", 404);
    }

    if (!currUser.following.includes(targetUserId)) {
        throw new AppError("You are not following this user.", 400);
    }

    currUser.following = currUser.following.filter(
        (id) => id.toString() !== targetUserId
    );

    tarUser.followers = tarUser.followers.filter(
        (id) => id.toString() !== currentUserId
    );

    await currUser.save();
    await tarUser.save();

    return { message: "Successfully unfollowed user." };
};

const toAlbumSummary = (album) =>
    album
        ? {
              albumId: album.albumId,
              name: album.name,
              images: album.images,
              artists: album.artists?.map((a) => ({
                  spotifyId: a.spotifyId,
                  name: a.name,
              })),
              release_date: album.release_date,
          }
        : null;

const buildFavourites = async (favouriteIds = []) => {
    if (!favouriteIds.length) return [];

    const albums = await Album.find({ albumId: { $in: favouriteIds } });
    const byId = new Map(albums.map((a) => [a.albumId, a]));

    return favouriteIds
        .map((id) => toAlbumSummary(byId.get(id)))
        .filter(Boolean);
};

export const getUserProfile = async (userId) => {
    const user = await User.findById(userId).select("-password");
    if (!user) {
        throw new AppError("User not found.", 404);
    }

    await user.populate("followers", "username");
    await user.populate("following", "username");

    const [favourites, albumsCount, reviewsCount, likesCount, listenLaterCount, listenedCount, recentReviewsRaw] =
        await Promise.all([
            buildFavourites(user.favourites),
            Rating.countDocuments({ userId: user._id, itemType: "albums" }),
            Review.countDocuments({ userId: user._id }),
            Likes.countDocuments({ userId: user._id }),
            ListenLater.countDocuments({ userId: user._id }),
            Listened.countDocuments({ userId: user._id }),
            Review.find({ userId: user._id })
                .sort({ createdAt: -1 })
                .limit(3)
                .select("reviewText albumId createdAt"),
        ]);

    const recentReviewAlbums = await Album.find({
        albumId: { $in: recentReviewsRaw.map((r) => r.albumId) },
    });
    const recentReviewRatings = await Rating.find({
        userId: user._id,
        itemType: "albums",
        itemId: { $in: recentReviewsRaw.map((r) => r.albumId) },
    });

    const albumById = new Map(recentReviewAlbums.map((a) => [a.albumId, a]));
    const ratingById = new Map(
        recentReviewRatings.map((r) => [r.itemId, r.rating])
    );

    const recentReviews = recentReviewsRaw.map((r) => {
        const album = albumById.get(r.albumId);
        return {
            _id: r._id,
            reviewText: r.reviewText,
            albumId: r.albumId,
            createdAt: r.createdAt,
            albumTitle: album?.name || "Unknown Album",
            albumImage: album?.images?.[0]?.url || null,
            rating: ratingById.has(r.albumId) ? ratingById.get(r.albumId) : null,
        };
    });

    const profile = user.toObject();
    profile.favourites = favourites;
    profile.stats = {
        albums: albumsCount,
        reviews: reviewsCount,
        likes: likesCount,
        listenLater: listenLaterCount,
        listened: listenedCount,
    };
    profile.recentReviews = recentReviews;

    return profile;
};
