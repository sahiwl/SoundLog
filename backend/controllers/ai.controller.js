import * as aiService from "../services/ai.service.js";

export const getSmartRecommendations = async (req, res) => {
  try {
    const { mood } = req.query;
    const userId = req.user.id;

    const result = await aiService.getSmartRecommendations(userId, mood);

    res.status(200).json(result);
  } catch (error) {
    console.error('Error getting smart recommendations:', error);
    res.status(500).json({ message: 'Failed to get smart recommendations', error: error.message });
  }
};

export const getMoodRecommendations = async (req, res) => {
  try {
    const { mood } = req.params;

    const result = await aiService.getMoodRecommendations(mood);

    res.status(200).json(result);
  } catch (error) {
    console.error('Error getting mood recommendations:', error);
    if (error.message.startsWith('Invalid mood')) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Failed to get mood recommendations', error: error.message });
  }
};

// AI powered discovery (manual trigger)
export const getAIRecommendations = async (req, res) => {
  try {
    const { mood } = req.query;
    const userId = req.user.id;

    const result = await aiService.getAIRecommendations(userId, mood);

    res.status(200).json(result);
  } catch (error) {
    console.error('Error getting AI recommendations:', error);
    if (error.status === 429) {
      return res.status(429).json({
        message: error.message,
        aiRateLimitInfo: error.rateLimitInfo
      });
    }
    res.status(500).json({ message: 'Failed to get AI recommendations', error: error.message });
  }
};
