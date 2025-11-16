import { GoogleGenerativeAI } from '@google/generative-ai';
import { MOOD_ARTISTS, getRandomArtistsFromMood } from '../data/moodArtists.js';
import { SPOTIFY_GENRE_SEEDS, MOOD_CONFIGURATIONS } from './recommendationStrategies.js';
import aiRateLimiter from './aiRateLimiter.js';

const AI_REQUEST_TIMEOUT = 10000; 

// init GenAI only when needed to avoid crashes on missing API key
let genAI = null;
const getGenAI = () => {
  if (!genAI && process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here') {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    console.log('Google Generative AI initialized');
  }
  return genAI;
};

const isQuotaError = (error) => {
  return error?.status === 429 || 
         error?.status === 503 ||
         error?.statusCode === 429 ||
         error?.statusCode === 503 ||
         error?.code === 'RESOURCE_EXHAUSTED' ||
         (error?.message && (
           error.message.toLowerCase().includes('quota') ||
           error.message.toLowerCase().includes('429') ||
           error.message.toLowerCase().includes('overloaded') ||
           error.message.toLowerCase().includes('503') ||
           error.message.toLowerCase().includes('rate limit')
         ));
};

const getFallbackArtistQuery = (mood, type) => {
  const randomArtists = getRandomArtistsFromMood(mood, 1);
  const randomArtist = randomArtists[0];
  return type === 'album' 
    ? `artist:"${randomArtist}"` 
    : `artist:"${randomArtist}" year:2015-2024`;
};


const makeAIRequestWithTimeout = async (aiCall) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, AI_REQUEST_TIMEOUT);

  try {
    // Note: Google Generative AI SDK may not support AbortController directly
    // This is a pattern for timeout handling - adjust based on actual SDK support
    const result = await Promise.race([
      aiCall(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('AI request timeout')), AI_REQUEST_TIMEOUT)
      )
    ]);
    clearTimeout(timeoutId);
    return result;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.message === 'AI request timeout') {
      throw new Error('AI request timed out after 10 seconds');
    }
    throw error;
  }
};

