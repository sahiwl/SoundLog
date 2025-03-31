import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { axiosInstance } from '../lib/axios';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const NewReleasesPage = () => {
    const [albums, setAlbums] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalAlbums, setTotalAlbums] = useState(0);
    const [error, setError] = useState("");
    const limit = 20;

    useEffect(() => {
        const fetchNewReleases = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get('/pages/newreleases', {
                    params: { page: currentPage }
                });
                setAlbums(response.data.albums);
                setTotalAlbums(response.data.totalAlbums); 
            } catch (error) {
                console.error('Error fetching new releases:', error);
                setError('Failed to load albums.');
            } finally {
                setLoading(false);
            }
        };

        fetchNewReleases();
    }, [currentPage]); // Re-fetch when currentPage changes

    if (loading) return <div className="flex justify-center items-center min-h-screen "> <div className="loading loading-infinity loading-xl"></div> </div>
    if (error) return <p>{error}</p>;
    if (!albums.length) return <p>No new releases found</p>;

    return (
        <div className="bg-background text-white pt-28 min-h-screen">
            <div className="container mx-auto px-4 py-6">
                <h1 className="text-3xl font-bold mb-6">New Releases</h1>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {albums.map((album) => (
                        <Link 
                            to={`/album/${album.albumId}`}
                            key={album.albumId} 
                            className="bg-grids rounded-lg overflow-hidden hover:opacity-75 transition-opacity"
                        >
                            <img
                                src={album.images?.[0]?.url || "/placeholder.svg"}
                                alt={album.name}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-2">
                                <h3 className="text-sm font-medium truncate">{album.name}</h3>
                                <p className="text-xs text-gray-400 truncate">
                                    {album.artists?.[0]?.name}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
                <div className="flex justify-center mt-6 space-x-4">
                    {currentPage > 1 && (
                        <button 
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            className="px-4 py-2 flex items-center gap-2 bg-gray-700 hover:bg-gray-800 text-white font-semibold rounded-lg transition duration-300"
                        >
                            <ArrowLeft size={16} /> Previous
                        </button>
                    )}
                    {(currentPage * limit) < totalAlbums && (
                        <button 
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            className="px-4 py-2 flex items-center gap-2 bg-gray-700 hover:bg-gray-800 text-white font-semibold rounded-lg transition duration-300"
                        >
                            Next <ArrowRight size={16} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NewReleasesPage;
