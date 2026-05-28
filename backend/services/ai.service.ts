import Rating from "../models/rating.model.js";
import Review from "../models/review.model.js";
import { axiosInstance } from "../lib/spotifyAuth.js";
import {
    MOOD_CONFIGURATIONS,
    SPOTIFY_GENRE_SEEDS,
    getAlbumsByArtists,
    getAlbumsFromRecommendations,
    getTrendingAlbums,
    shuffleAndFormatAlbums,
    isRealAlbum,
    type MoodType,
    type FormattedAlbum,
} from "../lib/recommendationStrategies.js";
import {
    analyzeUserTaste,
    generateAISearchQuery,
    extractGenresFromProfile,
    getAIRateLimitInfo,
    type Rating as TasteRating,
    type Review as TasteReview,
} from "../lib/aiHelpers.js";
import { AppError } from "../lib/AppError.js";
import { Types } from "mongoose";

type UserId = string | Types.ObjectId;

interface MoodRecommendations {
    type: "mood" | "personalized";
    mood?: MoodType | string;
    albums: FormattedAlbum[];
    tracks: [];
    tasteProfile?: string;
    isUsingAiFallback?: boolean;
    fallbackReason?: string;
    needMoreData?: boolean;
    error?: string;
}

interface RecommendationsPayload {
    recommendations: MoodRecommendations;
    availableMoods: string[];
    aiRateLimitInfo: ReturnType<typeof getAIRateLimitInfo>;
    aiPowered?: boolean;
}

const getDefaultRecommendations = async (
    mood?: MoodType | string
): Promise<MoodRecommendations> => {
    try {
        console.log(`Getting recommendations for mood: ${mood}`);

        let allAlbums: Parameters<typeof shuffleAndFormatAlbums>[0] = [];

        const artistAlbums = await getAlbumsByArtists(mood as MoodType, 8);
        allAlbums = [...allAlbums, ...artistAlbums];

        const recommendationAlbums = await getAlbumsFromRecommendations(
            mood as MoodType,
            allAlbums
        );
        allAlbums = [...allAlbums, ...recommendationAlbums];

        const trendingAlbums = await getTrendingAlbums(mood as MoodType, allAlbums);
        allAlbums = [...allAlbums, ...trendingAlbums];

        const formattedAlbums = shuffleAndFormatAlbums(allAlbums, Math.max(12, 8));

        console.log(`Returning ${formattedAlbums.length} albums for mood: ${mood}`);

        return {
            type: "mood",
            mood,
            albums: formattedAlbums,
            tracks: [],
        };
    } catch (error) {
        console.error("Error getting default recommendations:", error);

        return {
            type: "mood",
            mood,
            albums: [],
            tracks: [],
            error: "Unable to fetch recommendations at this time",
        };
    }
};

const getPersonalizedRecommendations = async (userId: UserId,ratings: TasteRating[],reviews: TasteReview[],mood?: MoodType | string,useAI = false ): Promise<MoodRecommendations> => {
    try {
        let tasteProfile;
        let isUsingAiFallback = false;

        try {
            tasteProfile = await analyzeUserTaste(ratings, reviews, useAI);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            console.error("Personalized recommendations API failed:", message);
            isUsingAiFallback = true;
            const moodResult = await getDefaultRecommendations(mood || "happy");
            return {
                ...moodResult,
                isUsingAiFallback: true,
                fallbackReason: "AI analysis unavailable",
            };
        }

        let allAlbums: Parameters<typeof shuffleAndFormatAlbums>[0] = [];

        const artistAlbums = await getAlbumsByArtists(mood as MoodType, 8);
        allAlbums = [...allAlbums, ...artistAlbums];

        if (useAI) {
            try {
                const albumSearchQuery = await generateAISearchQuery(
                    tasteProfile,
                    mood as MoodType,
                    "album",
                    true
                );
                const albumSearchResponse = await axiosInstance.get("/search", {
                    params: {
                        q: albumSearchQuery,
                        type: "album",
                        limit: 10,
                        market: "US",
                    },
                });

                const foundAlbums = albumSearchResponse.data.albums?.items || [];
                const realAlbums = foundAlbums.filter(isRealAlbum);
                allAlbums = [...allAlbums, ...realAlbums];
            } catch (error: unknown) {
                const message = error instanceof Error ? error.message : String(error);
                console.error("AI album search failed:", message);
                isUsingAiFallback = true;
            }
        }

        const genres = extractGenresFromProfile(tasteProfile, mood as MoodType);
        const validGenres = genres.filter((g) => SPOTIFY_GENRE_SEEDS.includes(g));

        if (validGenres.length > 0) {
            const recommendationAlbums = await getAlbumsFromRecommendations(
                mood as MoodType,
                allAlbums
            );
            allAlbums = [...allAlbums, ...recommendationAlbums];
        }

        if (allAlbums.length < 8) {
            const trendingAlbums = await getTrendingAlbums(mood as MoodType, allAlbums);
            allAlbums = [...allAlbums, ...trendingAlbums];
        }

        const formattedAlbums = shuffleAndFormatAlbums(allAlbums, Math.max(12, 8));

        return {
            type: "personalized",
            tasteProfile: tasteProfile.summary,
            mood,
            albums: formattedAlbums,
            tracks: [],
            isUsingAiFallback,
        };
    } catch (error) {
        console.error("Error getting personalized recommendations:", error);
        return await getDefaultRecommendations(mood || "happy");
    }
};

export const getSmartRecommendations = async (userId: UserId,mood?: MoodType | string ): Promise<RecommendationsPayload> => {
    const ratings = await Rating.find({ userId }).limit(50).sort({ createdAt: -1 });
    const reviews = await Review.find({ userId }).limit(20).sort({ createdAt: -1 });

    let recommendations: MoodRecommendations;

    if (ratings.length >= 5) {
        recommendations = await getPersonalizedRecommendations(
            userId,
            ratings,
            reviews,
            mood,
            false
        );
    } else {
        recommendations = await getDefaultRecommendations(mood || "happy");
    }

    return {
        recommendations,
        availableMoods: Object.keys(MOOD_CONFIGURATIONS),
        aiRateLimitInfo: getAIRateLimitInfo(),
    };
};

export const getAIRecommendations = async (userId: UserId,mood?: MoodType | string): Promise<RecommendationsPayload> => {
    const rateLimitInfo = getAIRateLimitInfo();
    if (!rateLimitInfo.canMakeRequest) {
        throw new AppError(
            `AI requests exhausted. Try again in ${rateLimitInfo.timeUntilReset} seconds.`,
            429,
            { aiRateLimitInfo: rateLimitInfo }
        );
    }

    const ratings = await Rating.find({ userId }).limit(50).sort({ createdAt: -1 });
    const reviews = await Review.find({ userId }).limit(20).sort({ createdAt: -1 });

    let recommendations: MoodRecommendations;

    if (ratings.length >= 5) {
        recommendations = await getPersonalizedRecommendations(
            userId,
            ratings,
            reviews,
            mood,
            true
        );
    } else {
        recommendations = await getDefaultRecommendations(mood || "happy");
        recommendations.needMoreData = true;
    }

    return {
        recommendations,
        availableMoods: Object.keys(MOOD_CONFIGURATIONS),
        aiRateLimitInfo: getAIRateLimitInfo(),
        aiPowered: true,
    };
};