export const analyzeUserTaste = async (ratings, reviews, forceAI = false) => {
  const startTime = Date.now();
  console.log('analyzeUserTaste called', {
    ratingsCount: ratings?.length || 0,
    reviewsCount: reviews?.length || 0,
    forceAI,
    timestamp: new Date().toISOString()
  });

  try {
    // Input validation
    if (!Array.isArray(ratings) || !Array.isArray(reviews)) {
      console.error('Invalid input: ratings and reviews must be arrays');
      throw new Error('Invalid input: ratings and reviews must be arrays');
    }

    if (!process.env.GEMINI_API_KEY) {
      console.log('AI key not configured, using basic analysis');
      return createBasicTasteProfile(ratings, reviews);
    }
    
    // Rate limiting check - only use AI if forced (using a button) or if we have requests left
    if (!forceAI && !aiRateLimiter.canMakeRequest()) {
      const rateLimitInfo = aiRateLimiter.getStats();
      console.log('AI rate limit reached. Using basic analysis.', {
        remainingRequests: rateLimitInfo.remainingRequests,
        timeUntilReset: rateLimitInfo.timeUntilReset,
        currentRequests: rateLimitInfo.currentRequests,
        maxRequests: rateLimitInfo.maxRequests
      });
      return createBasicTasteProfile(ratings, reviews);
    }
    
    if (ratings.length < 3) {
      console.log('Insufficient rating data for AI analysis, using basic profile');
      return createBasicTasteProfile(ratings, reviews);
    }

    const model = getGenAI()?.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    if (!model) {
      throw new Error('AI service not available: missing API key');
    }

    const highRatedItems = ratings.filter(r => r.rating >= 70).slice(0, 10);
    const lowRatedItems = ratings.filter(r => r.rating <= 30).slice(0, 5);
    const recentReviews = reviews.slice(0, 5);


    const prompt = `
You are a music taste analyzer. Analyze the user's music preferences and create a taste profile.

HIGH RATED ITEMS (70+ rating):
${highRatedItems.length > 0 
  ? highRatedItems.map(r => `- ${r.itemType}: Rating ${r.rating}/100`).join('\n')
  : 'No high-rated items'}

LOW RATED ITEMS (≤30 rating):
${lowRatedItems.length > 0
  ? lowRatedItems.map(r => `- ${r.itemType}: Rating ${r.rating}/100`).join('\n')
  : 'No low-rated items'}

RECENT REVIEWS:
${recentReviews.length > 0
  ? recentReviews.map(r => `- "${(r.reviewText || '').substring(0, 200)}..."`).join('\n')
  : 'No recent reviews'}

Based on this data, provide ONLY a JSON response with:
1. A brief summary of their music taste (2-3 sentences)
2. 3-5 preferred genres from this list: ${SPOTIFY_GENRE_SEEDS.join(', ')}
3. Key characteristics they seem to value

Respond with ONLY valid JSON in this exact format (no markdown, no code blocks):
{
  "summary": "2-3 sentence summary of their music taste",
  "preferredGenres": ["genre1", "genre2", "genre3"],
  "characteristics": ["characteristic1", "characteristic2"]
}

Important: Preferred genres MUST be from this list: ${SPOTIFY_GENRE_SEEDS.join(', ')}
`;

    console.log('Making AI request for taste analysis...');
    
    // Make AI request with timeout - only record if successful
    let wasRecorded = false;
    try {
      // Check and record atomically BEFORE making the request
      if (!aiRateLimiter.canMakeRequestAndRecord()) {
        console.log('Rate limit reached before AI call, using basic analysis');
        return createBasicTasteProfile(ratings, reviews);
      }
      wasRecorded = true;

      const result = await makeAIRequestWithTimeout(async () => {
        return await model.generateContent(prompt);
      });
      
      const response = await result.response;
      const text = response.text();
      
      const duration = Date.now() - startTime;
      console.log(`AI taste analysis completed in ${duration}ms.`, {
        remainingRequests: aiRateLimiter.getRemainingRequests(),
        responseLength: text.length
      });
      
      // Parse JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        
        if (!parsed.summary || !Array.isArray(parsed.preferredGenres)) {
          throw new Error('Invalid AI response format');
        }
        
        console.log('Successfully parsed AI response', {
          summaryLength: parsed.summary?.length || 0,
          genresCount: parsed.preferredGenres?.length || 0,
          characteristicsCount: parsed.characteristics?.length || 0
        });
        
        return parsed;
      }
      
      throw new Error('Failed to parse AI response - no JSON found');
    } catch (error) {
      // If request failed after recording, undo it so it doesn't count against limit
      if (wasRecorded) {
        aiRateLimiter.undoLastRequest();
        console.log('Undid rate limit record due to failed request');
      }
      throw error;
    }
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error('Error analyzing user taste:', {
      error: error.message,
      stack: error.stack,
      duration: `${duration}ms`,
      isQuotaError: isQuotaError(error)
    });
    
    // Check if it's a quota/overload error specifically
    if (isQuotaError(error)) {
      console.log('⚠️  AI service temporarily unavailable (quota/overload), falling back to basic analysis');
    } else {
      console.log('⚠️  AI analysis failed, falling back to basic analysis:', error.message);
    }
    
    return createBasicTasteProfile(ratings, reviews);
  }
};


export const createBasicTasteProfile = (ratings, reviews) => {
  console.log('Creating basic taste profile (non-AI)');
  
  const highRatedCount = ratings.filter(r => r.rating >= 70).length;
  const avgRating = ratings.length > 0 ? 
    ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length : 50;
  
  let preferredGenres = ['pop', 'rock', 'indie'];
  
  if (avgRating > 75) {
    preferredGenres = ['indie', 'alternative', 'jazz'];
  } else if (avgRating < 40) {
    preferredGenres = ['pop', 'dance', 'electronic'];
  } else if (highRatedCount > 10) {
    preferredGenres = ['rock', 'folk', 'indie'];
  }

  return {
    summary: `Based on your ${ratings.length} ratings (avg: ${Math.round(avgRating)}/100), you have ${
      avgRating > 70 ? 'refined' : avgRating > 50 ? 'eclectic' : 'popular'
    } music taste with preference for quality over trends.`,
    preferredGenres: preferredGenres,
    characteristics: avgRating > 70 ? ["quality", "depth"] : ["variety", "accessibility"]
  };
};


