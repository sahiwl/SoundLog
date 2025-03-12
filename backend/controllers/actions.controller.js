import { pullSpotifyData } from "../lib/pullSpotifyData.js";
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
export const toggleLike = async(req,res)=>{
    try {        
        const {itemType, itemId} = req.params
        const userId = req.user._id

        if (!itemId) {
            return res.status(400).json({ message: "itemId is required." });
        }

        if (!itemType || (itemType !== "track" && itemType !== "album")) {
            return res.status(400).json({ message: "Valid itemType (track or album) is required." });
        }

        const endpoint = itemType === "album" ? `albums/${itemId}` : `tracks/${itemId}`;
        const music = await pullSpotifyData(endpoint);
        
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
        return res.status(500).json({ message: "Internal Server Error" });
    }
}


/**
 updateRating - Create, update, or remove a rating for a track or album. 
 When rating is set, remove any listenLater entry. 
 Expects: req.params.itemType (string: "track" or "album"), req.params.itemId (Spotify track/album ID as a string), 
 req.body.rating (number between 0.5 and 5, or null to remove rating)
 */
export const updateOrAddRating = async (req,res)=>{
    try {
        const {itemType, itemId} = req.params;
        const { rating } = req.body; // rating can be a number or null
        const userId = req.user._id;
        
        if (!itemId) {
            return res.status(400).json({ message: "itemId is required." });
        }
        
        if (!itemType || (itemType !== "track" && itemType !== "album")) {
            return res.status(400).json({ message: "Valid itemType (track or album) is required." });
        }
        
        const endpoint = itemType === "album" ? `albums/${itemId}` : `tracks/${itemId}`;
        const music = await pullSpotifyData(endpoint);
        
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
        return res.status(500).json({ message: "Internal Server Error" });
    }
}


/**
  toggleListened - Toggle whether a user has marked a track or album as listened. 
  Expects: req.params.itemType (string: "track" or "album"), req.params.itemId (Spotify track/album ID as a string). 
  When unmarking, if a rating exists for this track, the operation is forbidden.
 */
export const toggleListened = async (req,res) => {
    try {
        const {itemType, itemId} = req.params
        const userId = req.user._id

        if (!itemId) {
            return res.status(400).json({ message: "itemId is required." });
        }
        
        if (!itemType || (itemType !== "track" && itemType !== "album")) {
            return res.status(400).json({ message: "Valid itemType (track or album) is required." });
        }
        
        const endpoint = itemType === "album" ? `albums/${itemId}` : `tracks/${itemId}`;
        const music = await pullSpotifyData(endpoint);
        
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
        return res.status(500).json({ message: "Internal Server Error" });
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
export const toggleListenLater = async (req,res) => {
    try {
        const {itemType, itemId} = req.params
        const userId = req.user._id
        
        if(!itemId){
            return res.status(400).json({message: "itemId is required."})
        }
        
        if (!itemType || (itemType !== "track" && itemType !== "album")) {
            return res.status(400).json({ message: "Valid itemType (track or album) is required." });
        }
        
        const endpoint = itemType === "album" ? `albums/${itemId}` : `tracks/${itemId}`;
        const music = await pullSpotifyData(endpoint);
        
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
        return res.status(500).json({ message: "Internal Server Error" });    
    }
}

//This took good 1 whole day, please work for the love of god 🙏🏻