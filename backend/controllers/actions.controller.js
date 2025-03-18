import { searchSpotifyData } from "../lib/pullSpotifyData.js";
import Likes from "../models/likes.model.js";
import Listened from "../models/listened.model.js";
import ListenLater from "../models/listenlater.model.js";
// import Log from "../models/log.model.js";
import Rating from "../models/rating.model.js";
import Review from "../models/review.model.js";
import Comment from "../models/comment.model.js";
import user from "../models/user.model.js";

/**
toggleLike - Toggle like state for a track or album. 
Expects: req.params.itemType (string: "track" or "album"), req.params.itemId (Spotify track/album ID as a string)
 */
// ✔️ - tested
export const toggleLike = async(req,res)=>{
    try {        
        const {itemType, itemId} = req.params
        const userId = req.user._id

        if (!itemId) {
            return res.status(400).json({ message: "itemId is required." });
        }

        if (!itemType || (itemType !== "tracks" && itemType !== "albums")) {
            return res.status(400).json({ message: "Valid itemType (tracks or albums) is required." });
        }

        const endpoint = itemType === "albums" ? `albums/${itemId}` : `tracks/${itemId}`;
        const music = await searchSpotifyData(endpoint);
        
        if (!music || music.error) {
            return res.status(404).json({ message: `${itemType.charAt(0).toUpperCase() + itemType.slice(1)} not found.` });
        }

        const existingLike = await Likes.findOne({userId, itemId, itemType})
        if(existingLike){
            await Likes.deleteOne({ _id: existingLike._id})
            return res.status(200).json({message: "Like removed."})
        }else{
            await Likes.create({ userId, itemId, itemType });
            //also mark it as listened here.
            const existingListened = await Listened.findOne({userId, itemId, itemType})
            if(!existingListened){
                await Listened.create({userId, itemId, itemType})
            }
            //and same track will be removed from listenLater(if it exists there)
            await ListenLater.deleteOne({userId, itemId, itemType})
            return res.status(200).json({ message: `${itemType.charAt(0).toUpperCase() + itemType.slice(1)} liked, marked as listened, and removed from Listen Later (if it existed).` });
        }
    } catch (error) {
        console.error("Error in toggleLike:", error.message);
        return res.status(500).json({ message: "Internal Server Error, my boy" });
    }
}


/**
 updateRating - Create, update, or remove a rating for a track or album. 
 When rating is set, remove any listenLater entry. 
 Expects: req.params.itemType (string: "track" or "album"), req.params.itemId (Spotify track/album ID as a string), 
 req.body.rating (number between 0.5 and 5, or null to remove rating)
 */
// ✔️ - tested
export const updateOrAddRating = async (req,res)=>{
    try {
        const {itemType, itemId} = req.params;
        const { rating } = req.body; // rating can be a number or null
        const userId = req.user._id;
        
        if (!itemId) {
            return res.status(400).json({ message: "itemId is required." });
        }
        
        if (!itemType || (itemType !== "tracks" && itemType !== "albums")) {
            return res.status(400).json({ message: "Valid itemType (tracks or albums) is required." });
        }
        
        const endpoint = itemType === "albums" ? `albums/${itemId}` : `tracks/${itemId}`;
        const music = await searchSpotifyData(endpoint);
        
        if (!music || music.error) {
            return res.status(404).json({ message: `${itemType.charAt(0).toUpperCase() + itemType.slice(1)} not found on Spotify.` });
        }
        
        // If rating is updated as null, remove any existing rating and unmark listened.
        const existingRating = await Rating.findOne({ userId, itemId, itemType });
        if (rating === null) {
            if (existingRating) {
                await existingRating.deleteOne();
                return res.status(200).json({ message: "Rating removed." });
            }
            return res.status(400).json({ message: "No rating to remove." });
        }
        
        // Validate rating is a number between 0.5 and 5.
        if(rating !== null && (typeof rating !== "number" || isNaN(rating) || rating < 0.5 || rating > 5 || rating%0.5 !== 0)){
            return res.status(400).json({ message: "Rating must be a number between 0.5 and 5." });
        }
        
        // Create or update rating.
        if (existingRating) {
            existingRating.rating = rating;
            await existingRating.save();
        } else{
            //create rating 
            await Rating.create({ userId, itemId, rating, itemType });
        }
          
        // Automatically remove the item from Listen Later if it exists.
        await ListenLater.deleteOne({ userId, itemId, itemType }); 
        
        //mark as listened (if not already)
        const existingListened = await Listened.findOne({userId, itemId, itemType})
        if (!existingListened) {
            await Listened.create({ userId, itemId, itemType });
        }
        return res.status(200).json({ message: "Rating updated." });

    } catch (error) {
        console.error("Error in updateRating:", error.message);
        return res.status(500).json({ message: "Internal Server Error, my boy" });
    }
}


