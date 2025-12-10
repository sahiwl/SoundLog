import Rating from '../models/rating.model.js';
import Review from '../models/review.model.js';
import { axiosInstance } from '../lib/spotifyAuth.js';
import {
    MOOD_CONFIGURATIONS,
    SPOTIFY_GENRE_SEEDS,
    getAlbumsByArtists,
    getAlbumsFromRecommendations,
    getTrendingAlbums,
    shuffleAndFormatAlbums,
    isRealAlbum
} from '../lib/recommendationStrategies.js';
import {
    analyzeUserTaste,
    generateAISearchQuery,
    extractGenresFromProfile,
    getAIRateLimitInfo
} from '../lib/aiHelpers.js';

const getDefaultRecommendations = async (mood) => {
    try {
        console.log(`Getting recommendations for mood: ${mood}`);

        let allAlbums = [];

        // Strategy 1: Get albums by curated popular artists (ensure minimum 8 albums)
        const artistAlbums = await getAlbumsByArtists(mood, 8);
        allAlbums = [...allAlbums, ...artistAlbums];

        // Strategy 2: Get albums from Spotify recommendations API
        const recommendationAlbums = await getAlbumsFromRecommendations(mood, allAlbums);
        allAlbums = [...allAlbums, ...recommendationAlbums];

        // Strategy 3: Get trending albums from recent years
        const trendingAlbums = await getTrendingAlbums(mood, allAlbums);
        allAlbums = [...allAlbums, ...trendingAlbums];

        // Format and shuffle the final results, ensure minimum 8 albums
        const formattedAlbums = shuffleAndFormatAlbums(allAlbums, Math.max(12, 8));

        console.log(`Returning ${formattedAlbums.length} albums for mood: ${mood}`);

        return {
            type: 'mood',
            mood,
            albums: formattedAlbums,
            tracks: []
        };
    } catch (error) {
        console.error('Error getting default recommendations:', error);

        // fallback, return empty with error info
        return {
            type: 'mood',
            mood,
            albums: [],
            tracks: [],
            error: 'Unable to fetch recommendations at this time'
        };
    }
};

const getPersonalizedRecommendations = async (userId, ratings, reviews, mood, useAI = false) => {
    try {
        let tasteProfile;
        let isUsingAiFallback = false;

        // analyze user's taste, but only use AI if requested
        try {
            tasteProfile = await analyzeUserTaste(ratings, reviews, useAI);
        } catch (error) {
            console.error('Personalized recommendations API failed:', error.message);
            isUsingAiFallback = true;
            // Fallback to mood-based recommendations when AI fails
            const moodResult = await getDefaultRecommendations(mood || 'happy');
            return {
                ...moodResult,
                isUsingAiFallback: true,
                fallbackReason: 'AI analysis unavailable'
            };
        }

        let allAlbums = [];

        // Priority 1: Use curated artist search as primary strategy (to preserve AI quota)
        const artistAlbums = await getAlbumsByArtists(mood, 8);
        allAlbums = [...allAlbums, ...artistAlbums];

        // Priority 2: Only use search queries using AI if explicitly requested and quota available
        if (useAI) {
            try {
                const albumSearchQuery = await generateAISearchQuery(tasteProfile, mood, 'album', true);
                const albumSearchResponse = await axiosInstance.get('/search', {
                    params: {
                        q: albumSearchQuery,
                        type: 'album',
                        limit: 10,
                        market: 'US'
                    }
                });

                const foundAlbums = albumSearchResponse.data.albums?.items || [];
                const realAlbums = foundAlbums.filter(isRealAlbum);
                allAlbums = [...allAlbums, ...realAlbums];
            } catch (error) {
                console.error('AI album search failed:', error.message);
                // Continue without AI albums if AI fails
                isUsingAiFallback = true;
            }
        }

        // Priority 3: Use Spotify recommendation API with user preferences  
        const genres = extractGenresFromProfile(tasteProfile, mood);
        const validGenres = genres.filter(g => SPOTIFY_GENRE_SEEDS.includes(g));

        if (validGenres.length > 0) {
            const recommendationAlbums = await getAlbumsFromRecommendations(mood, allAlbums);
            allAlbums = [...allAlbums, ...recommendationAlbums];
        }

        // Priority 4: Fill with trending albums if we still need more
        if (allAlbums.length < 8) {
            const trendingAlbums = await getTrendingAlbums(mood, allAlbums);
            allAlbums = [...allAlbums, ...trendingAlbums];
        }

        // Format and shuffle the final results, ensure minimum 8 albums for personalized
        const formattedAlbums = shuffleAndFormatAlbums(allAlbums, Math.max(12, 8));

        return {
            type: 'personalized',
            tasteProfile: tasteProfile.summary,
            mood,
            albums: formattedAlbums,
            tracks: [],
            isUsingAiFallback
        };
    } catch (error) {
        console.error('Error getting personalized recommendations:', error);

        // Fallback to mood based recommendations
        return await getDefaultRecommendations(mood || 'happy');
    }
};

export const getSmartRecommendations = async (userId, mood) => {
    // user's ratings and reviews for personalization
    const ratings = await Rating.find({ userId }).limit(50).sort({ createdAt: -1 });
    const reviews = await Review.find({ userId }).limit(20).sort({ createdAt: -1 });

    let recommendations;

    if (ratings.length >= 5) {
        recommendations = await getPersonalizedRecommendations(userId, ratings, reviews, mood, false);
    } else {
        recommendations = await getDefaultRecommendations(mood || 'happy');
    }

    return {
        recommendations,
        availableMoods: Object.keys(MOOD_CONFIGURATIONS),
        aiRateLimitInfo: getAIRateLimitInfo()
    };
};

export const getMoodRecommendations = async (mood) => {
    if (!MOOD_CONFIGURATIONS[mood]) {
        throw new Error('Invalid mood. Available moods: ' + Object.keys(MOOD_CONFIGURATIONS).join(', '));
    }

    const recommendations = await getDefaultRecommendations(mood);

    return {
        recommendations,
        mood,
        availableMoods: Object.keys(MOOD_CONFIGURATIONS),
        aiRateLimitInfo: getAIRateLimitInfo()
    };
};

export const getAIRecommendations = async (userId, mood) => {
    // Check if AI requests are available
    const rateLimitInfo = getAIRateLimitInfo();
    if (!rateLimitInfo.canMakeRequest) {
        const error = new Error(`AI requests exhausted. Try again in ${rateLimitInfo.timeUntilReset} seconds.`);
        error.status = 429;
        error.rateLimitInfo = rateLimitInfo;
        throw error;
    }

    const ratings = await Rating.find({ userId }).limit(50).sort({ createdAt: -1 });
    const reviews = await Review.find({ userId }).limit(20).sort({ createdAt: -1 });

    let recommendations;

    // Force AI usage for this endpoint
    if (ratings.length >= 5) {
        recommendations = await getPersonalizedRecommendations(userId, ratings, reviews, mood, true);
    } else {
        recommendations = await getDefaultRecommendations(mood || 'happy');
        recommendations.needMoreData = true;
    }

    return {
        recommendations,
        availableMoods: Object.keys(MOOD_CONFIGURATIONS),
        aiRateLimitInfo: getAIRateLimitInfo(),
        aiPowered: true
    };
};
