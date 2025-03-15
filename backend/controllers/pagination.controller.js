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
    
    // Get listened albums only
    const listenedItems = await Listened.find(
      { userId, itemType: "albums" }, 
      { itemId: 1, itemType: 1, _id: 0 }
    )
      .sort({ _id: -1 })
      .limit(10);
    
    if (listenedItems.length === 0) {
      return res.status(200).json({ message: "No listened albums found", data: [] });
    }
    
    // Extract itemIds for lookup
    const itemIds = listenedItems.map(item => item.itemId);
    
    // Finding related ratings, reviews, likes
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
    
    // Mapping those related ratings, reviews, likes to listened items
    const ratingMap = new Map();
    const reviewMap = new Map();
    
    ratings.forEach(r => {
      if (!ratingMap.has(r.itemId)) ratingMap.set(r.itemId, r.rating);
    });
    
    reviews.forEach(r => {
      if (!reviewMap.has(r.itemId)) reviewMap.set(r.itemId, r._id);
    });
    
    const likedItems = new Set(likes.map(like => like.itemId));
    
    // Fetch Spotify data for each item
    const spotifyDataPromises = listenedItems.map(async (item) => {
      return { itemId: item.itemId, data: await pullSpotifyData(`albums/${item.itemId}`) };
    });
    
    const spotifyResults = await Promise.all(spotifyDataPromises);
    const spotifyMap = new Map(spotifyResults.map(result => [result.itemId, result.data]));
    
    // Returning response data
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
    
    // Get liked items
    const likedItems = await Likes.find({userId}, { itemId: 1, itemType: 1, _id: 0 })
      .sort({ _id: -1 })
      .limit(10);
    
    if (likedItems.length === 0) {
      return res.status(200).json({ message: "No liked items found", data: [] });
    }
    
    // Extract itemIds for lookup
    const itemIds = likedItems.map(item => item.itemId);
    
    // Finding related ratings, reviews, listened
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
    
    // Mapping those related ratings, reviews, listened to liked items
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
    
    // Returning response data
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
    

    // Get listen later items
    const listenLaterItems = await ListenLater.find({userId}, { itemId: 1, itemType: 1, _id: 0 })
      .sort({ _id: -1 })
      .limit(10);
    
    if (listenLaterItems.length === 0) {
      return res.status(200).json({ message: "No listen later items found", data: [] });
    }
    
    // // Fetch Spotify data for each item
    // const spotifyDataPromises = listenLaterItems.map(async (item) => {
    //   const endpoint = item.itemType === "albums" ? `albums/${item.itemId}` : `tracks/${item.itemId}`;
    //   return { itemId: item.itemId, itemType: item.itemType, data: await pullSpotifyData(endpoint) };
    // });
    
    // const spotifyResults = await Promise.all(spotifyDataPromises);
    // const spotifyMap = new Map(spotifyResults.map(result => [
    //   `${result.itemId}-${result.itemType}`, result.data
    // ]));
    
    const total = await ListenLater.countDocuments({ userId });
    // Returning response data
    
    
    res.status(200).json({ total, results: listenLaterItems });
  } catch (error) {
    console.error("Error in getListenLaterPage:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * getReviewsPage - Get a list of all albums the user has reviewed
 * with related ratings and likes
 */
export const getReviewsPage = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Reviews are only for albums
    const reviews = await Review.find({ userId, itemType: 'albums' }, 
      { itemId: 1, reviewText: 1, _id: 1, createdAt: 1, itemType: 1 })
      .sort({ _id: -1 })
      .limit(10);
    
    if (reviews.length === 0) {
      return res.status(200).json({ message: "No reviews found", data: [] });
    }
    
    // Extract itemIds for lookup
    const itemIds = reviews.map(review => review.itemId);
    const reviewIds = reviews.map(review => review._id);
    
    // Finding related ratings, likes, comments
    const ratings = await Rating.find(
      { userId, itemId: { $in: itemIds }, itemType: 'albums' },
      { itemId: 1, rating: 1, _id: 1 }
    );
    
    const likes = await Likes.find(
      { userId, itemId: { $in: itemIds }, itemType: 'albums' },
      { itemId: 1, _id: 0 }
    );
    
    const comments = await Comment.find(
      { reviewId: { $in: reviewIds } },
      { reviewId: 1, _id: 1 }
    );
    
    // Mapping those related ratings, likes, comments to reviews
    const ratingMap = new Map();
    ratings.forEach(r => {
      if (!ratingMap.has(r.itemId)) ratingMap.set(r.itemId, r.rating);
    });
    
    const likedItems = new Set(likes.map(like => like.itemId));
    
    // Count comments per review
    const commentCountMap = new Map();
    comments.forEach(c => {
      const reviewId = c.reviewId.toString();
      commentCountMap.set(reviewId, (commentCountMap.get(reviewId) || 0) + 1);
    });
    
    // Fetch Spotify data for each item
    // const spotifyDataPromises = reviews.map(async (review) => {
    //   return { itemId: review.itemId, data: await pullSpotifyData(`albums/${review.itemId}`) };
    // });
    
    // const spotifyResults = await Promise.all(spotifyDataPromises);
    // const spotifyMap = new Map(spotifyResults.map(result => [result.itemId, result.data]));
    
    // Returning response data
    const reviewsData = reviews.map(review => {
      return {
        reviewId: review._id,
        itemId: review.itemId,
        itemType: review.itemType,
        reviewText: review.reviewText,
        createdAt: review.createdAt,
        rating: ratingMap.get(review.itemId) || null,
        liked: likedItems.has(review.itemId),
        commentCount: commentCountMap.get(review._id.toString()) || 0,
        // spotifyData: spotifyMap.get(review.itemId) || null
      };
    });
    
    res.status(200).json({ reviews: reviewsData });
  } catch (error) {
    console.error("Error in getReviewsPage:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
