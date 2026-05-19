import * as aiService from "../services/ai.service.js";

export const getSmartRecommendations = async (req, res) => {
    const { mood } = req.query;
    const result = await aiService.getSmartRecommendations(req.user.id, mood);
    res.status(200).json(result);
};

export const getMoodRecommendations = async (req, res) => {
    const { mood } = req.params;
    const result = await aiService.getMoodRecommendations(mood);
    res.status(200).json(result);
};

// AI powered discovery (manual trigger)
export const getAIRecommendations = async (req, res) => {
    const { mood } = req.query;
    const result = await aiService.getAIRecommendations(req.user.id, mood);
    res.status(200).json(result);
};
