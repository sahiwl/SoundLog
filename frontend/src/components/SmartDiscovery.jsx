import React, { useState } from 'react';
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

const SmartDiscovery = () => {
    const [recommendations, setRecommendations] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedMood, setSelectedMood] = useState(null);
    const [error, setError] = useState(null);
    const [hasStarted, setHasStarted] = useState(false);

    const fetchMoodRecommendations = async (mood) => {
        setLoading(true);
        setError(null);
        setHasStarted(true);

        try {
            const response = await axiosInstance.get('/ai/recommendations', {
                params: { mood }
            });
            setRecommendations(response.data);
        } catch (error) {
            console.error('Error fetching mood recommendations:', error);
            setError('Unable to fetch recommendations. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleMoodSelect = (mood) => {
        setSelectedMood(mood);
        fetchMoodRecommendations(mood);
    };

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

    return (
        <section className="mb-12">
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                    <Sparkles className="text-purple-400" size={20} />
                    <h2 className="text-xl md:text-2xl font-bold text-white tracking-wide">
                        SMART DISCOVERY USING AI ✨
                    </h2>
                </div>
                <p className="text-gray-400 text-sm mb-6">
                    How are you feeling today?
                </p>

                {/* Mood Selector */}
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-6">
                    {Object.keys(MOOD_ICONS).map((mood) => {
                        const IconComponent = MOOD_ICONS[mood];
                        const colorClass = MOOD_COLORS[mood];
                        const isSelected = selectedMood === mood;

                        return (
                            <button
                                key={mood}
                                onClick={() => handleMoodSelect(mood)}
                                className={`
                                    flex flex-col items-center gap-2 p-3 rounded-lg border transition-all
                                    ${isSelected ? colorClass : 'text-gray-400 bg-gray-800/50 border-gray-700 hover:border-gray-600'}
                                `}
                            >
                                <IconComponent size={20} />
                                <span className="text-xs font-medium">
                                    {mood.charAt(0).toUpperCase() + mood.slice(1)}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Initial state before any mood is selected */}
            {!hasStarted && (
                <div className="text-center py-12 bg-gray-800/30 rounded-lg border border-gray-700">
                    <div className="max-w-md mx-auto">
                        <Sparkles className="mx-auto mb-4 text-purple-400 opacity-50" size={48} />
                        <h3 className="text-white text-lg font-medium mb-2">
                            Discover Music for Your Mood
                        </h3>
                        <p className="text-gray-400 text-sm">
                            Select how you're feeling above to get music recommendations powered by AI, tailored to your current vibe.
                        </p>
                    </div>
                </div>
            )}


            {loading && (
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto mb-4"></div>
                        <p className="text-gray-400 text-sm">
                            Finding perfect {selectedMood} vibes for you...
                        </p>
                    </div>
                </div>
            )}


            {error && !loading && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-center">
                    <p className="text-red-300 text-sm">{error}</p>
                    <button
                        onClick={() => fetchMoodRecommendations(selectedMood)}
                        className="text-red-200 hover:text-red-100 text-xs mt-2 underline"
                    >
                        Try again
                    </button>
                </div>
            )}


            {recommendations && !loading && !error && (
                <div>
                    <div className="mb-4">
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                            <p className="text-blue-300 text-sm font-medium flex items-center gap-2">
                                🌟 Suggested for you
                                <span className="text-xs text-blue-200 font-normal">
                                    powered by AI
                                </span>
                            </p>
                            <p className="text-blue-200 text-xs mt-1">
                                Perfect albums for your {selectedMood} mood
                            </p>
                        </div>
                    </div>

         
                    {recommendations.recommendations.albums?.length > 0 ? (
                        <div className="carousel carousel-center w-full p-4 gap-6 space-x-6 rounded-box">
                            {recommendations.recommendations.albums.slice(0, 8).map(renderAlbumCard)}
                        </div>
                    ) : (
                        <div className="text-center text-gray-400 py-8">
                            <Music className="mx-auto mb-2 opacity-50" size={32} />
                            <p className="text-sm">No recommendations available for this mood</p>
                            <p className="text-xs mt-1">Try selecting a different mood</p>
                        </div>
                    )}

                    {/* Refresh Button */}
                    <div className="text-center mt-4">
                        <button
                            onClick={() => fetchMoodRecommendations(selectedMood)}
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                            Get More {selectedMood.charAt(0).toUpperCase() + selectedMood.slice(1)} Vibes
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
};

export default SmartDiscovery;
