import * as actionsService from "../services/actions.service.js";

export { getOrCreateSpotifyData } from "../services/actions.service.js";

export const toggleLike = async (req, res) => {
    try {
        const { albumId } = req.params;
        const userId = req.user._id;

        const result = await actionsService.toggleLike(userId, albumId);
        return res.status(200).json(result);
    } catch (error) {
        console.error("Error in toggleLike:", error.message);
        if (error.message === "albumId is required.") {
            return res.status(400).json({ message: error.message });
        }
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const addRating = async (req, res) => {
    try {
        const { itemType, itemId } = req.params;
        const { rating } = req.body;
        const userId = req.user._id;

        const newRating = await actionsService.addRating(userId, { itemType, itemId, rating });

        return res.status(201).json({
            message: "Rating added successfully.",
            rating: newRating
        });

    } catch (error) {
        console.error("Error in addRating:", error.message);
        const badReqs = [
            "itemId is required.",
            "Valid itemType (tracks or albums) is required.",
            "Rating must be a number between 0 and 100"
        ];
        if (badReqs.includes(error.message)) {
            return res.status(400).json({ message: error.message });
        }
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getRating = async (req, res) => {
    try {
        const { itemType, itemId } = req.params;
        const userId = req.user._id;

        const rating = await actionsService.getRating(userId, { itemType, itemId });

        return res.json({ rating });

    } catch (error) {
        console.error("Error in getRating:", error.message);
        if (error.message.includes("required")) {
            return res.status(400).json({ message: error.message });
        }
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const toggleListened = async (req, res) => {
    try {
        const { albumId } = req.params
        const userId = req.user._id

        const result = await actionsService.toggleListened(userId, albumId);
        return res.status(200).json(result);

    } catch (error) {
        console.error("Error in toggleListened:", error.message);
        if (error.message === "albumId is required.") {
            return res.status(400).json({ message: error.message });
        }
        return res.status(500).json({ message: "Internal Server Error, my boy" });
    }
}

export const toggleListenLater = async (req, res) => {
    try {
        const { albumId } = req.params;
        const userId = req.user._id;

        const result = await actionsService.toggleListenLater(userId, albumId);
        return res.status(200).json(result);

    } catch (error) {
        console.error("Error in toggleListenLater:", error.message);
        if (error.message === "albumId is required.") {
            return res.status(400).json({ message: error.message });
        }
        return res.status(500).json({ message: "Internal Server Error, my boy" });
    }
}

export const deleteRating = async (req, res) => {
    try {
        const { itemType, itemId } = req.params;
        const userId = req.user._id;

        const result = await actionsService.deleteRating(userId, { itemType, itemId });
        return res.status(200).json(result);

    } catch (error) {
        console.error("Error in deleteRating:", error.message);
        if (error.message === "No existing rating found.") {
            return res.status(400).json({ message: error.message }); // 400 as per original? Or 404? Original was 400.
        }
        if (error.message.includes("required") || error.message.includes("Invalid")) {
            return res.status(400).json({ message: error.message });
        }
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const addReview = async (req, res) => {
    try {
        const { albumId } = req.params;
        const { reviewText } = req.body;
        const userId = req.user._id;

        const newReview = await actionsService.addReview(userId, { albumId, reviewText });

        return res.status(201).json({
            message: "Review added successfully. Album marked as listened and removed from Listen Later (if it existed).",
            review: newReview
        });
    } catch (error) {
        console.error("Error in addReview:", error.message);
        const userErrors = [
            "albumId and reviewText are required.",
            "You have already reviewed this album. Please edit your existing review instead.",
            "Review text cannot be empty."
        ];
        if (userErrors.includes(error.message)) {
            return res.status(400).json({ message: error.message });
        }
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const updateReview = async (req, res) => {
    try {
        const { albumId } = req.params;
        const { reviewText } = req.body;
        const userId = req.user._id;

        const updatedReview = await actionsService.updateReview(userId, { albumId, reviewText });
        return res.status(200).json({ message: "Review updated.", review: updatedReview });
    } catch (error) {
        console.error("Error in updateReview:", error.message);
        if (error.message === "Review not found.") {
            return res.status(404).json({ message: error.message });
        }
        if (error.message.includes("required")) {
            return res.status(400).json({ message: error.message });
        }
        return res.status(500).json({ message: "Internal Server Error, my boy" });
    }
}

export const deleteReview = async (req, res) => {
    try {
        const { albumId } = req.params;
        const userId = req.user._id;

        const result = await actionsService.deleteReview(userId, albumId);
        return res.status(200).json(result);
    } catch (error) {
        console.error("Error in deleteReview:", error.message);
        if (error.message === "Review not found.") {
            return res.status(404).json({ message: error.message });
        }
        if (error.message.includes("required")) {
            return res.status(400).json({ message: error.message });
        }
        return res.status(500).json({ message: "Internal Server Error, my boy" });
    }
};

export const addComment = async (req, res) => {
    try {
        const { reviewId, commentText } = req.body
        const userId = req.user._id;

        const newComment = await actionsService.addComment(userId, { reviewId, commentText });
        return res.status(201).json({ message: "Comment added.", comment: newComment });
    } catch (error) {
        console.error("Error in addComment:", error.message);
        if (error.message.includes("required") || error.message.includes("Invalid")) {
            return res.status(400).json({ message: error.message });
        }
        //  if (error.message === "Invalid review id") // Service throws this if review not found
        //     return res.status(400).json({ message: "Invalid review id" });

        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const userId = req.user._id;

        const result = await actionsService.deleteComment(userId, commentId);
        return res.status(200).json(result);
    } catch (error) {
        console.error("Error in deleteComment:", error.message);
        if (error.message === "Comment not found or unauthorized.") {
            return res.status(404).json({ message: error.message });
        }
        if (error.message.includes("required")) {
            return res.status(400).json({ message: error.message });
        }
        return res.status(500).json({ message: "Internal Server Error, my boy" });
    }
};

export const getReviews = async (req, res) => {
    try {
        const { albumId } = req.params;

        const result = await actionsService.getReviews(albumId);

        return res.status(200).json(result);

    } catch (error) {
        console.error("Error in getReviews:", error.message);
        if (error.message === "albumId is required.") {
            return res.status(400).json({ message: error.message });
        }
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const likeReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const userId = req.user._id;

        const result = await actionsService.likeReview(userId, reviewId);
        return res.status(200).json(result);

    } catch (error) {
        console.error("Error in likeReview:", error.message);
        if (error.message === "Review not found.") {
            return res.status(404).json({ message: error.message });
        }
        if (error.message.includes("required")) {
            return res.status(400).json({ message: error.message });
        }
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getActions = async (req, res) => {
    try {
        const { albumId } = req.params;
        const userId = req.user._id;

        const result = await actionsService.getActions(userId, albumId);
        res.status(200).json(result);

    } catch (error) {
        console.error("Error in getActions:", error.message);
        if (error.message === "Album Not Found") {
            return res.status(404).json({ message: error.message });
        }
        if (error.message.includes("required")) {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getTrackActions = async (req, res) => {
    try {
        const { trackId } = req.params;
        const userId = req.user._id;

        const result = await actionsService.getTrackActions(userId, trackId);
        res.status(200).json(result);

    } catch (error) {
        console.error("Error in getTrackActions:", error.message);
        if (error.message.includes("required")) {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
};