/**
  toggleListened - Toggle whether a user has marked a track or album as listened. 
  Expects: req.params.itemType (string: "track" or "album"), req.params.itemId (Spotify track/album ID as a string). 
  When unmarking, if a rating exists for this track, the operation is forbidden.
 */
// ✔️ - tested
export const toggleListened = async (req,res) => {
    try {
        const {itemType, itemId} = req.params
        const userId = req.user._id

        if (!itemId) {
            return res.status(400).json({ message: "itemId is required." });
        }
        
        if (!itemType || (itemType !== "tracks" && itemType !== "albums")) {
            return res.status(400).json({ message: "Valid itemType (tracks or albums) is required." });
        }
        
        const endpoint = itemType === "albums" ? `albums/${itemId}` : `tracks/${itemId}`;
        const music = await searchSpotifyData(endpoint);
        
        if (!music || music.error) {
            return res.status(404).json({ message: `${itemType.charAt(0).toUpperCase() + itemType.slice(1)} not found.` });
        }
        
        const existingRating = await Rating.findOne({userId, itemId, itemType})
        const existingReview = await Review.findOne({userId, itemId, itemType})
        // const existingLog = await Log.findOne({userId, itemId, itemType})
        
        //toggle off - remove from listened
        const existingListened = await Listened.findOne({ userId, itemId, itemType });
        
        if(existingListened){
            if(existingRating || existingReview){
                return res.status(400).json({ 
                    message: `Cannot unlisten a ${itemType} as there is a review, rating or it is previously logged. Remove those first.` 
                });
            }
            
            await Listened.deleteOne({ _id: existingListened._id})
            return res.status(200).json({ message: `${itemType.charAt(0).toUpperCase() + itemType.slice(1)} removed from listened.` });
        }
        
        // Mark as listened.
        await Listened.create({ userId, itemId, itemType });
        // Also, remove from Listen Later if exists.
        await ListenLater.deleteOne({ userId, itemId, itemType });
        return res.status(200).json({ message: `${itemType.charAt(0).toUpperCase() + itemType.slice(1)} marked as listened.` });

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
// ✔️ - tested
export const toggleListenLater = async (req,res) => {
    try {
        const {itemType, itemId} = req.params
        const userId = req.user._id
        
        if(!itemId){
            return res.status(400).json({message: "itemId is required."})
        }
        
        if (!itemType || (itemType !== "tracks" && itemType !== "albums")) {
            return res.status(400).json({ message: "Valid itemType (tracks or albums) is required." });
        }
        
        const endpoint = itemType === "albums" ? `albums/${itemId}` : `tracks/${itemId}`;
        const music = await searchSpotifyData(endpoint);
        
        if(!music || music.error){
            return res.status(404).json({message: `${itemType.charAt(0).toUpperCase() + itemType.slice(1)} not found. Try again!`})
        }
        
        //check for existing entry in listen later
        const existingEntry = await ListenLater.findOne({ userId, itemId, itemType });
        
        if (existingEntry) {
            // If the item exists, remove it (toggle off)
            await ListenLater.deleteOne({ _id: existingEntry._id });
            return res.status(200).json({ message: `${itemType.charAt(0).toUpperCase() + itemType.slice(1)} removed from Listen Later.` });
        } else {
            // Otherwise, add the item to Listen Later.
            const newEntry = await ListenLater.create({ userId, itemId, itemType });
            return res.status(200).json({ message: `${itemType.charAt(0).toUpperCase() + itemType.slice(1)} added to Listen Later.`, doc: newEntry });
        }
        
    } catch (error) {
        console.error("Error in toggleListenLater:", error.message);
        return res.status(500).json({ message: "Internal Server Error, my boy" });    
    }
}

/** 
deleteRating - Explicitly delete the rating for a track. Expects: req.params.itemType, req.params.trackId
*/
// ✔️ - tested
export const deleteRating = async (req,res)=>{
    try {
        const {itemId, itemType} = req.params
        const userId = req.user._id


        if(!itemId || !itemType) return res.status(400).json({ message: "itemId, itemType are required." });

        //deleting rating will also remove it from listened
        const existingRating = await Rating.findOne({userId, itemId, itemType})
        if(existingRating){
            await existingRating.deleteOne()
            await Listened.deleteOne({userId, itemId, itemType})
            return res.status(200).json({ message: "Rating deleted." });
        }
        return res.status(400).json({message: "No existing rating for track."})

    } catch (error) {
        console.error("Error in deleteRating:", error.message);
        return res.status(500).json({ message: "Internal Server Error, my boy" });
    }
}

/**
addReview - Add a review only for a album. When a review is added, automatically mark as listened and remove from Listen Later. Expects: req.params.itemType, req.params.itemId, req.body.reviewText (string)
*/


// ✔️ - tested
export const addReview = async (req,res)=>{
    try {

        const {itemId, itemType} = req.params
        const {reviewText} = req.body //string
        const userId = req.user._id
        
        if(!itemId || !itemType || !reviewText) return res.status(400).json({ message: "itemId, itemType, reviewText are required." });
        
        ///check for itemType - tracks, as they're not allowed
        if(itemType === 'tracks'){
            return res.status(404).json({message: "reviews are not allowed for itemtype- tracks. Check params - itemType."})
        }
        
        const endpoint = `albums/${itemId}`
        const music = await searchSpotifyData(endpoint)
        if(!music || music.error)   return res.status(404).json({ message: `${itemType.charAt(0).toUpperCase() + itemType.slice(1)} not found on Spotify.` });
        
        //check for existing review
        const existingReview = await Review.findOne({userId, itemId, itemType})
        if(existingReview)  return res.status(400).json({ message: "You have already reviewed this album. Please edit your existing review instead." });

        //review text can't be empty
        if (!reviewText || reviewText.trim() === '') {
            return res.status(400).json({ message: "Review text is required." });
        }
        
        //create review
        const newReview = await Review.create({userId, itemId, reviewText, itemType: 'albums'})
        
        //mark as listened
        const existingListened = await Listened.findOne({userId, itemId, itemType})
        if(!existingListened) await Listened.create({ userId, itemId, itemType });
        
        //remove from listenLater if it exists
        await ListenLater.deleteOne({userId, itemId, itemType})
        
        return res.status(201).json({ 
            message: "Review added successfully. Album marked as listened and removed from Listen Later (if it existed).",
            review: newReview
        });
    } catch (error) {
        console.error("Error in addReview:", error.message);
        return res.status(500).json({ message: "Internal Server Error, my boy" });    
    }
    }

/**
 updateReview - Update an existing review for a track or album. Expects:  req.params.itemType, req.params.itemId, req.body.reviewText (string). 
 
no reviewID => A user has only one review per song/album, so we use the combination of the user’s id, the item id (track or album), and the item type to uniquely identify the review.
 */
// ✔️ - tested
 export const updateReview = async (req,res)=>{
    try {
        const {itemId, itemType} = req.params
        const {reviewText} = req.body //string
        const userId = req.user._id

        if(!reviewText){
            return res.status(400).json({ message: "Bro, Review text is required." });
        }
        if(!itemId || !itemType){
            return res.status(400).json({ message: "itemType and itemId are required." });
        }

        const existingReview = await Review.findOne({userId, itemId, itemType})
        if(!existingReview){
            return res.status(404).json({ message: "Review not found." });
        }

        //overwrite new review over old one
        existingReview.reviewText = reviewText;
        await existingReview.save()
        return res.status(200).json({ message: "Review updated.", review: existingReview });
    } catch (error) {
        console.error("Error in updateReview:", error.message);
        return res.status(500).json({ message: "Internal Server Error, my boy" });
    }
 }

/**
 * deleteReview - Delete the review for a track or album. Expects: req.params.itemType, req.params.itemId
 */
// ✔️ - tested
export const deleteReview = async (req, res) => {
    try {
      const { itemId, itemType } = req.params;
      const userId = req.user._id;
  
      if (!itemId) {
        return res.status(400).json({ message: "itemId is required." });
      }
  
      const existingReview = await Review.findOne({ userId, itemId, itemType });
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
// ✔️ - tested
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
// ✔️ - tested
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