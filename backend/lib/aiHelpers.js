import { GoogleGenerativeAI } from '@google/generative-ai';
import { MOOD_ARTISTS, getRandomArtistsFromMood } from '../data/moodArtists.js';
import { SPOTIFY_GENRE_SEEDS, MOOD_CONFIGURATIONS } from './recommendationStrategies.js';
import aiRateLimiter from './aiRateLimiter.js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// analyze user's music taste using AI or basic analysis (if no ai)
export const analyzeUserTaste = async (ratings, reviews, forceAI = false) => {
  try {
   
    if (!process.env.GEMINI_API_KEY) {
      console.log('AI key not configured, using basic analysis');
      return createBasicTasteProfile(ratings, reviews);
    }
    
    // rate limiting check only use AI if forced (using a button) or if we have requests left
    if (!forceAI && !aiRateLimiter.canMakeRequest()) {
      console.log(`⚠️  AI rate limit reached (${aiRateLimiter.getRemainingRequests()} requests left). Reset in ${aiRateLimiter.getTimeUntilReset()}s. Using basic analysis.`);
      return createBasicTasteProfile(ratings, reviews);
    }
    
    if (ratings.length < 3) {
      console.log('Insufficient rating data for AI analysis, using basic profile');
      return createBasicTasteProfile(ratings, reviews);
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // user data for analysis
    const highRatedItems = ratings.filter(r => r.rating >= 70).slice(0, 10);
    const lowRatedItems = ratings.filter(r => r.rating <= 30).slice(0, 5);
    const recentReviews = reviews.slice(0, 5);

    const prompt = `
    As a music taste analyzer, analyze this user's music preferences and create a taste profile.
    
    HIGH RATED ITEMS (70+ rating):
    ${highRatedItems.map(r => `- ${r.itemType}: Rating ${r.rating}/100`).join('\n')}
    
    LOW RATED ITEMS (30- rating):
    ${lowRatedItems.map(r => `- ${r.itemType}: Rating ${r.rating}/100`).join('\n')}
    
    RECENT REVIEWS:
    ${recentReviews.map(r => `- "${r.reviewText.substring(0, 200)}..."`).join('\n')}
    
    Based on this data, provide ONLY a JSON response with:
    1. A brief summary of their music taste (2-3 sentences)
    2. 3-5 preferred genres from this list: ${SPOTIFY_GENRE_SEEDS.join(', ')}
    3. Key characteristics they seem to value
    
    JSON format:
    {
      "summary": "Brief taste summary",
      "preferredGenres": ["genre1", "genre2", "genre3"],
      "characteristics": ["characteristic1", "characteristic2"]
    }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    aiRateLimiter.recordRequest();
    console.log(`✅ AI taste analysis completed. Remaining requests: ${aiRateLimiter.getRemainingRequests()}`);
    
    // parse JSON from the res
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return parsed;
    }
    
    throw new Error('Failed to parse AI response');
  } catch (error) {
    console.error('Error analyzing user taste:', error);
    
    //check if it's a quota/overload error specifically
    if (error.status === 429 || error.status === 503 || 
        error.message.includes('quota') || error.message.includes('429') || 
        error.message.includes('overloaded') || error.message.includes('503')) {
      console.log('⚠️  AI service temporarily unavailable (quota/overload), falling back to basic analysis with extra processing time');
    } else {
      console.log('⚠️  AI analysis failed, falling back to basic analysis:', error.message);
    }
    
    return createBasicTasteProfile(ratings, reviews);
  }
};

// Helper func to create basic taste profile without AI (when api limits are exhausted)
export const createBasicTasteProfile = (ratings, reviews) => {
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

// search queries using ai 
export const generateAISearchQuery = async (tasteProfile, mood, type = 'track', forceAI = false) => {
  try {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      console.log('AI search query generation disabled (no API key), using curated artist search');
      const randomArtists = getRandomArtistsFromMood(mood, 1);
      const randomArtist = randomArtists[0];
      return type === 'album' 
        ? `artist:"${randomArtist}"` 
        : `artist:"${randomArtist}" year:2015-2024`;
    }

  // rate limiting to prevent exhausting of api limits
    if (!forceAI && !aiRateLimiter.canMakeRequest()) {
      console.log(`⚠️  AI rate limit reached (${aiRateLimiter.getRemainingRequests()} requests left). Reset in ${aiRateLimiter.getTimeUntilReset()}s. Using curated artist search.`);
      const randomArtists = getRandomArtistsFromMood(mood, 1);
      const randomArtist = randomArtists[0];
      return type === 'album' 
        ? `artist:"${randomArtist}"` 
        : `artist:"${randomArtist}" year:2015-2024`;
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `
    Create a Spotify search query for a user with this music taste profile:
    ${tasteProfile.summary}
    Preferred genres: ${tasteProfile.preferredGenres.join(', ')}
    Current mood: ${mood || 'any'}
    Search type: ${type === 'album' ? 'albums' : 'tracks'}
    
    Generate a search query that finds ${type === 'album' ? 'albums' : 'tracks'} by REAL POPULAR ARTISTS, not compilations.
    Focus on artist names and avoid generic terms like "instrumental", "compilation", "various artists".
    Examples: artist:"Billie Eilish", artist:"The Weeknd", artist:"Taylor Swift"
    
    Response should be a single search query string using artist: syntax, maximum 50 characters.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let query = response.text().trim();
    
    aiRateLimiter.recordRequest();
    console.log(`✅ AI search query generated. Remaining requests: ${aiRateLimiter.getRemainingRequests()}`);
    
    // clean up the query and ensure it uses artist syntax
    query = query.replace(/['"]/g, '').substring(0, 100);
    
    // if AI fails to return artist focused query, fallback to curated artists from user data
    if (!query.includes('artist:')) {
      const randomArtists = getRandomArtistsFromMood(mood, 1);
      const randomArtist = randomArtists[0];
      query = `artist:"${randomArtist}"`;
    }
    
    return query;
  } catch (error) {
    console.error('Error generating AI search query:', error);
    
    if (error.status === 429 || error.status === 503 || 
        error.message.includes('quota') || error.message.includes('429') || 
        error.message.includes('overloaded') || error.message.includes('503')) {
      console.log('⚠️  AI service temporarily unavailable (quota/overload), using curated artist search with extra processing');
    } else {
      console.log('⚠️  AI search query generation failed, using curated artist fallback:', error.message);
    }
    
    // fallback query with real artists
    const randomArtists = getRandomArtistsFromMood(mood, 1);
    const randomArtist = randomArtists[0];
    return type === 'album' 
      ? `artist:"${randomArtist}"` 
      : `artist:"${randomArtist}" year:2015-2024`;
  }
};


export const extractGenresFromProfile = (tasteProfile, mood) => {
  let genres = [];

  if (tasteProfile.preferredGenres) {
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

// get AI rate limiting info
export const getAIRateLimitInfo = () => {
  return {
    canMakeRequest: aiRateLimiter.canMakeRequest(),
    remainingRequests: aiRateLimiter.getRemainingRequests(),
    timeUntilReset: aiRateLimiter.getTimeUntilReset(),
    maxRequests: 2,
    windowMs: 60000
  };
};
