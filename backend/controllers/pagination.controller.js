import { pullSpotifyData } from "../lib/pullSpotifyData.js";
import Likes from "../models/likes.model.js";
import Listened from "../models/listened.model.js";
import ListenLater from "../models/listenlater.model.js";
import Rating from "../models/rating.model.js";
import Review from "../models/review.model.js";
import Comment from "../models/comment.model.js";
import User from "../models/user.model.js";

/**
 * getMusicPage - Get a list of all tracks the user has listened to
 * with related ratings and likes
 */
export const getMusicPage = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get listened tracks only
    const listenedItems = await Listened.find(
      { userId, itemType: "tracks" }, 
      { itemId: 1, itemType: 1, _id: 0 }
    )
      .sort({ _id: -1 })
      .limit(10);
    
    if (listenedItems.length === 0) {
      return res.status(200).json({ message: "No listened tracks found", data: [] });
    }
    
    // Extract itemIds for lookup
    const itemIds = listenedItems.map(item => item.itemId);
    
    // Finding related ratings and likes
    const ratings = await Rating.find(
      { userId, itemId: { $in: itemIds }, itemType: "tracks" },
      { itemId: 1, rating: 1, _id: 1 }
    ).sort({ _id: -1 });
    
    const likes = await Likes.find(
      { userId, itemId: { $in: itemIds }, itemType: "tracks" },
      { itemId: 1, _id: 0 }
    );
    
    // Mapping those related ratings and likes to listened items
    const ratingMap = new Map();
    
    ratings.forEach(r => {
      if (!ratingMap.has(r.itemId)) ratingMap.set(r.itemId, r.rating);
    });
    
    const likedItems = new Set(likes.map(like => like.itemId));
    
    // Fetch Spotify data for each item
    const spotifyDataPromises = listenedItems.map(async (item) => {
      return { itemId: item.itemId, data: await pullSpotifyData(`tracks/${item.itemId}`) };
    });
    
    const spotifyResults = await Promise.all(spotifyDataPromises);
    const spotifyMap = new Map(spotifyResults.map(result => [result.itemId, result.data]));
    
    // Returning response data
    const listenedData = listenedItems.map(item => {
      return {
        itemId: item.itemId,
        itemType: item.itemType,
        rating: ratingMap.get(item.itemId) || null,
        liked: likedItems.has(item.itemId),
        spotifyData: spotifyMap.get(item.itemId) || null
      };
    });
    
    res.status(200).json({ tracks: listenedData });
  } catch (error) {
    console.error("Error in getMusicPage:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * getAlbumPage - Get a list of all albums the user has listened to
 * with related ratings, reviews, and likes
 */
export const getAlbumPage = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const listenedItems = await Listened.find(
      { userId, itemType: "albums" }, 
      { itemId: 1, itemType: 1, _id: 0 }
    )
      .sort({ _id: -1 })
      .limit(10);
    
    if (listenedItems.length === 0) {
      return res.status(200).json({ message: "No listened albums found", data: [] });
    }
    
    const itemIds = listenedItems.map(item => item.itemId);
    
    const ratings = await Rating.find(
      { userId, itemId: { $in: itemIds }, itemType: "albums" },
      { itemId: 1, rating: 1, _id: 1 }
    ).sort({ _id: -1 });
    
    const reviews = await Review.find(
      { userId, itemId: { $in: itemIds }, itemType: 'albums' },
      { itemId: 1, _id: 1 }
    ).sort({ _id: -1 });
    
    const likes = await Likes.find(
      { userId, itemId: { $in: itemIds }, itemType: "albums" },
      { itemId: 1, _id: 0 }
    );
    
    const ratingMap = new Map();
    const reviewMap = new Map();
    
    ratings.forEach(r => {
      if (!ratingMap.has(r.itemId)) ratingMap.set(r.itemId, r.rating);
    });
    
    reviews.forEach(r => {
      if (!reviewMap.has(r.itemId)) reviewMap.set(r.itemId, r._id);
    });
    
    const likedItems = new Set(likes.map(like => like.itemId));
    
    const spotifyDataPromises = listenedItems.map(async (item) => {
      return { itemId: item.itemId, data: await pullSpotifyData(`albums/${item.itemId}`) };
    });
    
    const spotifyResults = await Promise.all(spotifyDataPromises);
    const spotifyMap = new Map(spotifyResults.map(result => [result.itemId, result.data]));
    
    const listenedData = listenedItems.map(item => {
      return {
        itemId: item.itemId,
        itemType: item.itemType,
        rating: ratingMap.get(item.itemId) || null,
        reviewId: reviewMap.get(item.itemId) || null,
        liked: likedItems.has(item.itemId),
        spotifyData: spotifyMap.get(item.itemId) || null
      };
    });
    
    res.status(200).json({ albums: listenedData });
  } catch (error) {
    console.error("Error in getAlbumPage:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * getLikesPage - Get a list of all songs and albums the user has liked
 * with related ratings, reviews, and listened status
 */
export const getLikesPage = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const likedItems = await Likes.find({userId}, { itemId: 1, itemType: 1, _id: 0 })
      .sort({ _id: -1 })
      .limit(10);
    
    if (likedItems.length === 0) {
      return res.status(200).json({ message: "No liked items found", data: [] });
    }
    
    const itemIds = likedItems.map(item => item.itemId);
    
    const ratings = await Rating.find(
      { userId, itemId: { $in: itemIds } },
      { itemId: 1, rating: 1, _id: 1, itemType: 1 }
    ).sort({ _id: -1 });
    
    const reviews = await Review.find(
      { userId, itemId: { $in: itemIds }, itemType: 'albums' },
      { itemId: 1, _id: 1, itemType: 1 }
    ).sort({ _id: -1 });
    
    const listened = await Listened.find(
      { userId, itemId: { $in: itemIds } },
      { itemId: 1, _id: 0, itemType: 1 }
    );
    
    const ratingMap = new Map();
    const reviewMap = new Map();
    
    ratings.forEach(r => {
      const key = `${r.itemId}-${r.itemType}`;
      if (!ratingMap.has(key)) ratingMap.set(key, r.rating);
    });
    
    reviews.forEach(r => {
      const key = `${r.itemId}-${r.itemType}`;
      if (!reviewMap.has(key)) reviewMap.set(key, r._id);
    });
    
    const listenedItems = new Set(listened.map(item => `${item.itemId}-${item.itemType}`));
    
    const likedData = likedItems.map(item => {
      const key = `${item.itemId}-${item.itemType}`;
      return {
        itemId: item.itemId,
        itemType: item.itemType,
        rating: ratingMap.get(key) || null,
        reviewId: reviewMap.get(key) || null,
        listened: listenedItems.has(key)
      };
    });
    
    res.status(200).json({ likes: likedData });
  } catch (error) {
    console.error("Error in getLikesPage:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * getListenLaterPage - Get a list of all songs and albums the user has added to listen later
 */
export const getListenLaterPage = async (req, res) => {
  try {
    const userId = req.user._id;
    // const { itemType } = req.query;
  
    const listenLaterItems = await ListenLater.find({userId}, { itemId: 1, itemType: 1, _id: 0 })
      .sort({ _id: -1 })
      .limit(10);
    
    if (listenLaterItems.length === 0) {
      return res.status(200).json({ message: "No listen later items found", data: [] });
    }
    
    const total = await ListenLater.countDocuments({ userId });
    res.status(200).json({ total, results: listenLaterItems });
  } catch (error) {
    console.error("Error in getListenLaterPage:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * getUserReview - Get a specific review by ID
 */
export const getUserReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    
    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ message: "Review Not Found" });
    
    // Check if the review belongs to the user
    if (review.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "This review doesn't belong to you" });
    }
    
    const rating = await Rating.findOne(
      { userId: review.userId, itemId: review.itemId, itemType: review.itemType },
      { rating: 1, _id: 0 }
    );
    
    const liked = await Likes.exists({ 
      userId: review.userId, 
      itemId: review.itemId, 
      itemType: review.itemType 
    });
    
    const comments = await Comment.find({ reviewId })
//       .populate('userId', 'username profilePicture');    
    res.json({
      reviewId: review._id,
      itemId: review.itemId,
      itemType: review.itemType,
      reviewText: review.reviewText,
      createdAt: review.createdAt,
      rating: rating?.rating || null,
      liked: !!liked,
      comments,
    });
  } catch (error) {
    console.error("Error in getUserReview:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * getUserTrack - Get a specific track by ID
 */
export const getUserTrack = async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.user._id;
    
    // Check if the user has listened to this track
    const listened = await Listened.findOne({ userId, itemId, itemType: "tracks" });
    if (!listened) {
      return res.status(404).json({ message: "Track not found in your listened items" });
    }
    
    const rating = await Rating.findOne(
      { userId, itemId, itemType: "tracks" },
      { rating: 1, _id: 0 }
    );
    
    const liked = await Likes.exists({ userId, itemId, itemType: "tracks" });
    const listenLater = await ListenLater.exists({ userId, itemId, itemType: "tracks" });
  
    res.json({
      itemId,
      itemType: "tracks",
      listenedAt: listened.createdAt,
      rating: rating?.rating || null,
      liked: !!liked,
      inListenLater: !!listenLater,

    });
  } catch (error) {
    console.error("Error in getUserTrack:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * getUserAlbum - Get a specific album by ID
 */
export const getUserAlbum = async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.user._id;
    
    // Check if the user has listened to this album
    const listened = await Listened.findOne({ userId, itemId, itemType: "albums" });
    if (!listened) {
      return res.status(404).json({ message: "Album not found in your listened items" });
    }
    
    const rating = await Rating.findOne(
      { userId, itemId, itemType: "albums" },
      { rating: 1, _id: 0 }
    );
    
    const review = await Review.findOne(
      { userId, itemId, itemType: "albums" },
      { _id: 1, reviewText: 1, createdAt: 1 }
    );
    
    const liked = await Likes.exists({ userId, itemId, itemType: "albums" });
    const listenLater = await ListenLater.exists({ userId, itemId, itemType: "albums" });
    
    // Get comments if there's a review
    let comments = [];
    if (review) {
      comments = await Comment.find({ reviewId: review._id })
  //       .populate('userId', 'username profilePicture');
    }
    
    res.json({
      itemId,
      itemType: "albums",
      listenedAt: listened.createdAt,
      rating: rating?.rating || null,
      review: review ? {
        reviewId: review._id,
        reviewText: review.reviewText,
        createdAt: review.createdAt,
        comments
      } : null,
      liked: !!liked, //will return true or false
      inListenLater: !!listenLater, //will return true or false
    });
  } catch (error) {
    console.error("Error in getUserAlbum:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
