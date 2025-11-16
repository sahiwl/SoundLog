import React, { useState, useEffect } from 'react';
import { Music, RefreshCw } from 'lucide-react';
import { axiosInstance } from '../lib/axios';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { showToast } from '../lib/toastConfig';

const RecommendedAlbums = () => {
    const [albums, setAlbums] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasUserData, setHasUserData] = useState(false);
    const [isUsingFallback, setIsUsingFallback] = useState(false);
    const [aiRateLimitInfo, setAiRateLimitInfo] = useState(null);
    const [aiLoading, setAiLoading] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const { authUser } = useAuthStore();

    // Countdown effect for AI rate limiting
    useEffect(() => {
        if (aiRateLimitInfo && !aiRateLimitInfo.canMakeRequest && aiRateLimitInfo.timeUntilReset > 0) {
            // Start countdown from the timeUntilReset value
            setCountdown(aiRateLimitInfo.timeUntilReset);

            const timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        // Fetch updated rate limit info from backend when countdown ends
                        fetchRecommendedAlbums();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        } else if (aiRateLimitInfo?.canMakeRequest) {
            setCountdown(0);
        }
    }, [aiRateLimitInfo]);

    const fetchRecommendedAlbums = async () => {
        if (!authUser) return;

        setLoading(true);
        setError(null);

        try {
            const response = await axiosInstance.get('/ai/recommendations');
            const data = response.data;

            if (data.recommendations && data.recommendations.albums) {
                setAlbums(data.recommendations.albums);
                // Check if it's personalized recommendations (user has enough data)
                setHasUserData(data.recommendations.type === 'personalized');
                // Check if we're using AI fallback
                setIsUsingFallback(data.recommendations.isUsingAiFallback || false);
                // Store AI rate limit info - CRITICAL: Update immediately
                if (data.aiRateLimitInfo) {
                    setAiRateLimitInfo(data.aiRateLimitInfo);
                }
            } else {
                setHasUserData(false);
                setAlbums([]);
                setIsUsingFallback(false);
            }
        } catch (error) {
            console.error('Error fetching recommended albums:', error);
            setError('Unable to fetch recommendations');
        } finally {
            setLoading(false);
        }
    };

    const fetchAIRecommendations = async () => {
        if (!authUser) return;

        // CRITICAL FIX: Check rate limit BEFORE making request
        if (aiRateLimitInfo && !aiRateLimitInfo.canMakeRequest) {
            const timeRemaining = aiRateLimitInfo.timeUntilReset || 60;
            showToast.warn(`AI rate limit reached! Please wait ${timeRemaining} seconds before trying again.`);
            return;
        }

        // Disable button immediately to prevent spam
        setAiLoading(true);
        setError(null);

        try {
            const response = await axiosInstance.get('/ai/ai-recommendations');
            const data = response.data;

            if (data.recommendations && data.recommendations.albums) {
                // Add new AI albums to existing ones (avoiding duplicates)
                const existingIds = new Set(albums.map(album => album.id));
                const newAlbums = data.recommendations.albums.filter(album => !existingIds.has(album.id));
                setAlbums(prev => [...prev, ...newAlbums]);
                
                // CRITICAL FIX: Update rate limit info immediately from response
                if (data.aiRateLimitInfo) {
                    setAiRateLimitInfo(data.aiRateLimitInfo);
                    
                    // Show warning toast if rate limit is approaching or exhausted
                    if (!data.aiRateLimitInfo.canMakeRequest) {
                        showToast.warn(
                            `AI requests exhausted! Cooldown: ${data.aiRateLimitInfo.timeUntilReset}s`
                        );
                    } else if (data.aiRateLimitInfo.remainingRequests === 1) {
                        showToast.info('⚠️ Last AI request remaining! Use it wisely.');
                    }
                }
                
                showToast.success('🤖 AI recommendations loaded successfully!');
            }
        } catch (error) {
            console.error('Error fetching AI recommendations:', error);
            
            // Handle 429 rate limit errors with toast
            if (error.response?.status === 429) {
                const rateLimitInfo = error.response.data?.aiRateLimitInfo;
                const timeRemaining = rateLimitInfo?.timeUntilReset || 60;
                
                // Update rate limit info from error response
                if (rateLimitInfo) {
                    setAiRateLimitInfo(rateLimitInfo);
                }
                
                showToast.error(
                    `🚫 AI rate limit exhausted! Try again in ${timeRemaining} seconds.`
                );
                setError(`AI requests exhausted. Try again in ${timeRemaining} seconds.`);
            } else {
                showToast.error('Unable to fetch AI recommendations. Please try again.');
                setError('Unable to fetch AI recommendations');
            }
        } finally {
            setAiLoading(false);
        }
    };

    useEffect(() => {
        if (authUser) {
            fetchRecommendedAlbums();
        }
    }, [authUser]);

    const renderAlbumCard = (album) => (
        <div key={album.id} className="carousel-item w-[280px] sm:w-[320px] lg:w-[330px] flex-shrink-0">
            <Link to={`/album/${album.id}`} className="group block w-full">
                <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-800">
                    {album.images?.[0] ? (
                        <img
                            src={album.images[0].url}
                            alt={album.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <Music className="text-gray-600" size={32} />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                </div>
                <div className="mt-3 space-y-1 w-full">
                    <h3 className="text-white text-sm font-medium truncate group-hover:text-purple-300 transition-colors w-full">
                        {album.name}
                    </h3>
                    <p className="text-gray-400 text-xs truncate w-full">
                        {album.artists?.map(artist => artist.name).join(', ')}
                    </p>
                    <p className="text-gray-500 text-xs truncate w-full">
                        {album.release_date?.substring(0, 4)} • {album.album_type || 'Album'}
                    </p>
                </div>
            </Link>
        </div>
    );

    if (!albums.length && !loading) {
        return null;
    }

    // Determine if AI button should be disabled
    const isAIRateLimited = aiRateLimitInfo && (!aiRateLimitInfo.canMakeRequest || countdown > 0);

    return (
        <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-white tracking-wide">
                        {hasUserData ? 'RECOMMENDED ALBUMS' : 'DISCOVER ALBUMS'}
                    </h2>
                    <p className="text-gray-400 text-sm mt-1">
                        {hasUserData
                            ? (isUsingFallback
                                ? 'Enhanced recommendations (AI processing...)'
                                : 'Curated based on your music taste')
                            : 'Popular albums you might enjoy'
                        }
                        {isUsingFallback && (
                            <span className="text-yellow-400 text-xs ml-2">• Extra processing time</span>
                        )}
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={fetchRecommendedAlbums}
                        disabled={loading}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                    >
                        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                        <span className="hidden sm:inline">Refresh</span>
                    </button>

                    {/* AI Button - Only show if user has data and not rate limited */}
                    {hasUserData && (
                        <>
                            {!isAIRateLimited && (
                                <button
                                    onClick={fetchAIRecommendations}
                                    disabled={aiLoading}
                                    className="flex items-center gap-2 px-3 py-2 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors disabled:opacity-50"
                                >
                                    <span className="text-xs">🤖</span>
                                    <span className="hidden lg:inline text-xs">Discover with AI</span>
                                    <span className="lg:hidden text-xs">AI</span>
                                    {aiLoading && <div className="animate-spin rounded-full h-3 w-3 border-b border-white"></div>}
                                </button>
                            )}

                            {/* Rate Limit Cooldown Display */}
                            {isAIRateLimited && (
                                <div className="flex items-center gap-2 px-3 py-2 text-xs text-yellow-400 bg-yellow-400/10 rounded border border-yellow-400/20">
                                    <span>⏱️</span>
                                    <span>AI cooldown: {countdown}s</span>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {(loading || aiLoading) && (
                <div className="flex flex-col items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mb-3"></div>
                    {aiLoading && (
                        <p className="text-gray-400 text-sm text-center">
                            🤖 AI is discovering personalized albums...<br />
                            <span className="text-purple-400 text-xs">Using advanced taste analysis</span>
                        </p>
                    )}
                    {loading && isUsingFallback && (
                        <p className="text-gray-400 text-sm text-center">
                            AI system is processing your taste profile...<br />
                            <span className="text-yellow-400 text-xs">This may take a moment longer</span>
                        </p>
                    )}
                </div>
            )}

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-center">
                    <p className="text-red-300 text-sm">{error}</p>
                    <button
                        onClick={fetchRecommendedAlbums}
                        className="text-red-200 hover:text-red-100 text-xs mt-2 underline"
                    >
                        Try again
                    </button>
                </div>
            )}

            {!loading && !aiLoading && !error && albums.length > 0 && (
                <div className="carousel carousel-center w-full p-4 gap-6 space-x-6 rounded-box">
                    {albums.slice(0, Math.max(8, albums.length)).map(renderAlbumCard)}
                </div>
            )}
        </section>
    );
};

export default RecommendedAlbums;
