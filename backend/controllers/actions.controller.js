import { searchSpotifyData } from "../lib/pullSpotifyData.js";
import Likes from "../models/likes.model.js";
import Listened from "../models/listened.model.js";
import ListenLater from "../models/listenlater.model.js";
// import Log from "../models/log.model.js";
import Rating from "../models/rating.model.js";
import Review from "../models/review.model.js";
import Comment from "../models/comment.model.js";
import user from "../models/user.model.js";
import Album from "../models/album.model.js";
import Track from "../models/track.model.js";

/**
 * Utility function to get or create album/track data from Spotify
 * @param {string} itemId - The Spotify ID of the album or track
 * @param {string} itemType - Either 'albums' or 'tracks'
 * @returns {Promise<Object>} The album or track data
 */
const getOrCreateSpotifyData = async (itemId, itemType) => {
    try {
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
                    release_date: spotifyData.release_date,
                    images: spotifyData.images,
                    artists: spotifyData.artists.map(artist => ({
                        id: artist.id,
                        name: artist.name
                    })),
                    external_urls: spotifyData.external_urls,
                    uri: spotifyData.uri
                });
            }
        } else {
            item = await Track.findOne({ trackId: itemId });
            if (!item) {
                const spotifyData = await searchSpotifyData(`${itemType}/${itemId}`);
                if (!spotifyData || spotifyData.error) {
                    throw new Error(`${itemType.slice(0, -1)} not found on Spotify.`);
                }
                item = await Track.create(spotifyData);
            }
        }
        return item;
    } catch (error) {
        console.error(`Error in getOrCreateSpotifyData for ${itemType}:`, error.message);
        throw error;
    }
};

/**
toggleLike - Toggle like state for a album. 
Expects: req.params.itemType (string: "track" or "album"), req.params.itemId (Spotify track/album ID as a string)
 */
// ✔️ - tested, revamped
export const toggleLike = async(req,res)=>{
    try {        
        const { albumId } = req.params;
        const userId = req.user._id;

        if (!albumId) {
            return res.status(400).json({ message: "albumId is required." });
        }

        // Use the utility function to get or create album data
        await getOrCreateSpotifyData(albumId, 'albums');

        const existingLike = await Likes.findOne({ userId, albumId });
        if (existingLike) {
            await Likes.deleteOne({ _id: existingLike._id });
            return res.status(200).json({ message: "Like removed." });
        } else {
            await Likes.create({ userId, albumId });
            // also mark it as listened here.
            const existingListened = await Listened.findOne({ userId, albumId });
            if (!existingListened) {
                await Listened.create({ userId, albumId });
            }
            // and same track will be removed from listenLater (if it exists there)
            await ListenLater.deleteOne({ userId, albumId });
            return res.status(200).json({ message: `Album liked, marked as listened, and removed from Listen Later (if it existed).` });
        }
    } catch (error) {
        console.error("Error in toggleLike:", error.message);
        return res.status(500).json({ message: "Internal Server Error, my boy" });
    }
}


/**
 addRating - Create a rating for a track or album. 
 When rating is set, remove any listenLater entry. (for albums only)
 Expects: req.params.itemType (string: "track" or "album"), req.params.itemId (Spotify track/album ID as a string), 
 req.body.rating (number between 0 and 100, )
 */
