import React, { useState, useEffect } from 'react';
import { Music } from 'lucide-react';
import { axiosInstance } from '../lib/axios';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

const UserLiked = () => {
    const [userLikedAlbums, setUserLikedAlbums] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { authUser } = useAuthStore();

    useEffect(() => {
        const fetchUserLikes = async () => {
            if (!authUser) return;

            setLoading(true);
            setError(null);

            try {
                // Fetch first page of user's liked albums
                const response = await axiosInstance.get(`/pages/${authUser.username}/likes`, {
                    params: { page: 1, limit: 12 } 
                });
                setUserLikedAlbums(response.data.albums);
            } catch (error) {
                console.error('Error fetching liked albums:', error);
                setError('Unable to fetch your liked albums');
            } finally {
                setLoading(false);
            }
        };

        fetchUserLikes();
    }, [authUser]);

    const renderAlbumCard = (album) => (
        <div key={album.albumId} className="carousel-item w-[280px] sm:w-[320px] lg:w-[330px] flex-shrink-0">
            <Link to={`/album/${album.albumId}`} className="group block w-full">
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
                        {album.artists?.[0]?.name}
                    </p>
                    <p className="text-gray-500 text-xs truncate w-full">
                        {album.release_date?.substring(0, 4)} • {album.album_type || 'Album'}
                    </p>
                </div>
            </Link>
        </div>
    );

    // Don't render if user has no liked albums
    if (!authUser || (!loading && userLikedAlbums.length === 0)) {
        return null;
    }

    return (
        <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-white tracking-wide">
                    YOU LIKED
                </h2>
                <Link
                    to={`/${authUser?.username}/likes`}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                    VIEW ALL
                </Link>
            </div>

            {loading && (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
                </div>
            )}

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-center">
                    <p className="text-red-300 text-sm">{error}</p>
                </div>
            )}

            {!loading && !error && userLikedAlbums.length > 0 && (
                <div className="carousel carousel-center w-full p-4 gap-6 space-x-6 rounded-box">
                    {userLikedAlbums.slice(0, 8).map(renderAlbumCard)}
                </div>
            )}
        </section>
    );
};

export default UserLiked;
