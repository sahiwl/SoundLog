import User, { IUser } from "../models/user.model.js";
import Album, { IAlbum } from "../models/album.model.js";
import Rating from "../models/rating.model.js";
import Review from "../models/review.model.js";
import Likes from "../models/likes.model.js";
import Listened from "../models/listened.model.js";
import ListenLater from "../models/listenLater.model.js";
import { AppError } from "../lib/AppError.js";
import { Types } from "mongoose";

type ObjectId = Types.ObjectId;
type UserId = string | ObjectId;

interface FollowUserResult {
    message: string;
}

interface AlbumSummary {
    albumId: string;
    name: string;
    images: IAlbum["images"];
    artists: { spotifyId: string; name: string }[];
    release_date?: string;
}

interface RecentReviewSummary {
    _id: ObjectId;
    reviewText: string;
    albumId: string;
    createdAt?: Date;
    albumTitle: string;
    albumImage: string | null;
    rating: number | null;
}

interface UserProfileStats {
    albums: number;
    reviews: number;
    likes: number;
    listenLater: number;
    listened: number;
}

export type UserProfile = {
    _id: ObjectId;
    email: string;
    username: string;
    bio?: string;
    profilePic?: string;
    googleId?: string;
    followers: IUser["followers"];
    following: IUser["following"];
    createdAt?: Date;
    updatedAt?: Date;
    favourites: AlbumSummary[];
    stats: UserProfileStats;
    recentReviews: RecentReviewSummary[];
};
export const followUser = async (
    currentUserId: UserId,
    targetUserId: UserId
): Promise<FollowUserResult> => {
    if (currentUserId.toString() === targetUserId.toString()) {
        throw new AppError("You cannot follow yourself.", 400);
    }

    const currUser = await User.findById(currentUserId);
    const tarUser = await User.findById(targetUserId);

    if (!currUser) {
        throw new AppError("Current user not found.", 404);
    }
    if (!tarUser) {
        throw new AppError("Target user not found.", 404);
    }

    if (currUser.following.map(id => id.toString()).includes(targetUserId.toString())) {
        throw new AppError("Already following this user.", 409);
    }

    currUser.following.push(typeof targetUserId === "string" ? new Types.ObjectId(targetUserId) : targetUserId);
    tarUser.followers.push(typeof currentUserId === "string" ? new Types.ObjectId(currentUserId) : currentUserId);

    await currUser.save();
    await tarUser.save();

    return { message: "Successfully followed user." };
};

export const unfollowUser = async (
    currentUserId: UserId,
    targetUserId: UserId
): Promise<FollowUserResult> => {
    const currUser = await User.findById(currentUserId);
    const tarUser = await User.findById(targetUserId);

    if (!currUser) {
        throw new AppError("Current user not found.", 404);
    }
    if (!tarUser) {
        throw new AppError("Target user not found.", 404);
    }

    if (!currUser.following.map(id => id.toString()).includes(targetUserId.toString())) {
        throw new AppError("You are not following this user.", 400);
    }

    currUser.following = currUser.following.filter(
        (id: ObjectId) => id.toString() !== targetUserId.toString()
    );

    tarUser.followers = tarUser.followers.filter(
        (id: ObjectId) => id.toString() !== currentUserId.toString()
    );

    await currUser.save();
    await tarUser.save();

    return { message: "Successfully unfollowed user." };
};

const toAlbumSummary = (album?: IAlbum | null): AlbumSummary | null =>
    album
        ? {
              albumId: album.albumId,
              name: album.name,
              images: album.images,
              artists: album.artists?.map((a) => ({
                  spotifyId: a.spotifyId,
                  name: a.name,
              })) ?? [],
              release_date: album.release_date,
          }
        : null;

const buildFavourites = async (
    favouriteIds: string[] = []
): Promise<AlbumSummary[]> => {
    if (!favouriteIds.length) return [];

    const albums = await Album.find({ albumId: { $in: favouriteIds } }).exec();
    const byId = new Map(albums.map((a) => [a.albumId, a]));

    return favouriteIds
        .map((id) => toAlbumSummary(byId.get(id)))
        .filter((a): a is AlbumSummary => Boolean(a));
};

export const getUserProfile = async (userId: UserId): Promise<UserProfile> => {
    const user = await User.findById(userId).select("-password");
    if (!user) {
        throw new AppError("User not found.", 404);
    }

    await user.populate([
        { path: "followers", select: "username" },
        { path: "following", select: "username" },
    ]);

    const [
        favourites,
        albumsCount,
        reviewsCount,
        likesCount,
        listenLaterCount,
        listenedCount,
        recentReviewsRaw,
    ] = await Promise.all([
        buildFavourites(user.favourites as string[]),
        Rating.countDocuments({ userId: user._id, itemType: "albums" }),
        Review.countDocuments({ userId: user._id }),
        Likes.countDocuments({ userId: user._id }),
        ListenLater.countDocuments({ userId: user._id }),
        Listened.countDocuments({ userId: user._id }),
        Review.find({ userId: user._id })
            .sort({ createdAt: -1 })
            .limit(3)
            .select("reviewText albumId createdAt")
            .exec(),
    ]);

    const recentReviewAlbumIds = recentReviewsRaw.map((r) => r.albumId);

    const recentReviewAlbums = await Album.find({
        albumId: { $in: recentReviewAlbumIds },
    }).exec();
    const recentReviewRatings = await Rating.find({
        userId: user._id,
        itemType: "albums",
        itemId: { $in: recentReviewAlbumIds },
    }).exec();

    const albumById = new Map(recentReviewAlbums.map((a) => [a.albumId, a]));
    const ratingById = new Map<string, number>(
        recentReviewRatings.map((r) => [r.itemId, r.rating])
    );

    const recentReviews: RecentReviewSummary[] = recentReviewsRaw.map((r) => {
        const album = albumById.get(r.albumId);
        return {
            _id: r._id,
            reviewText: r.reviewText,
            albumId: r.albumId,
            createdAt: r.createdAt,
            albumTitle: album?.name || "Unknown Album",
            albumImage: album?.images?.[0]?.url || null,
            rating: ratingById.has(r.albumId) ? ratingById.get(r.albumId)! : null,
        };
    });

    const { password: _password, favourites: _favourites, ...userFields } = user.toObject();

    return {
        ...userFields,
        favourites,
        stats: {
            albums: albumsCount,
            reviews: reviewsCount,
            likes: likesCount,
            listenLater: listenLaterCount,
            listened: listenedCount,
        },
        recentReviews,
    };
};