// ✔️ - tested, revamped
export const addRating = async (req, res) => {
    try {
        const { itemType, itemId } = req.params;
        const { rating } = req.body;
        const userId = req.user._id;
        
        if (!itemId) {
            return res.status(400).json({ message: "itemId is required." });
        }
        
        if (!itemType || (itemType !== "tracks" && itemType !== "albums")) {
            return res.status(400).json({ message: "Valid itemType (tracks or albums) is required." });
        }

        // Validate rating is a number between 0.5 and 5
        if (typeof rating !== "number" || isNaN(rating) || rating < 0 || rating > 100 || rating % 0.5 !== 0) {
            return res.status(400).json({ message: "Rating must be a number between 0 and 100" });
        }
            
        // Use the utility function to get or create item data
        await getOrCreateSpotifyData(itemId, itemType);
        
        // Check for existing rating
        const existingRating = await Rating.findOne({ userId, itemId, itemType });
        
        let newRating;
        if (existingRating) {
            // Update existing rating
            existingRating.rating = rating;
            newRating = await existingRating.save();
        } else {
            // Create new rating
            newRating = await Rating.create({ 
                userId, 
                itemId, 
                rating, 
                itemType 
            });
        }
          
        if(itemType === "albums"){
            // Remove from Listen Later if exists
            await ListenLater.deleteOne({ userId, albumId:itemId }); 
            
            // Mark as listened
            const existingListened = await Listened.findOne({ userId, albumId:itemId });
            if (!existingListened) {
                await Listened.create({ userId, albumId:itemId });
            }
        }

        return res.status(201).json({ 
            message: "Rating added successfully.", 
            rating: newRating 
        });

    } catch (error) {
        console.error("Error in addRating:", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}


/**
  toggleListened - Toggle whether a user has marked a album as listened. 
  Expects: req.params.albumId (Spotify album ID as a string). 
  When unmarking, if a rating exists for this album, the operation is forbidden.
 */
// ✔️ - tested,revamped
export const toggleListened = async (req,res) => {
    try {
        const { albumId} = req.params
        const userId = req.user._id

        if (!albumId) {
            return res.status(400).json({ message: "albumId is required." });
        }
        
        // Use the utility function to get or create album data
        await getOrCreateSpotifyData(albumId, 'albums');
        
        const existingRating = await Rating.findOne({ userId, itemId: albumId, itemType: "albums" });
        const existingReview = await Review.findOne({userId, albumId})

        //toggle off - remove from listened
        const existingListened = await Listened.findOne({ userId, albumId });
        
        if(existingListened){
            if(existingRating || existingReview){
                return res.status(400).json({ 
                    message: `Cannot unlisten an album as there is a review or rating. Remove those first.` 
                });
            }
            
            await Listened.deleteOne({ _id: existingListened._id})
            return res.status(200).json({ message: "Album removed from listened." });
        }
        
        // Mark as listened.
        await Listened.create({ userId, albumId});
        // Also, remove from Listen Later if exists.
        await ListenLater.deleteOne({ userId, albumId });
        return res.status(200).json({ message: "album marked as listened." });

    } catch (error) {
        console.error("Error in toggleListened:", error.message);
        return res.status(500).json({ message: "Internal Server Error, my boy" });
    }
}


/**
toggleListenLater - Toggle the "Listen Later" state for a track or album. 
Expects: req.params.itemType (string: "track" or "album"), req.params.itemId (Spotify track/album ID as a string). 
Behavior:
    - If the item is not in Listen Later, add it.
    - If the item is already in Listen Later, remove it.
    - In either case, duplicates are not allowed.
 */
// ✔️ - tested, revamped
export const toggleListenLater = async (req, res) => {
    try {
        const { albumId } = req.params;
        const userId = req.user._id;
        
        if (!albumId) {
            return res.status(400).json({ message: "albumId is required." });
        }
        
        // Use the utility function to get or create album data
        await getOrCreateSpotifyData(albumId, 'albums');
        
        // Check for existing entry in listen later
        const existingEntry = await ListenLater.findOne({ userId, albumId });
        
        if (existingEntry) {
            // If the album exists, remove it (toggle off)
            await ListenLater.deleteOne({ _id: existingEntry._id });
            return res.status(200).json({ message: "Album removed from Listen Later." });
        } else {
            // Otherwise, add the album to Listen Later
            const newEntry = await ListenLater.create({ userId, albumId });
            return res.status(200).json({ 
                message: "Album added to Listen Later.", 
                doc: newEntry 
            });
        }
        
    } catch (error) {
        console.error("Error in toggleListenLater:", error.message);
        return res.status(500).json({ message: "Internal Server Error, my boy" });    
    }
}

/** 
deleteRating - Explicitly delete the rating for a track. Expects: req.params.albumId
*/
// ✔️ - tested, revamped
export const deleteRating = async (req,res)=>{
    try {
        const {albumId} = req.params
        const userId = req.user._id


        if(!albumId) return res.status(400).json({ message: "albumId is required." });

        //deleting rating will also remove it from listened
        const existingRating = await Rating.findOne({userId, itemId:albumId, itemType:"albums"})
        if(existingRating){
            await existingRating.deleteOne()
            await Listened.deleteOne({userId, albumId})
            return res.status(200).json({ message: "Rating deleted." });
        }
        return res.status(400).json({message: "No existing rating for this album."})

    } catch (error) {
        console.error("Error in deleteRating:", error.message);
        return res.status(500).json({ message: "Internal Server Error, my boy" });
    }
}

/**
addReview - Add a review only for a album. When a review is added, automatically mark as listened and remove from Listen Later. Expects: req.params.itemType, req.params.itemId, req.body.reviewText (string)
*/
// ✔️ - tested, revamped
export const addReview = async (req, res) => {
    try {
        const { albumId } = req.params;
        const { reviewText } = req.body;
        const userId = req.user._id;
        
        if (!albumId || !reviewText) {
            return res.status(400).json({ message: "albumId and reviewText are required." });
        }
        
        // Use the utility function to get or create album data
        await getOrCreateSpotifyData(albumId, 'albums');
        
        // Check for existing review
        const existingReview = await Review.findOne({ userId, albumId });
        if (existingReview) {
            return res.status(400).json({ 
                message: "You have already reviewed this album. Please edit your existing review instead." 
            });
        }

        // Review text can't be empty
        if (reviewText.trim() === '') {
            return res.status(400).json({ message: "Review text cannot be empty." });
        }
        
        // Create review
        const newReview = await Review.create({
            userId,
            albumId,
            reviewText
        });
        
        // Mark as listened
        const existingListened = await Listened.findOne({ userId, albumId });
        if (!existingListened) {
            await Listened.create({ userId, albumId });
        }
        
        // Remove from listenLater if it exists
        await ListenLater.deleteOne({ userId, albumId });
        
        return res.status(201).json({ 
            message: "Review added successfully. Album marked as listened and removed from Listen Later (if it existed).",
            review: newReview
        });
    } catch (error) {
        console.error("Error in addReview:", error.message);
        return res.status(500).json({ message: "Internal Server Error" });    
    }
}

/**
 updateReview - Update an existing review for an album. 
 Expects: req.params.albumId, req.body.reviewText (string)
 
 no reviewID => A user has only one review per album, so we use the combination 
 of the user's id and the album id to uniquely identify the review.
 */
// ✔️ - tested, revamped
export const updateReview = async (req,res)=>{
    try {
        const { albumId } = req.params;
        const { reviewText } = req.body;
        const userId = req.user._id;

        if(!reviewText){
            return res.status(400).json({ message: "Bro, Review text is required." });
        }
        if(!albumId){
            return res.status(400).json({ message: "albumId is required." });
        }

        const existingReview = await Review.findOne({ userId, albumId });
        if(!existingReview){
            return res.status(404).json({ message: "Review not found." });
        }

        //overwrite new review over old one
        existingReview.reviewText = reviewText;
        await existingReview.save();
        return res.status(200).json({ message: "Review updated.", review: existingReview });
    } catch (error) {
        console.error("Error in updateReview:", error.message);
        return res.status(500).json({ message: "Internal Server Error, my boy" });
    }
}

/**
 * deleteReview - Delete the review for an album. Expects: req.params.albumId
 */
// ✔️ - tested,revamped
export const deleteReview = async (req, res) => {
    try {
      const { albumId } = req.params;
      const userId = req.user._id;
  
      if (!albumId) {
        return res.status(400).json({ message: "itemId is required." });
      }
  
      const existingReview = await Review.findOne({ userId, albumId });
      if (!existingReview) {
        return res.status(404).json({ message: "Review not found." });
      }
  
      await existingReview.deleteOne();
      return res.status(200).json({ message: "Review deleted." });
    } catch (error) {
      console.error("Error in deleteReview:", error.message);
      return res.status(500).json({ message: "Internal Server Error, my boy" });
    }
  };


/**
addComment - Add a comment under a review.
Expects: req.body.reviewId, req.body.commentText (string) Optionally, req.params.itemType and req.params.itemId for context.
 */
// ✔️ - tested,revamped
export const addComment = async (req,res)=>{
    try {
        const {reviewId, commentText} = req.body 
        const userId = req.user._id;

        if(!commentText || !reviewId){
            return res.status(400).json({ message: "reivewId and commentText are required. check those fields" });
        }
        //empty comment and typecheck
        if(typeof commentText !== "string" || commentText.trim() === ""){
            return res.status(400).json({message: "Invalid Comment"});
        }

        const existingReview = await Review.findOne({_id: reviewId, userId})
        if(!existingReview){
            return res.status(400).json({message: "Invalid review id"});
        }
        const newComment = await Comment.create({ userId, reviewId, commentText });
        return res.status(201).json({ message: "Comment added.", comment: newComment });
    } catch (error) {
    console.error("Error in addComment:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
    }
}


/**
deleteComment - Delete a comment. Expects: req.params.commentId
*/
// ✔️ - tested, revampd
export const deleteComment = async (req, res) => {
    try {
      const { commentId } = req.params;
      const userId = req.user._id;
      if (!commentId) {
        return res.status(400).json({ message: "commentId is required." });
      }
  
      const existingComment = await Comment.findOne({ _id: commentId, userId });
      if (!existingComment) {
        return res.status(404).json({ message: "Comment not found or unauthorized." });
      }
  
      await existingComment.deleteOne();
      return res.status(200).json({ message: "Comment deleted." });
    } catch (error) {
      console.error("Error in deleteComment:", error.message);
      return res.status(500).json({ message: "Internal Server Error, my boy" });
    }
  };
//This took good 2 whole days, please work for the love of god 🙏🏻