import * as actionsService from "../services/actions.service.js";

export const toggleLike = async (req, res) => {
    const { albumId } = req.params;
    const result = await actionsService.toggleLike(req.user._id, albumId);
    res.status(200).json(result);
};

export const addRating = async (req, res) => {
    const { itemType, itemId } = req.params;
    const { rating } = req.body;
    const newRating = await actionsService.addRating(req.user._id, {
        itemType,
        itemId,
        rating,
    });
    res.status(201).json({
        message: "Rating added successfully.",
        rating: newRating,
    });
};

export const getRating = async (req, res) => {
    const { itemType, itemId } = req.params;
    const rating = await actionsService.getRating(req.user._id, { itemType, itemId });
    res.json({ rating });
};

export const toggleListened = async (req, res) => {
    const { albumId } = req.params;
    const result = await actionsService.toggleListened(req.user._id, albumId);
    res.status(200).json(result);
};

export const toggleListenLater = async (req, res) => {
    const { albumId } = req.params;
    const result = await actionsService.toggleListenLater(req.user._id, albumId);
    res.status(200).json(result);
};

export const deleteRating = async (req, res) => {
    const { itemType, itemId } = req.params;
    const result = await actionsService.deleteRating(req.user._id, { itemType, itemId });
    res.status(200).json(result);
};

export const addReview = async (req, res) => {
    const { albumId } = req.params;
    const { reviewText } = req.body;
    const newReview = await actionsService.addReview(req.user._id, {
        albumId,
        reviewText,
    });
    res.status(201).json({
        message: "Review added successfully. Album marked as listened and removed from Listen Later (if it existed).",
        review: newReview,
    });
};

export const updateReview = async (req, res) => {
    const { albumId } = req.params;
    const { reviewText } = req.body;
    const updatedReview = await actionsService.updateReview(req.user._id, {
        albumId,
        reviewText,
    });
    res.status(200).json({ message: "Review updated.", review: updatedReview });
};

export const deleteReview = async (req, res) => {
    const { albumId } = req.params;
    const result = await actionsService.deleteReview(req.user._id, albumId);
    res.status(200).json(result);
};

export const addComment = async (req, res) => {
    const { reviewId, commentText } = req.body;
    const newComment = await actionsService.addComment(req.user._id, {
        reviewId,
        commentText,
    });
    res.status(201).json({ message: "Comment added.", comment: newComment });
};

export const deleteComment = async (req, res) => {
    const { commentId } = req.params;
    const result = await actionsService.deleteComment(req.user._id, commentId);
    res.status(200).json(result);
};

export const getReviews = async (req, res) => {
    const { albumId } = req.params;
    const result = await actionsService.getReviews(albumId);
    res.status(200).json(result);
};

export const likeReview = async (req, res) => {
    const { reviewId } = req.params;
    const result = await actionsService.likeReview(req.user._id, reviewId);
    res.status(200).json(result);
};

export const getActions = async (req, res) => {
    const { albumId } = req.params;
    const result = await actionsService.getActions(req.user._id, albumId);
    res.status(200).json(result);
};

export const getTrackActions = async (req, res) => {
    const { trackId } = req.params;
    const result = await actionsService.getTrackActions(req.user._id, trackId);
    res.status(200).json(result);
};

export const getTrackRatingsBatch = async (req, res) => {
    const ids = (req.query.ids || "")
        .split(",")
        .map((id) => id.trim())
        .filter(Boolean);

    const result = await actionsService.getTrackRatingsBatch(req.user._id, ids);
    res.status(200).json(result);
};