export const generateAISearchQuery = async (tasteProfile, mood, type = 'track', forceAI = false) => {
  const startTime = Date.now();
  console.log('generateAISearchQuery called', {
    hasTasteProfile: !!tasteProfile,
    mood,
    type,
    forceAI,
    timestamp: new Date().toISOString()
  });

  try {
    // Input validation
    if (!tasteProfile || !tasteProfile.summary) {
      console.error('Invalid taste profile provided');
      throw new Error('Invalid taste profile provided');
    }

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      console.log('AI search query generation disabled (no API key), using curated artist search');
      return getFallbackArtistQuery(mood, type);
    }

    // Rate limiting to prevent exhausting of api limits
    if (!forceAI && !aiRateLimiter.canMakeRequest()) {
      const rateLimitInfo = aiRateLimiter.getStats();
      console.log('AI rate limit reached. Using curated artist search.', {
        remainingRequests: rateLimitInfo.remainingRequests,
        timeUntilReset: rateLimitInfo.timeUntilReset
      });
      return getFallbackArtistQuery(mood, type);
    }

    const model = getGenAI()?.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    if (!model) {
      console.log('Model not available, using curated artist search');
      return getFallbackArtistQuery(mood, type);
    }
    
    const prompt = `
Create a Spotify search query for a user with this music taste profile:
Summary: ${tasteProfile.summary}
Preferred genres: ${tasteProfile.preferredGenres?.join(', ') || 'none'}
Current mood: ${mood || 'any'}
Search type: ${type === 'album' ? 'albums' : 'tracks'}

Generate a search query that finds ${type === 'album' ? 'albums' : 'tracks'} by REAL POPULAR ARTISTS, not compilations.
Focus on artist names and avoid generic terms like "instrumental", "compilation", "various artists".

Examples of good queries:
- artist:"Billie Eilish"
- artist:"The Weeknd"
- artist:"Taylor Swift"

Response should be a single search query string using artist: syntax, maximum 50 characters.
Return ONLY the query string, nothing else.
`;

    console.log('Making AI request for search query generation...');
    
    // Make AI request with timeout - only record if successful
    let wasRecorded = false;
    try {
      // Check and record atomically BEFORE making the request
      if (!aiRateLimiter.canMakeRequestAndRecord()) {
        console.log('Rate limit reached before AI call, using curated artist search');
        return getFallbackArtistQuery(mood, type);
      }
      wasRecorded = true;

      const result = await makeAIRequestWithTimeout(async () => {
        return await model.generateContent(prompt);
      });
      
      const response = await result.response;
      let query = response.text().trim();
      
      const duration = Date.now() - startTime;
      console.log(`AI search query generated in ${duration}ms.`, {
        remainingRequests: aiRateLimiter.getRemainingRequests(),
        originalQuery: query
      });
      
      // Clean up the query and ensure it uses artist syntax
      query = query.replace(/['"]/g, '').substring(0, 100);
      
      if (!query.includes('artist:')) {
        console.log('AI query missing artist: syntax, using fallback');
        return getFallbackArtistQuery(mood, type);
      }
      
      console.log('Successfully generated AI search query', { query });
      return query;
    } catch (error) {
      // If request failed after recording, undo it so it doesn't count against limit
      if (wasRecorded) {
        aiRateLimiter.undoLastRequest();
        console.log('Undid rate limit record due to failed request');
      }
      throw error;
    }
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error('Error generating AI search query:', {
      error: error.message,
      stack: error.stack,
      duration: `${duration}ms`,
      isQuotaError: isQuotaError(error)
    });
    
    if (isQuotaError(error)) {
      console.log('⚠️  AI service temporarily unavailable (quota/overload), using curated artist search');
    } else {
      console.log('⚠️  AI search query generation failed, using curated artist fallback:', error.message);
    }
    
    return getFallbackArtistQuery(mood, type);
  }
};

export const extractGenresFromProfile = (tasteProfile, mood) => {
  let genres = [];

  if (tasteProfile?.preferredGenres) {
    genres = tasteProfile.preferredGenres.slice(0, 2);
  }
  
  if (mood && MOOD_CONFIGURATIONS[mood]) {
    const moodGenres = MOOD_CONFIGURATIONS[mood].genres;
    const moodGenre = moodGenres.find(g => SPOTIFY_GENRE_SEEDS.includes(g));
    if (moodGenre && !genres.includes(moodGenre)) {
      genres.push(moodGenre);
    }
  }

  while (genres.length < 3) {
    const randomGenre = SPOTIFY_GENRE_SEEDS[Math.floor(Math.random() * SPOTIFY_GENRE_SEEDS.length)];
    if (!genres.includes(randomGenre)) {
      genres.push(randomGenre);
    }
  }

  return genres.filter(g => SPOTIFY_GENRE_SEEDS.includes(g)).slice(0, 3);
};


export const getAIRateLimitInfo = () => {
  const stats = aiRateLimiter.getStats();
  return {
    canMakeRequest: stats.remainingRequests > 0,
    remainingRequests: stats.remainingRequests,
    timeUntilReset: stats.timeUntilReset,
    maxRequests: stats.maxRequests,
    windowMs: stats.windowMs,
    windowSeconds: stats.windowSeconds,
    currentRequests: stats.currentRequests,
    isAtLimit: stats.isAtLimit
  };
};
