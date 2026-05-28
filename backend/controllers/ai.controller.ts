import type { Response } from "express";
import type { AuthenticatedRequest } from "../types/authReq.js";
import * as aiService from "../services/ai.service.js";
import { optionalQueryString } from "../lib/requestHelpers.js";

export const getSmartRecommendations = async (req: AuthenticatedRequest, res: Response) => {
  const mood = optionalQueryString(req.query.mood);
  const result = await aiService.getSmartRecommendations(req.user._id, mood);
  res.status(200).json(result);
};

export const getAIRecommendations = async (req: AuthenticatedRequest, res: Response) => {
  const mood = optionalQueryString(req.query.mood);
  const result = await aiService.getAIRecommendations(req.user._id, mood);
  res.status(200).json(result);
};
