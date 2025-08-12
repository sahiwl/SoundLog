import React, { useState, useEffect } from 'react';
import { Sparkles, Music, Heart, Zap, Coffee, Focus, PartyPopper } from 'lucide-react';
import { axiosInstance } from '../lib/axios';
import { Link } from 'react-router-dom';

const MOOD_ICONS = {
    happy: Heart,
    sad: Music,
    energetic: Zap,
    chill: Coffee,
    focus: Focus,
    party: PartyPopper
};

const MOOD_COLORS = {
    happy: 'text-pink-400 bg-pink-400/10 border-pink-400/20',
    sad: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    energetic: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
    chill: 'text-green-400 bg-green-400/10 border-green-400/20',
    focus: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
    party: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
};

const SmartRecommendations = () => {
    const [recommendations, setRecommendations] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedMood, setSelectedMood] = useState(null);
    const [error, setError] = useState(null);

    const fetchRecommendations = async (mood = null) => {
        setLoading(true);
        setError(null);
        try {
            const params = mood ? { mood } : {};
            const response = await axiosInstance.get('/ai/recommendations', { params });
            setRecommendations(response.data);
        } catch (error) {
            console.error('Error fetching recommendations:', error);
            setError('Unable to fetch recommendations. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleMoodSelect = (mood) => {
        setSelectedMood(mood);
        fetchRecommendations(mood);
    };

    useEffect(() => {
        // Load initial recommendations
        fetchRecommendations();
    }, []);

    const renderAlbumCard = (album) => (
        <Link
            to={`/album/${album.id}`}
            key={album.id}
            className="bg-[#2A2E37] rounded-lg p-3 hover:bg-[#31353E] transition-colors group block"
        >
            <div className="flex items-center gap-3">
                {album.images?.[2] && (
                    <img
                        src={album.images[2].url}
                        alt={album.name}
                        className="w-12 h-12 lg:w-14 lg:h-14 rounded-md object-cover flex-shrink-0"
                    />
                )}
                <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-white truncate text-sm lg:text-base">{album.name}</h4>
                    <p className="text-xs lg:text-sm text-gray-400 truncate">
                        {album.artists.map(artist => artist.name).join(', ')}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-gray-500 truncate">
                            {album.release_date?.substring(0, 4)} • {album.total_tracks} tracks
                        </p>
                        {album.album_type && (
                            <span className="text-xs text-purple-400 uppercase">
                                {album.album_type}
                            </span>
                        )}
                    </div>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-purple-400 flex-shrink-0">
                    <Music size={16} />
                </div>
            </div>
        </Link>
    );

    const renderTrackCard = (track) => (
        <Link
            to={`/album/${track.album.id}`}
            key={track.id}
            className="bg-[#2A2E37] rounded-lg p-3 hover:bg-[#31353E] transition-colors group block"
        >
            <div className="flex items-center gap-3">
                {track.album.images?.[2] && (
                    <img
                        src={track.album.images[2].url}
                        alt={track.album.name}
                        className="w-10 h-10 lg:w-12 lg:h-12 rounded-md object-cover flex-shrink-0"
                    />
                )}
                <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-white truncate text-sm lg:text-base">{track.name}</h4>
                    <p className="text-xs lg:text-sm text-gray-400 truncate">
                        {track.artists.map(artist => artist.name).join(', ')}
                    </p>
                    <p className="text-xs text-gray-500 truncate">from {track.album.name}</p>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-purple-400 flex-shrink-0">
                    <Music size={14} />
                </div>
            </div>
        </Link>
    );

    return (
        <div className="bg-[#1D232A] rounded-xl p-4 lg:p-6">
            <div className="flex items-center gap-3 mb-4 lg:mb-6">
                <Sparkles className="text-purple-400" size={20} />
                <h2 className="text-lg lg:text-xl font-bold text-white">Smart Discovery</h2>
            </div>

            {/* Mood Selector */}
            <div className="mb-4 lg:mb-6">
                <h3 className="text-sm font-medium text-gray-300 mb-2 lg:mb-3">How are you feeling?</h3>
                <div className="grid grid-cols-2 lg:flex lg:flex-wrap gap-2">
                    {Object.keys(MOOD_ICONS).map((mood) => {
                        const IconComponent = MOOD_ICONS[mood];
                        const colorClass = MOOD_COLORS[mood];
                        const isSelected = selectedMood === mood;

                        return (
                            <button
                                key={mood}
                                onClick={() => handleMoodSelect(mood)}
                                className={`
                  flex items-center justify-center lg:justify-start gap-1 lg:gap-2 px-2 lg:px-3 py-2 rounded-full text-xs lg:text-sm font-medium border transition-all
                  ${isSelected ? colorClass : 'text-gray-400 bg-gray-800/50 border-gray-700 hover:border-gray-600'}
                `}
                            >
                                <IconComponent size={12} />
                                <span className="hidden lg:inline">{mood.charAt(0).toUpperCase() + mood.slice(1)}</span>
                                <span className="lg:hidden">{mood.charAt(0).toUpperCase()}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {loading && (
                <div className="flex items-center justify-center py-8 lg:py-12">
                    <div className="animate-spin rounded-full h-6 w-6 lg:h-8 lg:w-8 border-b-2 border-purple-400"></div>
                </div>
            )}

            {/* Error State */}
            {error && !loading && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4">
                    <p className="text-sm text-red-300">{error}</p>
                    <button
                        onClick={() => fetchRecommendations(selectedMood)}
                        className="text-xs text-red-200 hover:text-red-100 mt-1 underline"
                    >
                        Try again
                    </button>
                </div>
            )}

            {recommendations && !loading && !error && (
                <div>
                    <div className="mb-3 lg:mb-4">
                        {recommendations.isPersonalized ? (
                            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-2 lg:p-3">
                                <p className="text-xs lg:text-sm text-purple-300 font-medium">
                                    🎯 Personalized for you
                                </p>
                                {recommendations.recommendations.tasteProfile && (
                                    <p className="text-xs text-purple-200 mt-1">
                                        {recommendations.recommendations.tasteProfile}
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-2 lg:p-3">
                                <p className="text-xs lg:text-sm text-blue-300 font-medium">
                                    🌟 Mood-based recommendations
                                </p>
                                <p className="text-xs text-blue-200 mt-1">
                                    Start rating and reviewing music to get personalized suggestions!
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Album and Track Lists */}
                    <div className="space-y-4 max-h-80 lg:max-h-96 overflow-y-auto custom-scrollbar">
                        {recommendations.recommendations.albums?.length > 0 && (
                            <div>
                                <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                                    🎵 Recommended Albums
                                    <span className="text-xs text-purple-400">({recommendations.recommendations.albums.length})</span>
                                </h4>
                                <div className="space-y-2">
                                    {recommendations.recommendations.albums.map(renderAlbumCard)}
                                </div>
                            </div>
                        )}

                        {recommendations.recommendations.tracks?.length > 0 && (
                            <div>
                                <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                                    🎶 Recommended Tracks
                                    <span className="text-xs text-blue-400">({recommendations.recommendations.tracks.length})</span>
                                </h4>
                                <div className="space-y-2">
                                    {recommendations.recommendations.tracks.map(renderTrackCard)}
                                </div>
                            </div>
                        )}

                        {/* Fallback if no content */}
                        {(!recommendations.recommendations.albums || recommendations.recommendations.albums.length === 0) &&
                            (!recommendations.recommendations.tracks || recommendations.recommendations.tracks.length === 0) && (
                                <div className="text-center text-gray-400 py-8">
                                    <Music className="mx-auto mb-2 opacity-50" size={32} />
                                    <p className="text-sm">No recommendations available right now</p>
                                    <p className="text-xs mt-1">Try selecting a different mood or refresh</p>
                                </div>
                            )}
                    </div>

                    {/* Refresh Button */}
                    <button
                        onClick={() => fetchRecommendations(selectedMood)}
                        className="w-full mt-3 lg:mt-4 py-2 px-3 lg:px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs lg:text-sm font-medium transition-colors"
                    >
                        Get New Suggestions
                    </button>
                </div>
            )}
        </div>
    );
};

export default SmartRecommendations;
