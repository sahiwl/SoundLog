import type { Response } from "express";
import type { AuthenticatedRequest } from "../types/authReq.js";
import * as actionsService from "../services/actions.service.js";
import { requireItemType, requireParam } from "../lib/requestHelpers.js";

export const toggleLike = async (req: AuthenticatedRequest, res: Response) => {
  const albumId = requireParam(req.params.albumId, "albumId");
  const result = await actionsService.toggleLike(req.user._id, albumId);
  res.status(200).json(result);
};

export const addRating = async (req: AuthenticatedRequest, res: Response) => {
  const itemType = requireItemType(requireParam(req.params.itemType, "itemType"));
  const itemId = requireParam(req.params.itemId, "itemId");
  const { rating } = req.body as { rating: number };
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

export const getRating = async (req: AuthenticatedRequest, res: Response) => {
  const itemType = requireItemType(requireParam(req.params.itemType, "itemType"));
  const itemId = requireParam(req.params.itemId, "itemId");
  const rating = await actionsService.getRating(req.user._id, { itemType, itemId });
  res.json({ rating });
};

export const toggleListened = async (req: AuthenticatedRequest, res: Response) => {
  const albumId = requireParam(req.params.albumId, "albumId");
  const result = await actionsService.toggleListened(req.user._id, albumId);
  res.status(200).json(result);
};

export const toggleListenLater = async (req: AuthenticatedRequest, res: Response) => {
  const albumId = requireParam(req.params.albumId, "albumId");
  const result = await actionsService.toggleListenLater(req.user._id, albumId);
  res.status(200).json(result);
};

export const deleteRating = async (req: AuthenticatedRequest, res: Response) => {
  const itemType = requireItemType(requireParam(req.params.itemType, "itemType"));
  const itemId = requireParam(req.params.itemId, "itemId");
  const result = await actionsService.deleteRating(req.user._id, { itemType, itemId });
  res.status(200).json(result);
};

export const addReview = async (req: AuthenticatedRequest, res: Response) => {
  const albumId = requireParam(req.params.albumId, "albumId");
  const { reviewText } = req.body as { reviewText: string };
  const newReview = await actionsService.addReview(req.user._id, {
    albumId,
    reviewText,
  });
  res.status(201).json({
    message:
      "Review added successfully. Album marked as listened and removed from Listen Later (if it existed).",
    review: newReview,
  });
};

export const updateReview = async (req: AuthenticatedRequest, res: Response) => {
  const albumId = requireParam(req.params.albumId, "albumId");
  const { reviewText } = req.body as { reviewText: string };
  const updatedReview = await actionsService.updateReview(req.user._id, {
    albumId,
    reviewText,
  });
  res.status(200).json({ message: "Review updated.", review: updatedReview });
};

export const deleteReview = async (req: AuthenticatedRequest, res: Response) => {
  const albumId = requireParam(req.params.albumId, "albumId");
  const result = await actionsService.deleteReview(req.user._id, albumId);
  res.status(200).json(result);
};

export const addComment = async (req: AuthenticatedRequest, res: Response) => {
  const { reviewId, commentText } = req.body as { reviewId: string; commentText: string };
  const newComment = await actionsService.addComment(req.user._id, {
    reviewId,
    commentText,
  });
  res.status(201).json({ message: "Comment added.", comment: newComment });
};

export const deleteComment = async (req: AuthenticatedRequest, res: Response) => {
  const commentId = requireParam(req.params.commentId, "commentId");
  const result = await actionsService.deleteComment(req.user._id, commentId);
  res.status(200).json(result);
};

export const getReviews = async (req: AuthenticatedRequest, res: Response) => {
  const albumId = requireParam(req.params.albumId, "albumId");
  const result = await actionsService.getReviews(albumId);
  res.status(200).json(result);
};

export const likeReview = async (req: AuthenticatedRequest, res: Response) => {
  const reviewId = requireParam(req.params.reviewId, "reviewId");
  const result = await actionsService.likeReview(req.user._id, reviewId);
  res.status(200).json(result);
};

export const getActions = async (req: AuthenticatedRequest, res: Response) => {
  const albumId = requireParam(req.params.albumId, "albumId");
  const result = await actionsService.getActions(req.user._id, albumId);
  res.status(200).json(result);
};

export const getTrackActions = async (req: AuthenticatedRequest, res: Response) => {
  const trackId = requireParam(req.params.trackId, "trackId");
  const result = await actionsService.getTrackActions(req.user._id, trackId);
  res.status(200).json(result);
};

export const getTrackRatingsBatch = async (req: AuthenticatedRequest, res: Response) => {
  const idsParam = req.query.ids ?? "";
  const ids =
    typeof idsParam === "string"
      ? idsParam.split(",").map((id) => id.trim()).filter(Boolean)
      : [];
  const result = await actionsService.getTrackRatingsBatch(req.user._id, ids);
  res.status(200).json(result);
};
