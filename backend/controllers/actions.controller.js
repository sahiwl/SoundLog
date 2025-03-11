import { pullSpotifyData } from "../lib/pullSpotifyData.js";
import Likes from "../models/likes.model.js";
import Listened from "../models/listened.model.js";
import ListenLater from "../models/listenlater.model.js";
import Rating from "../models/rating.model.js";
import Review from "../models/review.model.js";
import user from "../models/user.model.js";

/**
toggleLike - Toggle like state for a track. expects req.params.trackId (Spotify track ID as a string)
 */
export const toggleLike = async(req,res)=>{
    try {
        const trackId = req.params.trackId
        const userId = req.user._id

        if (!trackId) {
            return res.status(400).json({ message: "trackId is required." });
          }

          const music = await pullSpotifyData(`tracks/${trackId}`);
          if (!music || music.error) {
            return res.status(404).json({ message: "Song not found." });
          }

        const existingLike = await Likes.findOne({userId, songId: trackId})
        if(existingLike){
            await Likes.deleteOne({ _id: existingLike._id})
            return res.status(200).json({message: "Like removed. "})
        }else{
            await Likes.create({ userId, songId: trackId });
            //also mark it as listened here.
            const existingListened = await Listened.findOne({userId, songId: trackId})
            if(!existingListened){
                await Listened.create({userId, songId: trackId})
            }
            //and same track will be removed from listenLater(if it exists there)
            await ListenLater.deleteOne({userId, songId: trackId})
            return res.status(200).json({ message: "Song liked, marked as listened, and removed from Listen Later (if it existed)." });
        }
    } catch (error) {
        console.error("Error in toggleLike:", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}


/**
 updateRating - Create, update, or remove a rating for a track. When rating is set, remove any listenLater entry. Expects: req.params.trackId (Spotify track ID as a string), req.body.rating (number between 1 and 5, or null to remove rating)
 */
export const updateOrAddRating = async (req,res)=>{
    try {
        const trackId = req.params.trackId;
        const { rating } = req.body; // rating can be a number or null
        const userId = req.user._id;
        
        if (!trackId) {
          return res.status(400).json({ message: "trackId is required." });
        }
        
        
        const music = await pullSpotifyData(`tracks/${trackId}`);
        if (!music || music.error) {
          return res.status(404).json({ message: "Song not found on Spotify." });
        }
        
        // If rating is updated as null, remove any existing rating and unmark listened.
        const existingRating = await Rating.findOne({ userId, songId: trackId });
        if (rating === null) {
          if (existingRating) {
            await existingRating.deleteOne();
            // await Listened.deleteOne({ userId, songId: trackId });
            return res.status(200).json({ message: "Rating removed." });
          }
          return res.status(400).json({ message: "No rating to remove." });
        }
        
        // Validate rating is a number between 1 and 5.
        if(rating !== null && (typeof rating !== "number" || isNaN(rating) || rating < 0.5 || rating > 5 || rating%0.5 !== 0)){
            return res.status(400).json({ message: "Rating must be a number between 0.5 and 5." });
        }
        
        // Create or update rating.
        if (existingRating) {
          existingRating.rating = rating;
          await existingRating.save();
        } else{
            //create rating 
            await Rating.create({ userId, songId: trackId, rating });
        }
          
        // Automatically remove the song from Listen Later if it exists.
        await ListenLater.deleteOne({ userId: userId, songId: trackId }); 
        
        //mark as listened (if not already)
        const existingListened = await Listened.findOne({userId, songId: trackId})
        if (!existingListened) {
            await Listened.create({ userId, songId: trackId });
        }
        return res.status(200).json({ message: "Rating updated." });

    } catch (error) {
        console.error("Error in updateRating:", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
      }
}


/**
  toggleListened - Toggle whether a userId has marked a track as listened. Expects: req.params.trackId (Spotify track ID as a string). When unmarking, if a rating exists for this track, the operation is forbidden.
 */
export const toggleListened = async (req,res) => {
    try {
        const trackId = req.params.trackId
        const userId = req.user._id

        if (!trackId) {
            return res.status(400).json({ message: "trackId is required." });
          }
          
          const music = await pullSpotifyData(`tracks/${trackId}`);
          if (!music || music.error) {
            return res.status(404).json({ message: "Song not found." });
          }
          
        const existingListened = await Listened.findOne({ userId, songId: trackId });

        //toggle off - remove from listened
        if(existingListened){
            //before unmarking, check whether rating exists
            const existingRating = await Rating.findOne({userId, songId: trackId})
            if(existingRating){
                return res.status(400).json({ message: "Cannot unlisten a song with a rating. Remove the rating first." });
            }
            await Listened.deleteOne({ _id: existingListened._id})
            return res.status(200).json({ message: "Song removed from listened." });
        }
        
        // Mark as listened.
        await Listened.create({ userId, songId: trackId });
         // Also, remove from Listen Later if exists.
        await ListenLater.deleteOne({ userId: userId, songId: trackId });
        return res.status(200).json({ message: "Song marked as listened." });

        // const existsInListenLater = await ListenLater.findOne({userId, songId: trackId})
        // if(existsInListenLater){
        //     // mark as listened and remove from listenlater
        //     await Listened.create({ userId, songId: trackId });
        // }

    } catch (error) {
        console.error("Error in updateRating:", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}


/**
toggleListenLater - Toggle the "Listen Later" state for a track. Expects: req.params.musicId (Spotify track ID as a string). 
Behavior:
    - If the song is not in Listen Later, add it.
    - If the song is already in Listen Later, remove it.
    - In either case, duplicates are not allowed.
 */
 export const toggleListenLater = async (req,res) => {
    try {
        
        const trackId = req.params.trackId
        const userId = req.user._id
        
        if(!trackId){
            return res.status(400).json({message: "trackId is required."})
        }
        
        const music = await pullSpotifyData(`tracks/${trackId}`)
        if(!music || music.error){
            return res.status(404).json({message: "Song not found. Try again!"})
        }
        
        //check for existing entry in listen later
        const existingEntry = await ListenLater.findOne({ userId: userId, songId: trackId });
        
        if (existingEntry) {
            // If the song exists, remove it (toggle off)
            await ListenLater.deleteOne({ _id: existingEntry._id });
            return res.status(200).json({ message: "Song removed from Listen Later." });
        } else {
            // Otherwise, add the song to Listen Later.
            const newEntry = await ListenLater.create({ userId: userId, songId: trackId, itemType: "track" });
            return res.status(200).json({ message: "Song added to Listen Later.", doc: newEntry });
        }
        
    } catch (error) {
        console.error("Error in toggleListenLater:", error.message);
        return res.status(500).json({ message: "Internal Server Error" });    
    }
    }
    


//This took good 1 whole day, please work for the love of god 🙏🏻